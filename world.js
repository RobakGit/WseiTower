let collisonArray = []
const addonsArray = []
let monsterCount = 0

const worldObject = [
    {
        width: 30,
        height: 200,
        bottom: 220,
        left: 100
    },
    {
        width: 300,
        height: 30,
        bottom: 200,
        left: 200
    },
    {
        width: 300,
        height: 30,
        bottom: 200,
        left: 800
    },
]

function genStructure(data) {
    const block = document.createElement("div");
    block.className = "block"
    block.style.width = `${data.width}px`
    block.style.height = `${data.height}px`
    block.style.position = "absolute"
    block.style.top = `${container.offsetHeight-data.bottom}px`
    block.style.left = `${data.left}px`
    if(data.id){
        block.id = data.id
    }
    if(data.color){
        block.style.borderRadius = "100%"
        block.style.background = data.color
    }
    if(data.move){
            if(data.class){
                block.className = `${data.move.side} ${data.class}`
            }
            else{
                block.className = data.move.side
            }
            
            block.setAttribute("move", data.move.value)
    }

    collisonArray.push({
        x: {
            L: data.left, 
            R: data.left + intFromPx(block.style.width)
        },
        y: {
            U: intFromPx(block.style.top), 
            D: intFromPx(block.style.top) + data.height
        },
        color: data.color,
        id: data.id,
        move: data.move
    })

    container.appendChild(block);
}

let autoWorldObject = []
function autoMap() {
    
    let height = 20
    let lastHeight;
    let platformOnFloor = parseInt(document.body.clientWidth/400)
    
    if(autoWorldObject.length > 0){
        autoWorldObject = autoWorldObject.filter(el => !el.color && el.id != "jumpBlock")
        autoWorldObject = autoWorldObject.slice(autoWorldObject.length - platformOnFloor, autoWorldObject.length)
        autoWorldObject.forEach(el => {
            el.bottom = 30
        })
        height += Math.random() * (220 - 100) + 125
    }

    while(height <= container.offsetHeight-100){
        for(let i = 0; i < platformOnFloor; i++) {
            if(parseInt(Math.random() * (8 - 0) + 0) == 1){
                if(parseInt(Math.random() * (1000 - 1) + 1)<80){
                    autoWorldObject.push({
                        id: `mover${i}-${height}`,
                        width: 30,
                        height: Math.random() * (220 - 40) + 40,
                        bottom: height+5,
                        move: {
                            side: "right",
                            value: 100
                        },
                        left: Math.random() * (container.offsetWidth - (height < 50 ? 70 : 0)) + (height < 50 ? 70 : 0),
                    })
                }
                else{
                    autoWorldObject.push({
                        width: 30,
                        height: Math.random() * (220 - 40) + 40,
                        bottom: height,
                        left: Math.random() * (container.offsetWidth - (height < 50 ? 70 : 0)) + (height < 50 ? 70 : 0),
                    })
                }
            }
            else {
                if(parseInt(Math.random() * (1000 - 1) + 1)<80){
                    autoWorldObject.push({
                        id: `mover${i}-${height}`,
                        width: Math.random() * (220 - 40) + 40,
                        height: 30,
                        bottom: height+5,
                        move: {
                            side: "right",
                            value: 100
                        },
                        left: Math.random() * (container.offsetWidth - (height < 50 ? 290 : 220)) + (height < 50 ? 70 : 0),
                    })
                }
                else{
                    autoWorldObject.push({
                        width: Math.random() * (220 - 40) + 40,
                        height: 30,
                        bottom: height,
                        left: Math.random() * (container.offsetWidth - (height < 50 ? 290 : 220)) + (height < 50 ? 70 : 0),
                    })
                }
            }
        }

        lastHeight = height
        height += Math.random() * (220 - 100) + 120
    }

    const platformCount = autoWorldObject.length

    for(let i = 0; i < platformOnFloor/2; i++){
        const jumpPlatform = parseInt(Math.random() * (platformCount - platformOnFloor) + 0)
        autoWorldObject.push({
            width: Math.random() * (220 - 40) + 40,
            id: "jumpBlock",
            height: 10,
            bottom: autoWorldObject[jumpPlatform].bottom+3,
            left: Math.random() * (container.offsetWidth - 290) + 70,
        })
    }

    speedPillPlatform = parseInt(Math.random() * (platformCount - platformOnFloor) + platformOnFloor)
    autoWorldObject.push({
        color: "blue",
        id: "firstSpeed",
        width: 20,
        height: 20,
        bottom: autoWorldObject[speedPillPlatform].bottom+30,
        left: autoWorldObject[speedPillPlatform].left+50
    })

    hugePillPlatform = parseInt(Math.random() * (platformCount - platformOnFloor) + platformOnFloor)
    autoWorldObject.push({
        color: "red",
        id: "firstHuge",
        width: 20,
        height: 20,
        bottom: autoWorldObject[hugePillPlatform].bottom+30,
        left: autoWorldObject[hugePillPlatform].left+50
    })

    // finishPillPlatform = parseInt(Math.random() * (platformCount - platformCount-(platformOnFloor-1)) + platformCount-(platformOnFloor-1))
    finishPillPlatform = platformCount-1
    autoWorldObject.push({
        color: "gold",
        id: "finishPill",
        width: 20,
        height: 20,
        bottom: autoWorldObject[finishPillPlatform].bottom+30,
        left: autoWorldObject[finishPillPlatform].left+5
    })

    if(level && level%2 && monsterCount < (platformCount-platformOnFloor)) monsterCount++
    autoWorldStableObjects = autoWorldObject.filter(el => (!el.move && !el.color))
    for(let i = 0; i < monsterCount; i++){
        MonsterPlatform = parseInt(Math.random() * (autoWorldStableObjects.length - platformOnFloor) + platformOnFloor)
        autoWorldObject.push({
            color: "grey",
            class: "monster",
            id: `monster-${i}`,
            width: 20,
            height: 20,
            move: {
                side: "left",
                value: parseInt(autoWorldStableObjects[MonsterPlatform].width - 20)
            },
            bottom: autoWorldStableObjects[MonsterPlatform].bottom+30,
            left: autoWorldStableObjects[MonsterPlatform].left + autoWorldStableObjects[MonsterPlatform].width - 20
        })
    }
    
    return autoWorldObject
}

let ObjectsMove
function nextLevel(){
    clearInterval(ObjectsMove)
    autoMap()
    const lastElements = []
    container.childNodes.forEach(el => {
        if(el.id !== "wseiMan") {
            lastElements.push(el)
        }
    })
    lastElements.forEach(el => {
        container.removeChild(el)
    })
    collisonArray = []
    world()
}

function world() {

    // worldObject.forEach(el => {
    autoWorldObject.forEach(el => {
        genStructure(el)
    })

    let endOfSequence = false
    ObjectsMove = setInterval(() => {
        for( platform of document.getElementsByClassName("right")){
            platform.style.left = `${intFromPx(platform.style.left) + (endOfSequence ? -1 : 1) * platform.getAttribute("move")}px`
        }
        for( platform of document.getElementsByClassName("left")){
            platform.style.left = `${intFromPx(platform.style.left) + (endOfSequence ? 1 : -1) * platform.getAttribute("move")}px`
        }
        endOfSequence = !endOfSequence
    }, 1400)
}
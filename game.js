const wseiMan = document.getElementById("wseiMan")
const manElement = document.getElementsByClassName("manElement")
const container = document.getElementById("container")
const scoreBoard = document.getElementById("scoreBoard")

window.addEventListener('keydown', move);
window.addEventListener('keyup', stopMove);

window.addEventListener('load', (event) => {
    autoMap()
    world()
    gravity()
    wseiMan.style.top = `${container.offsetHeight - 60}px`
});


wseiMan.style.top = "0px"
wseiMan.style.left = "0px"

let intervalJump
let intervalS
let intervalA
let intervalD
let intervalGravity
let jumpTime = 0
let jumpCount = 0
const jumpCountLimit = 2
const jumpTimeLimit = 30
let moveDistance = 1
const moveSpeed = 1
let jumpSpeed = 5
let gravitySpeed = 1
let manScale = 1
let level = 0
let startPosition
let jumpBoost = false

function intFromPx(value) {
    return parseInt(value.replace('px', ''))
}

function move(e) {
    if(e.code == "Space" && !intervalJump){
        manElement[0].style.top = "80%";
        manElement[1].style.top = "40%";
        if(jumpCount < 2) {
            ++jumpCount
            intervalJump = setInterval(() => {
                if(colision(wseiMan, "top", -jumpSpeed) || 0 >= (parseInt(wseiMan.style.top.replace('px', ''))) || jumpTime > jumpTimeLimit) return
                wseiMan.style.top = `${parseInt(wseiMan.style.top.replace('px', ''))-jumpSpeed}px`
                if(!jumpBoost)jumpTime++ 
            }, moveSpeed)
        }
    } 
    if(e.code == "KeyS" && !intervalS){
        intervalS = setInterval(() => {
            if(colision(wseiMan, "top", moveDistance) || container.offsetHeight-moveDistance <= (parseInt(wseiMan.style.top.replace('px', '')) + wseiMan.offsetHeight)) return
            wseiMan.style.top = `${parseInt(wseiMan.style.top.replace('px', ''))+moveDistance}px`
        }, moveSpeed)
    }
    if(e.code == "KeyA" && !intervalA){
        wseiMan.style.transform = `scaleX(-${manScale})`
        intervalA = setInterval(() => {
            if(colision(wseiMan, "left", -moveDistance) || 0 >= (parseInt(wseiMan.style.left.replace('px', '')))) return
            wseiMan.style.left = `${parseInt(wseiMan.style.left.replace('px', ''))-moveDistance}px`
        }, moveSpeed)
    } 
    if(e.code == "KeyD" && !intervalD){
        wseiMan.style.transform = `scaleX(${manScale})`
        intervalD = setInterval(() => {
            if(colision(wseiMan, "left", moveDistance) || container.offsetWidth-moveDistance <= (parseInt(wseiMan.style.left.replace('px', '')) + wseiMan.offsetWidth)) return
            wseiMan.style.left = `${parseInt(wseiMan.style.left.replace('px', ''))+moveDistance}px`
        }, moveSpeed)
    }
}

function stopMove(e) {
    if(e.code == "Space"){
        manElement[0].style.top = "0px";
        manElement[1].style.top = "10%";
        clearInterval(intervalJump)
        intervalJump = null
        jumpTime = 0
    }
    if(e.code == "KeyS"){
        clearInterval(intervalS)
        intervalS = null
    }
    if(e.code == "KeyA"){
        clearInterval(intervalA)
        intervalA = null
    } 
    if(e.code == "KeyD"){
        clearInterval(intervalD)
        intervalD = null
    }
    
}
function gravity(){
    intervalGravity = setInterval(() => {
        if(colision(wseiMan, "top", gravitySpeed) || container.offsetHeight-gravitySpeed <= (parseInt(wseiMan.style.top.replace('px', '')) + wseiMan.offsetHeight)){
            jumpCount = 0
            return
        }
        wseiMan.style.top = `${parseInt(wseiMan.style.top.replace('px', ''))+gravitySpeed}px`
    }, moveSpeed)
}

let to = 0
let moverLastPos = 0
function colision(element, vector, value){
    let Person
    if(vector == "top") {
        Person = {
            x: {
                L: intFromPx(element.style.left), 
                R: intFromPx(element.style.left)+ (element.width ? element.width : element.offsetWidth)
            },
            y: {
                U: intFromPx(element.style.top)+value,
                D: intFromPx(element.style.top)+ (element.height ? element.height : element.offsetHeight)+value
            }
        }
    }
    else {
        Person = {
            x: {
                L: intFromPx(element.style.left)+value, 
                R: intFromPx(element.style.left)+(element.width ? element.width : element.offsetWidth)+value
            },
            y: {
                U: intFromPx(element.style.top),
                D: intFromPx(element.style.top)+(element.height ? element.height : element.offsetHeight)
            }
        }
    }

    let isCollision = false;
    let collisionBlock
    collisonArray.forEach(async block => {
        // if(isCollision) return

        if(block.move){
            const el = document.getElementById(`${block.id}`).getBoundingClientRect()

            if(block.move.side == "right" || block.move.side == "left"){
                const xCorrection = el.left - block.x.L
                block.x.L += xCorrection
                block.x.R += xCorrection
            } 
        }

        if((Person.x.L <= block.x.L && block.x.L <= Person.x.R) || (Person.x.L <= block.x.R && block.x.R <= Person.x.R) || (block.x.L <= Person.x.L && Person.x.L <= block.x.R) || (block.x.L <= Person.x.R && Person.x.R <= block.x.R)){
            if((Person.y.U <= block.y.U && block.y.U <= Person.y.D) || (Person.y.U <= block.y.D && block.y.D <= Person.y.D)|| (block.y.U <= Person.y.U && Person.y.U <= block.y.D) || (block.y.U <= Person.y.D && Person.y.D <= block.y.D)){
                if(vector == "top" && value < 0) clearInterval(intervalJump)
                if(block.color) return interact(block)
                if(vector != "top") {
                    if(jumpCount == 2){
                        jumpCount = 1
                    }
                }
                if(vector == "top" && value > 0){
                    jumpCount = 0
                }
                collisionBlock = block
                return isCollision = true
            }
        }
    })
    if(isCollision){
        if(collisionBlock.move){
            if(moverLastPos){
                console.log(collisionBlock.x.L - moverLastPos)
                wseiMan.style.left = `${intFromPx(wseiMan.style.left)+(collisionBlock.x.L - moverLastPos > 0 ? 1.2 : 0.6)*(collisionBlock.x.L - moverLastPos)}px`
            }
            moverLastPos = collisionBlock.x.L
        }
        if(Person.x.L <= collisionBlock.x.R && Person.x.R-collisionBlock.x.R > (wseiMan.style.width ? intFromPx(wseiMan.style.width)-2 : wseiMan.offsetWidth - 2) && Person.y.D !== collisionBlock.y.U){
            wseiMan.style.left = `${collisionBlock.x.R + 1}px`
        }
        if(Person.x.R >= collisionBlock.x.L && Person.x.L-collisionBlock.x.L < -(wseiMan.style.width ? intFromPx(wseiMan.style.width)-2 : wseiMan.offsetWidth - 2) && Person.y.D !== collisionBlock.y.U){
            wseiMan.style.left = `${collisionBlock.x.L - (wseiMan.style.width ? parseInt(wseiMan.style.width.replace('px', ''))+1 : wseiMan.offsetWidth + 1)}px`
        }

        if(collisionBlock.id == "jumpBlock" && Person.y.D == collisionBlock.y.U){
            jumpBoost = true
        }
    }
    else{
        moverLastPos = 0
        setTimeout(() => {jumpBoost = false}, 100)
    }
    return isCollision
}

function interact(addon) {
    switch (addon.color){
        case "blue":
            moveDistance = 2
            break;
        case "red":
            if(manScale != 1.5 && startPosition){
                startPosition.top = `${intFromPx(startPosition.top)-40}px`
            }
            manScale = 1.5
            jumpSpeed = 6
            wseiMan.style.top = `${intFromPx(wseiMan.style.top)-30}px`
            wseiMan.style.width = "75px"
            wseiMan.style.height = "75px"
            manElement[7].style = `
            background: none;
            left: 55%;
            top: -265%;
            border-top: 15px solid transparent;
            border-left: 30px solid #cfff7f;
            border-bottom: 15px solid transparent;
            `
            break;
        case "grey":
            if(intFromPx(wseiMan.style.top)+(wseiMan.style.height ? intFromPx(wseiMan.style.height) : wseiMan.offsetHeight)-addon.y.U <= 5){}
            else{
                if(startPosition) {
                    wseiMan.style.top = startPosition.top
                    wseiMan.style.left = startPosition.left
                }
                else {
                    wseiMan.style.left = 0
                    wseiMan.style.top = `${container.offsetHeight - 60}px`
                }
                return
            }
            break;
        default:
            wseiMan.style.top = `${container.offsetHeight - (wseiMan.style.height ? intFromPx(wseiMan.style.height) : wseiMan.offsetHeight) -35}px`
            startPosition = {top: wseiMan.style.top, left: wseiMan.style.left}
            level++
            scoreBoard.innerHTML = `<h1>${level}</h1>`
            return nextLevel()
            break;
    }
    collisonArray = collisonArray.filter(el => {return el.id != addon.id})
    container.removeChild(document.getElementById(addon.id))
}
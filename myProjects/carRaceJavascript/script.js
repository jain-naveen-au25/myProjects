const score=document.querySelector('.score')
const startScreen=document.querySelector(".startScreen")
const gameArea=document.querySelector(".gameArea")
startScreen.addEventListener("click",start)
document.addEventListener("keydown",pressOn)
document.addEventListener("keyup",pressOff)
 let keys = {
            ArrowUp: false
            , ArrowDown: false
            , ArrowRight: false
            , ArrowLeft: false
        };
function playGame() {
            console.log("inplay");
            let car = document.querySelector(".car");
            if (player.start) {
                if (keys.ArrowUp) {
                    player.y -= player.speed;
                }
                if (keys.ArrowDown) {
                    player.y += player.speed;
                }
                if (keys.ArrowLeft) {
                    player.x -= player.speed;
                }
                if (keys.ArrowRight) {
                    player.x += player.speed;
                }
                car.style.left = player.x + 'px';
                car.style.top = player.y + 'px';
                window.requestAnimationFrame(playGame);
            }
        }

    
}
function start() {
            startScreen.classList.add("hide");
            gameArea.classList.remove("hide");
            player.start = true;
            window.requestAnimationFrame(playGame);
            let car = document.createElement("div");
            car.innerText = "Car";
            car.setAttribute("class", "car");
            gameArea.appendChild(car);
            player.x = car.offsetLeft;
            player.y = car.offsetTop;
            console.log(player);
        }
function start(){
    console.log("start")
    player.start=true
    window.requestAnimationFrame(playGame)
}
function pressOn(e) {
    console.log(e.key+"is pressed")
    keys[e.keys]=true
    console.log(keys)
}
function pressOff() {
    console.log(e.key+"is released")
    keys[e.keys]=false
    console.log(keys)
}
let car=ducument.createElement("div")
car.innerhtml="car"
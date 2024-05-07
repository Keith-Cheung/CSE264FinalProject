//const { request } = require("express");

// creating the board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context; 

//frog properties
let frogHeight = 46;
let frogWidth = 46;
let frogX = boardWidth/2 - frogWidth/2;
let frogY = boardHeight*7/8 - frogHeight;
let frogImg; 

let frog = {
    img: null,
    x: frogX,
    y: frogY,
    width: frogWidth,
    height: frogHeight
}

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;


let gameover = false;
//physics
let velocityX, velocityY = 0;
let initVelocityY = -8; //starting y velocity for frog
let gravity = 0.4;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //context.fillStyle = "blue";
    //context.fillRect(frog.x, frog.y, frog.width, frog.height);

    frogImg = new Image();
    frogImg.src = "../images/frog.png";
    frog.img = frogImg;

    frogImg.onload = function(){
        console.log("frog loaded successfully")
        context.drawImage(frog.img, frog.x, frog.y, frog.width, frog.height);
    }

    platformImg = new Image();
    platformImg.src = "../images/lilypad_resize.png";


    velocityY = initVelocityY;
    placePlatforms()
    requestAnimationFrame(updateFrog);
    document.addEventListener("keydown", moveFrog);
    
}


function updateFrog(){
    requestAnimationFrame(updateFrog);

    if(gameover){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    frog.x += velocityX;
    if(frog.x > boardWidth){
        frog.x = 0;
    }
    else if(frog.x + frog.width < 0) {
        frog.x = boardWidth;
    }

    velocityY += gravity;
    frog.y += velocityY;
    if(frog.y > boardHeight){
        gameover = true;
    }
    context.drawImage(frog.img, frog.x, frog.y, frog.width, frog.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && frog.y < boardHeight*3/4) {
            platform.y -= initVelocityY; //slide platform down
        }
        if (detectCollision(frog, platform) && velocityY >= 0) {
            velocityY = initVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

} 

function moveFrog(move){
    if(move.code == "ArrowRight"){
        velocityX = 2; 
        frog.img = frogImg;
    }
    else if(move.code == "ArrowLeft"){
        velocityX = -2;
        frog.img = frogImg;
    }
    else if(move.code == "Space" && gameover){
        //click space bar to restart the game
        frog = {
            img: frogImg,
            x: frogX,
            y: frogY,
            width: frogWidth,
            height: frogHeight
        }
        velocityX = 0;
        velocityY = initVelocityY;
        gameover = false;
        placePlatforms()
        //add scoring info

    }
}


function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); 
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
    a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner

}






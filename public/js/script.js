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

let gameover = false;
let velocityX, velocityY = 0;
let initVelocity = -8; //starting y velocity for frog
let gravity = 0.5;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    context.fillStyle = "blue";
    context.fillRect(frog.x, frog.y, frog.width, frog.height);

    frogImg = new Image();
    frogImg.src = "../images/frog.png";
    frog.img = frogImg;

    frogImg.onload = function(){
        context.drawImage(frog.img, frog.x, frog.y, frog.width, frog.height);
    }
}

function updateFrog(){
    requestAnimationFrame(updateFrog);

    if(gameover){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    frog.x += velocityX;
    if(frog.x > boardWidth){
        frog.x = boardWidth;
    }
    else if(frog.x + frog.width < 0) {
        frog.x = boardWidth;
    }

    velocityY += gravity;
    frog.y = velocityY;
    if(frog.y > boardHeight){
        gameover = true;
    }
    context.drawImage(frog.img, frog.x, frog.y, board.width, board.height);

    

} 





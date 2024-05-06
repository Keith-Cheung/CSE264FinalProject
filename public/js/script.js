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
let platformWidth = 90;
let platformHeight = 31;
let platformImg;

let lily = {
    img: null,
    x: 100,
    y: 100,
    width: 90,
    height: 31
}


let gameover = false;
let velocityX, velocityY = 0;
let initVelocityY = -8; //starting y velocity for frog
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
    lilyImg = new Image();
    lilyImg.src = "../images/lilypad_resize.png";
    lily.img = lilyImg;

    lilyImg.onload = function(){
        context.drawImage(lily.img, lily.x, lily.y, lily.width, lily.height);
    }

    velocityY = initVelocityY;
    requestAnimationFrame(updateFrog);
    document.addEventListener("keydown", moveFrog);
    
}



function updateFrog(){
    requestAnimationFrame(updateFrog);

    if(gameover){
        return;
    }

    //context.clearRect(0, 0, board.width, board.height);

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

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
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
        velocityX = 3; 
        frog.img = frogImg;
    }
    else if(move.code == "ArrowLeft"){
        velocityX = -3;
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
        //add scoring info
        //function for placing platforms

    }
}

/*function randomizeCoordinates(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function placeLilyPads() {
  const numLilyPads = 5; // Number of lily pads to place
  const lilyPadWidth = 90;
  const lilyPadHeight = 31;

  for (let i = 0; i < numLilyPads; i++) {
    const lilyPadX = randomizeCoordinates(0, boardWidth - lilyPadWidth);
    const lilyPadY = randomizeCoordinates(0, boardHeight - lilyPadHeight);

    // Draw lily pad on the canvas
    context.drawImage(lily.img, lilyPadX, lilyPadY, lilyPadWidth, lilyPadHeight);
  }
}

//placeLilyPads();
*/


function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : lilyImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    // platform = {
    //     img : lilyImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : lilyImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : lilyImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}






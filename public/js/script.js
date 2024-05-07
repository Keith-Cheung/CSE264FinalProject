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
let prevPlatform;

//mosquito properties
let mosquitoArray = [];
let mosquitoHeight = 46;
let mosquitoWidth = 46;
let mosquitoX, mosquitoY;
let mosquitoImg;
//const mosquitoSpawnChance = 1;

let score = 0;

let gameover = false;
//physics
let velocityX, velocityY = 0;
let initVelocityY = -7.5; //starting y velocity for frog
let gravity = 0.4;



window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //context.fillStyle = "blue";
    //context.fillRect(frog.x, frog.y, frog.width, frog.height);

    //creating images for frog
    frogImg = new Image();
    frogImg.src = "../images/frog.png";
    frog.img = frogImg;

    frogImg.onload = function(){
        console.log("frog loaded successfully")
        context.drawImage(frog.img, frog.x, frog.y, frog.width, frog.height);
    }
    //create image for platform
    platformImg = new Image();
    platformImg.src = "../images/lilypad_resize.png";

    //create image for mosquito
    mosquitoImg = new Image();
    mosquitoImg.src = "../images/mosquito.png";

    velocityY = initVelocityY;
    placePlatforms();
    placeMosquito(); // call the function to place mosquito
    console.log(mosquitoArray);
    requestAnimationFrame(updateFrog);
    document.addEventListener("keydown", moveFrog);
    document.addEventListener("keyup", StopXmovement);
    
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
        if (velocityY < 0 && frog.y < boardHeight*0.8) {
            platform.y -= initVelocityY; //slide platform down
        }
        if (detectCollision(frog, platform) && velocityY >= 0) {
            if(platform != prevPlatform){
                score++;
                //console.log(score);
            }
            prevPlatform = platform;

            //Noticed bug where sometimes jumps were too short if begining velocity was around 7.1
            //So we hard coded if statement to resolve the issue
            //this if statement fixes the jumps most of the time
            console.log("Velocity y before: " + velocityY + ", " + initVelocityY)
            if(velocityY > 7.0 && velocityY < 7.2){
                velocityY = -8.5; //jump
            }else{
                velocityY = initVelocityY; //jump
            }
            console.log("Velocity y after: " + velocityY + ", " + initVelocityY)
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //mosquitos
    for(let i = 0; i < mosquitoArray.length; i++){
        let mosquito = mosquitoArray[i];
        let prevMosquito;
        if (velocityY < 0 && frog.y < boardHeight*0.8) {
            mosquito.y -= initVelocityY; //slide mosquito down
        }
        if(detectCollision(frog, mosquito) && velocityY <= 0){
            gameover = true;
            console.log("Game over: " + velocityY + ", " + initVelocityY)
        }else if(detectCollision(frog, mosquito) && velocityY >= 0){
            if(mosquito != prevMosquito){
                score++;
                //console.log(score);
            }
            prevMosquito = mosquito;
            //Noticed bug where sometimes jumps were too short if begining velocity was around 7.1
            //So we hard coded if statement to resolve the issue
            //this if statement fixes the jumps most of the time
            console.log("Velocity y before: " + velocityY + ", " + initVelocityY)
            if(velocityY > 7.0 && velocityY < 7.2){
                velocityY = -8.5; //jump
            }else{
                velocityY = initVelocityY; //jump
            }
            console.log("Velocity y after: " + velocityY + ", " + initVelocityY)
        }
        context.drawImage(mosquito.img, mosquito.x, mosquito.y, mosquito.width, mosquito.height);
    }

    // clear mosquitos and add new mosquitos
    while (mosquitoArray.length > 0 && mosquitoArray[0].y >= boardHeight) {
        mosquitoArray.shift(); //removes first element from the array
        newMosquito(); //replace with new platform on top
    }

    //styling and displaying score
    context.fillStyle = "black";
    context.font = "24px Arial";
    context.fillText("Score: " + score, 5, 20);

    //Gameover text
    context.font = "36px Arial";
    let textWidth = context.measureText("Game Over!").width;
    let xPosition = (boardWidth - textWidth) / 2;
    if (gameover) {
        context.fillText("Game Over!", xPosition, boardHeight / 2);
        score = 0;
        prevPlatform = null;
        prevMosquito = null;
    }

} 

function moveFrog(move){
    if(move.code == "ArrowRight"){
        velocityX = 4; 
        frog.img = frogImg;
    }
    else if(move.code == "ArrowLeft"){
        velocityX = -4;
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
        placePlatforms();
        placeMosquito();

    }
}


function StopXmovement(move) {
    //Stop horizontal movement when arrow keys are released
    if (move.code == "ArrowRight" || move.code == "ArrowLeft") {
        velocityX = 0;
    }
}



function placePlatforms() {
    platformArray = [];

    let gapBetweenPlatform = 40;

    //let startX = boardWidth / 3;


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
        let randomX = Math.floor(Math.random() * boardWidth*2/4); 
        let platform = {
            img : platformImg,
            x : randomX + i * gapBetweenPlatform,
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

function placeMosquito(){
    mosquitoArray = [];

    
    let gapBetweenMosquitos = 100;

    //let randomChance = Math.random();

    for (let i = 0; i < 1; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*2/4); 
        let mosquito = {
            img : mosquitoImg,
            x : randomX + i * gapBetweenMosquitos,
            y : boardHeight - 75*i - 800,
            width : mosquitoWidth,
            height : mosquitoHeight
        };
        
        mosquitoArray.push(mosquito);
    }

}

function newMosquito() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let mosquito = {
        img : mosquitoImg,
        x : randomX,
        y : -mosquitoHeight,
        width : mosquitoWidth,
        height : mosquitoHeight
    }

    mosquitoArray.push(mosquito);
}






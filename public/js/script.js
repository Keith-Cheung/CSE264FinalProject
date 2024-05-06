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





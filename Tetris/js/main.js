var blockType = [
    {name : 'I', color : 'red'},
    {name : 'L', color : 'green'},
    {name : 'J', color : 'blue'},
    {name : 'T', color : 'yellow'},
    {name : 'O', color : 'skyblue'},
    {name : 'S', color : 'gray'},
    {name : 'Z', color : 'purple'},
]

var nowBlock;
var canvas = document.getElementById('game');

const BEGIN_X = 30;
const BEGIN_Y = 30;
const SPEED = 5;
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
const CANVAS_LEFT = canvas.clientLeft;
const CANVAS_RIGHT = canvas.clientLeft + WIDTH;
const CANVAS_TOP = canvas.clientTop;
const CANVAS_BOTTOM = canvas.clientTop + HEIGHT;

if(canvas.getContext){
    var ctx = canvas.getContext('2d');
}else{
    console.log('browser not supported canvas');
}

$(window).load(function(){
    console.log('load');
    drawNewBlock(2);
});

setInterval(function(){
    nowBlock.drawBlock(nowBlock.x, nowBlock.y+SPEED);
}, 500);

var drawNewBlock = function(blockTypeIndex){
    nowBlock = new Block(blockTypeIndex, BEGIN_X, BEGIN_Y);
    nowBlock.drawBlock(BEGIN_X, BEGIN_Y);
}

$(document).keydown(function(e){
    if (e.keyCode == 37) {
        nowBlock.drawBlock(nowBlock.x-SPEED, nowBlock.y);
    } else if(e.keyCode == 38) {
        // nowBlock.drawBlock(nowBlock.x, nowBlock.y-SPEED);
    } else if(e.keyCode == 39) {
        nowBlock.drawBlock(nowBlock.x+SPEED, nowBlock.y);
    } else if(e.keyCode == 40) {
        nowBlock.drawBlock(nowBlock.x, nowBlock.y+SPEED);
    }
});

function Block(blockTypeIndex, x, y){
    this.type = blockType[blockTypeIndex];
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 70;
    ctx.fillStyle = this.type.color;

    this.drawBlock = function(nx, ny){ 
        ctx.clearRect(this.x, this.y, this.width, this.height);
        if(nx < CANVAS_LEFT || nx + this.width> CANVAS_RIGHT) nx = this.x;
        if(ny + this.height > CANVAS_BOTTOM) {
            ny = this.y;
            drawNewBlock(2);
        }
        ctx.fillRect(nx, ny, this.width,this.height); 
        console.log(nx + ','+ny);
        this.x = nx;
        this.y = ny;  
    }
}
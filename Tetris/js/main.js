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
const SPEED = 2;

if(canvas.getContext){
    var ctx = canvas.getContext('2d');
}else{
    console.log('browser not supported canvas');
}

$(window).load(function(){
    console.log('load');
    drawNewBlock(2);
});

var drawNewBlock = function(blockTypeIndex){
    nowBlock = new Block(blockTypeIndex, BEGIN_X, BEGIN_Y);
    nowBlock.drawBlock(BEGIN_X, BEGIN_Y);
}

$(document).keydown(function(e){
    if (e.keyCode == 37) {
        console.log("left");
        nowBlock.drawBlock(nowBlock.x-SPEED, nowBlock.y);
    } else if(e.keyCode == 38) {
        console.log("up");
        nowBlock.drawBlock(nowBlock.x, nowBlock.y-SPEED);
    } else if(e.keyCode == 39) {
        console.log("right");
        nowBlock.drawBlock(nowBlock.x+SPEED, nowBlock.y);
    } else if(e.keyCode == 40) {
        console.log("down");
        nowBlock.drawBlock(nowBlock.x, nowBlock.y+SPEED);
    }
});

function Block(blockTypeIndex, x, y){
    this.type = blockType[blockTypeIndex];
    this.x = x;
    this.y = y;
    ctx.fillStyle = this.type.color;

    this.drawBlock = function(nx, ny){ 
        ctx.clearRect(this.x, this.y, 50, 50);
        this.x = nx;
        this.y = ny;
        ctx.fillRect(nx, ny, 50, 50);   
    }
}
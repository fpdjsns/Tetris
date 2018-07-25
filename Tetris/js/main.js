var blockType = [
    {
        name: "O",
        color: "skyblue",
        shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
    },
    {
        name: "S",
        color: "gray",
        shape: [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 1, 0], [0, 0, 0, 0]]
    },
    {
        name: "Z",
        color: "purple",
        shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0]]
    },
    {
        name: "I",
        color: "red",
        shape: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    },
    {
        name: "T",
        color: "yellow",
        shape: [[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
    },
    {
        name: "L",
        color: "green",
        shape: [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    },
    {
        name: "J",
        color: "blue",
        shape: [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    }
];

var nowBlock;
var canvas = document.getElementById("game");
var nextBlockType = Math.floor(Math.random() * blockType.length);

const BEGIN_X = 30;
const BEGIN_Y = 30;
const SPEED = 10;
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
const CANVAS_LEFT = canvas.clientLeft;
const CANVAS_RIGHT = canvas.clientLeft + WIDTH;
const CANVAS_TOP = canvas.clientTop;
const CANVAS_BOTTOM = canvas.clientTop + HEIGHT;
const SMALL_BLOCK_SIZE = 20;
const BIG_BLOCK_SIZE = SMALL_BLOCK_SIZE * 4;

const WAIT_NEXTBLOCK_TIME = 500;

if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
} else {
    console.log("browser not supported canvas");
}

$(window).load(function() {
    console.log("load");
    drawNewBlock();
});

setInterval(function() {
    nowBlock.drawBlock(nowBlock.x, nowBlock.y + SPEED);
}, 500);

var drawNewBlock = function() {
    nowBlock = new Block(nextBlockType, BEGIN_X, BEGIN_Y);
    nowBlock.drawBlock(BEGIN_X, BEGIN_Y);
    nextBlockType = Math.floor(Math.random() * blockType.length);
};

$(document).keydown(function(e) {
    if (e.keyCode == 37) {
        nowBlock.drawBlock(nowBlock.x - SPEED, nowBlock.y);
    } else if (e.keyCode == 38) {
        // nowBlock.drawBlock(nowBlock.x, nowBlock.y-SPEED);
    } else if (e.keyCode == 39) {
        nowBlock.drawBlock(nowBlock.x + SPEED, nowBlock.y);
    } else if (e.keyCode == 40) {
        nowBlock.drawBlock(nowBlock.x, nowBlock.y + SPEED);
    }
});

function Block(blockTypeIndex, x, y) {
    this.type = blockType[blockTypeIndex];
    this.x = x;
    this.y = y;

    this.drawBlock = function(nx, ny) {
        ctx.clearRect(this.x, this.y, BIG_BLOCK_SIZE, BIG_BLOCK_SIZE);
        if (nx < CANVAS_LEFT || nx + BIG_BLOCK_SIZE > CANVAS_RIGHT) nx = this.x;
        if (ny + BIG_BLOCK_SIZE > CANVAS_BOTTOM) {
            ny = this.y;
            setTimeout(drawNewBlock(), WAIT_NEXTBLOCK_TIME);
        }

        // Change colors just before drawing to avoid affecting the previous or next block color.
        ctx.fillStyle = this.type.color;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.type.shape[i][j] == 1)
                    ctx.fillRect(
                        nx + i * SMALL_BLOCK_SIZE,
                        ny + j * SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE
                    );
            }
        }
        console.log(nx + "," + ny);
        this.x = nx;
        this.y = ny;
    };
}

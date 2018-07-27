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

const SMALL_BLOCK_SIZE = 20;
const BIG_BLOCK_SIZE = SMALL_BLOCK_SIZE * 4;

const GAME_SCREEN_WIDTH = 10 * SMALL_BLOCK_SIZE;
const GAME_SCREEN_HEIGHT = 20 * SMALL_BLOCK_SIZE;

const GAME_SCREEN_LEFT = canvas.clientLeft;
const GAME_SCREEN_RIGHT = canvas.clientLeft + GAME_SCREEN_WIDTH;
const GAME_SCREEN_TOP = canvas.clientTop;
const GAME_SCREEN_BOTTOM = canvas.clientTop + GAME_SCREEN_HEIGHT;

const WAIT_NEXTBLOCK_TIME = 500;

if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    canvas.width = GAME_SCREEN_WIDTH;
    canvas.height = GAME_SCREEN_HEIGHT;
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
        this.eraseBeforeBlock();
        if (nx < GAME_SCREEN_LEFT || nx + BIG_BLOCK_SIZE > GAME_SCREEN_RIGHT)
            nx = this.x;
        if (ny + BIG_BLOCK_SIZE > GAME_SCREEN_BOTTOM) {
            ny = this.y;
            setTimeout(drawNewBlock(), WAIT_NEXTBLOCK_TIME);
        }

        // Change colors just before drawing to avoid affecting the previous or next block color.
        ctx.fillStyle = this.type.color;
        for (var i = 0; i < this.type.shape.length; i++) {
            for (var j = 0; j < this.type.shape[i].length; j++) {
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

    this.eraseBeforeBlock = function() {
        for (var i = 0; i < this.type.shape.length; i++) {
            for (var j = 0; j < this.type.shape[i].length; j++) {
                if (this.type.shape[i][j] == 1)
                    ctx.clearRect(
                        this.x + i * SMALL_BLOCK_SIZE,
                        this.y + j * SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE
                    );
            }
        }
    };
}

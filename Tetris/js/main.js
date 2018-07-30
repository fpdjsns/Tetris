var blockType = [
    {
        name: "O",
        color: "skyblue",
        shape: [[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]]
    },
    {
        name: "S",
        color: "gray",
        shape: [
            [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 1], [0, 0, 0, 1], [0, 0, 0, 0]]
        ]
    },
    {
        name: "Z",
        color: "purple",
        shape: [
            [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0]],
            [[0, 0, 0, 1], [0, 0, 1, 1], [0, 0, 1, 0], [0, 0, 0, 0]]
        ]
    },
    {
        name: "I",
        color: "red",
        shape: [
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        ]
    },
    {
        name: "T",
        color: "yellow",
        shape: [
            [[0, 0, 0, 0], [0, 1, 1, 1], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 1], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]
        ]
    },
    {
        name: "L",
        color: "green",
        shape: [
            [[0, 0, 0, 0], [0, 1, 1, 1], [0, 1, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0]],
            [[0, 0, 0, 1], [0, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]
        ]
    },
    {
        name: "J",
        color: "blue",
        shape: [
            [[0, 0, 0, 0], [0, 1, 1, 1], [0, 0, 0, 1], [0, 0, 0, 0]],
            [[0, 0, 1, 1], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
        ]
    }
];

var nowBlock;
var canvas = document.getElementById("game");
var canvasNextBlock = document.getElementById("nextBlock");
var nextBlockType = Math.floor(Math.random() * blockType.length);

const SMALL_BLOCK_NUM = 4;
const SMALL_BLOCK_SIZE = 20;
const BIG_BLOCK_SIZE = SMALL_BLOCK_SIZE * SMALL_BLOCK_NUM;

const GAME_SCREEN_WIDTH_NUM = 10;
const GAME_SCREEN_HEIGHT_NUM = 20;
const GAME_SCREEN_WIDTH = GAME_SCREEN_WIDTH_NUM * SMALL_BLOCK_SIZE;
const GAME_SCREEN_HEIGHT = GAME_SCREEN_HEIGHT_NUM * SMALL_BLOCK_SIZE;

const GAME_SCREEN_LEFT = canvas.clientLeft;
const GAME_SCREEN_RIGHT = canvas.clientLeft + GAME_SCREEN_WIDTH;
const GAME_SCREEN_TOP = canvas.clientTop;
const GAME_SCREEN_BOTTOM = canvas.clientTop + GAME_SCREEN_HEIGHT;

const WAIT_NEXTBLOCK_TIME = 1000;

const NOW_DELETE = -2;

const BEGIN_X = GAME_SCREEN_LEFT + GAME_SCREEN_WIDTH_NUM / 2 - 4 / 2;
const BEGIN_Y = GAME_SCREEN_TOP;
const SPEED = 1000;

var gameScreenArray = new Array(GAME_SCREEN_HEIGHT_NUM)
    .fill(-1)
    .map(row => new Array(GAME_SCREEN_WIDTH_NUM).fill(-1));

if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    canvas.width = GAME_SCREEN_WIDTH;
    canvas.height = GAME_SCREEN_HEIGHT;

    var ctxNextBlock = canvasNextBlock.getContext("2d");
    canvasNextBlock.width = BIG_BLOCK_SIZE;
    canvasNextBlock.height = BIG_BLOCK_SIZE;
} else {
    console.log("browser not supported canvas");
}

$(window).load(function() {
    console.log("load");
    drawNewBlock();
});

setInterval(function() {
    nowBlock.drawDown(nowBlock.x, nowBlock.y + 1);
}, SPEED);

var drawNewBlock = function() {
    nowBlock = new Block(nextBlockType, BEGIN_X, BEGIN_Y);
    if (nowBlock.isBottom(BEGIN_X, BEGIN_Y)) {
        gameEnd();
    }
    nowBlock.drawDown(BEGIN_X, BEGIN_Y);
    nextBlockType = Math.floor(Math.random() * blockType.length);
    drawNextBlock();
};

var drawNextBlock = function() {
    var nextBlock = blockType[nextBlockType];
    var x = 0;
    var y = 0;
    for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
        for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
            if (nextBlock.shape[0][i][j] == 1) {
                ctxNextBlock.fillStyle = nextBlock.color;
            } else {
                ctxNextBlock.fillStyle = "white";
            }
            ctxNextBlock.fillRect(
                (x + j) * SMALL_BLOCK_SIZE,
                (y + i) * SMALL_BLOCK_SIZE,
                SMALL_BLOCK_SIZE,
                SMALL_BLOCK_SIZE
            );
        }
    }
};

// sy ~ se row에서 지워질 수 있는 행 체크 & 지우기
// TODO test
var checkRowsAndErase = function(sy, ey) {
    var isEraseAnything = false;
    for (var i = sy; i <= ey; i++) {
        if (canEraseRow(i)) {
            eraseRow(i);
            isEraseAnything = true;
        }
    }
    if (isEraseAnything) {
        rearrange();
    }
};

var canEraseRow = function(row) {
    for (var j = 0; j < GAME_SCREEN_WIDTH_NUM; j++) {
        if (gameScreenArray[row][j] == -1) {
            return false;
        }
    }
    return true;
};
var eraseRow = function(row) {
    for (var j = 0; j < GAME_SCREEN_WIDTH_NUM; j++) {
        eraseOneBlock(row, j);
        gameScreenArray[row][j] = NOW_DELETE;
    }
};

var eraseOneBlock = function(x, y) {
    ctx.clearRect(
        y * SMALL_BLOCK_SIZE,
        x * SMALL_BLOCK_SIZE,
        SMALL_BLOCK_SIZE,
        SMALL_BLOCK_SIZE
    );
    gameScreenArray[x][y] = -1;
};

var drawOneBlock = function(x, y, colorType) {
    ctx.fillStyle = blockType[colorType].color;
    ctx.fillRect(
        y * SMALL_BLOCK_SIZE,
        x * SMALL_BLOCK_SIZE,
        SMALL_BLOCK_SIZE,
        SMALL_BLOCK_SIZE
    );
    gameScreenArray[x][y] = colorType;
};

var rearrange = function() {
    for (var j = 0; j < GAME_SCREEN_WIDTH_NUM; j++) {
        // from bottom
        var deleteBlockNum = 0;
        for (var i = GAME_SCREEN_HEIGHT_NUM - 1; i >= 0; i--) {
            if (gameScreenArray[i][j] == -1) continue;
            if (gameScreenArray[i][j] == NOW_DELETE) {
                gameScreenArray[i][j] = -1;
                eraseOneBlock(i, j);
                deleteBlockNum++;
            } else {
                var blockColor = gameScreenArray[i][j];
                eraseOneBlock(i, j);
                drawOneBlock(i + deleteBlockNum, j, blockColor);
            }
        }
    }
};

var gameEnd = function() {
    alert("game over!");
};

$(document).keydown(function(e) {
    if (e.keyCode == 37) {
        //left
        nowBlock.drawLeftOrRight(nowBlock.x - 1, nowBlock.y);
    } else if (e.keyCode == 38) {
        //up
        // nowBlock.drawBlock(nowBlock.x, nowBlock.y-1);
        //rotation
        nowBlock.rotation();
        nowBlock.drawBlock(nowBlock.x, nowBlock.y);
    } else if (e.keyCode == 39) {
        //right
        nowBlock.drawLeftOrRight(nowBlock.x + 1, nowBlock.y);
    } else if (e.keyCode == 40) {
        //down
        nowBlock.drawDown(nowBlock.x, nowBlock.y + 1);
    }
});

function Block(blockTypeIndex, x, y) {
    this.typeIndex = blockTypeIndex;
    this.type = blockType[this.typeIndex];
    this.shapeIndex = 0;
    this.shape = this.type.shape[this.shapeIndex];
    this.x = x;
    this.y = y;

    this.drawLeftOrRight = function(nx, ny) {
        if (this.isDuplicatedBlockOrOutOfGameScreen(nx, ny)) {
            console.log("duplicated!");
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
        }
    };

    this.drawDown = function(nx, ny) {
        if (this.isBottom(nx, ny)) {
            console.log("bottom!");
            // console.log(this.x + "," + this.y);
            for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
                for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                    if (this.shape[j][i] == 1) {
                        gameScreenArray[this.y + j][
                            this.x + i
                        ] = this.typeIndex;
                    }
                }
            }

            //한 줄 지울 수 있는지 체크
            checkRowsAndErase(
                this.y,
                Math.min(
                    GAME_SCREEN_HEIGHT_NUM - 1,
                    this.y + SMALL_BLOCK_NUM - 1
                )
            );
            setTimeout(drawNewBlock(), WAIT_NEXTBLOCK_TIME);
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
        }
    };

    this.eraseBeforeBlock = function() {
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                if (this.shape[i][j] == 1) {
                    ctx.clearRect(
                        (this.x + j) * SMALL_BLOCK_SIZE,
                        (this.y + i) * SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE
                    );
                }
            }
        }
    };

    this.drawBlock = function(x, y) {
        // Change colors just before drawing to avoid affecting the previous or next block color.
        ctx.fillStyle = this.type.color;
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                if (this.shape[i][j] == 1) {
                    ctx.fillRect(
                        (x + j) * SMALL_BLOCK_SIZE,
                        (y + i) * SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE,
                        SMALL_BLOCK_SIZE
                    );
                }
            }
        }

        // console.log(this.x + "," + this.y + " : " + x + "," + y);
        this.x = x;
        this.y = y;
    };

    this.isDuplicatedBlockOrOutOfGameScreen = function(x, y) {
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                var nx = x + i;
                var ny = y + j;
                if (this.shape[j][i] == 0) continue;
                if (nx < 0 || GAME_SCREEN_WIDTH_NUM <= nx) return true;
                if (gameScreenArray[ny][nx] != -1) return true;
            }
        }
        return false;
    };

    this.isBottom = function(x, y) {
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                var nx = x + i;
                var ny = y + j;
                if (this.shape[j][i] == 0) continue;

                if (GAME_SCREEN_HEIGHT_NUM <= ny) return true;
                if (gameScreenArray[ny][nx] != -1) return true;
            }
        }
        return false;
    };

    this.rotation = function() {
        this.eraseBeforeBlock();
        this.shapeIndex = (this.shapeIndex + 1) % this.type.shape.length;
        this.shape = this.type.shape[this.shapeIndex];
        this.drawBlock(this.x, this.y);
    };
}

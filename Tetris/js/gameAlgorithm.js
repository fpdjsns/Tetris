var nowBlock;
var nextBlockType = Math.floor(Math.random() * blockType.length);
var gameScreenArray = new Array(GAME_SCREEN_HEIGHT_NUM)
    .fill(-1)
    .map(row => new Array(GAME_SCREEN_WIDTH_NUM).fill(-1));

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
                (x + j) * SMALL_BLOCK_SIZE + BLOCK_GAP,
                (y + i) * SMALL_BLOCK_SIZE + BLOCK_GAP,
                SMALL_BLOCK_SIZE - BLOCK_GAP,
                SMALL_BLOCK_SIZE - BLOCK_GAP
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
        x * SMALL_BLOCK_SIZE,
        y * SMALL_BLOCK_SIZE,
        SMALL_BLOCK_SIZE,
        SMALL_BLOCK_SIZE
    );
};

var drawOneBlockWithColor = function(x, y, colorName) {
    ctx.fillStyle = colorName;
    ctx.fillRect(
        x * SMALL_BLOCK_SIZE + BLOCK_GAP,
        y * SMALL_BLOCK_SIZE + BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP
    );
}

var drawOneBlock = function(x, y, colorType) {
    drawOneBlockWithColor(x, y, blockType[colorType].color);
};

var rearrange = function() {
    for (var j = 0; j < GAME_SCREEN_WIDTH_NUM; j++) {
        // from bottom
        var deleteBlockNum = 0;
        for (var i = GAME_SCREEN_HEIGHT_NUM - 1; i >= 0; i--) {
            if (gameScreenArray[i][j] == -1) continue;
            if (gameScreenArray[i][j] == NOW_DELETE) {
                gameScreenArray[i][j] = -1;
                eraseOneBlock(j, i);
                deleteBlockNum++;
            } else {
                var blockColor = gameScreenArray[i][j];
                eraseOneBlock(j, i);
                gameScreenArray[i][j] = -1;
                drawOneBlock(j, i + deleteBlockNum, blockColor);
                gameScreenArray[i + deleteBlockNum][j] = blockColor;
            }
        }
    }
};

var drawBelow = function(block) {
    console.log("below");
    var x = block.x;
    var y = block.y;
    block.eraseBeforeBlock();
    while (!block.isBottom(x, y + 1)) {
        y = y + 1;
    }

    block.drawBlock(x, y);
    setBlockInGameScreen(block);
    checkRowsAndErase(
        y,
        Math.min(GAME_SCREEN_HEIGHT_NUM - 1, y + SMALL_BLOCK_NUM - 1)
    );
    drawNewBlock();
};

var setBlockInGameScreen = function(block) {
    for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
        for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
            if (block.shape[j][i] == 1) {
                gameScreenArray[block.y + j][block.x + i] = block.typeIndex;
            }
        }
    }
};

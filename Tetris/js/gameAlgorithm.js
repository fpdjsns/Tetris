var nowBlock;
var nextBlockTypes = new NextBlock(NEXT_BLOCK_SIZE);
var keepBlockType;
var gameScreenArray = new Array(GAME_SCREEN_HEIGHT_NUM)
    .fill(-1)
    .map(row => new Array(GAME_SCREEN_WIDTH_NUM).fill(-1));


var blockBottomId; // 블럭이 바닥에 닿았는지 
var blockBottomTempId; // 블럭이 바닥에 닿았을 때 이동, 회전을 하기 위한 다음 interval

var gameStart = function() {
    drawNewBlock();
    drawWhiteLineOnBackground();
    timer.startGame();
}


var gameEnd = function() {
    alert("game over!");
};


// blockType 있는 경우 블럭 생성 x. blockType을 제일 위부터 떨어뜨리기만 한다.
// blockType 없는 경우 새로운 블럭 생성
var drawNewBlock = function(blockType) {
    if(blockType == undefined){
        nowBlock = new Block(nextBlockTypes.pop(), BEGIN_X, BEGIN_Y);
        if (nowBlock.isBottom(BEGIN_X, BEGIN_Y)) {
            timer.stopGame();
            return;
        }
        nowBlock.drawDown(BEGIN_X, BEGIN_Y);
        drawNextBlocks();
    } else {
        nowBlock = drawNewBlock(blockType, BEGIN_X, BEGIN_Y);
        if (nowBlock.isBottom(BEGIN_X, BEGIN_Y)) {
            timer.stopGame();
            return;
        }
        nowBlock.drawDown(BEGIN_X, BEGIN_Y);
    }
};

var timer = new Timer(SPEED, BLOCK_BOTTOM_TIMEOUT, BLOCK_BOTTOM_TEMP_TIMEOUT, SPEED_UP_INTERVAL, SPEED_UNIT_PERCENT,
    function() { nowBlock.drawDown(nowBlock.x, nowBlock.y + 1)}, gameEnd, 
    function() {setBlockInGameScreen(nowBlock); nowBlock.checkRowsAndErase(); drawNewBlock();});

var drawNextBlocks = function() {
    var nextBlocks = nextBlockTypes.toArray();
    var x = 0;
    var y = 0;
    for (var k = 0; k < NEXT_BLOCK_SIZE; k++) {
        var nextBlock = blockType[nextBlocks[k]];
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                if (nextBlock.shape[0][i][j] == 1) {
                    ctxNextBlock.fillStyle = nextBlock.color;
                } else {
                    ctxNextBlock.fillStyle = "white";
                }
                ctxNextBlock.fillRect(
                    j * SMALL_BLOCK_SIZE + x + BLOCK_GAP,
                    i * SMALL_BLOCK_SIZE + y + BLOCK_GAP,
                    SMALL_BLOCK_SIZE - BLOCK_GAP,
                    SMALL_BLOCK_SIZE - BLOCK_GAP
                );
            }
        }
        y += BIG_BLOCK_SIZE;
    }
};

var drawKeepBlock = function() {
    var keepBlock = keepBlockType;
    if(!keepBlock) return;

    var x = 0;
    var y = 0;
    for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
        for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
            if (keepBlock.shape[0][i][j] == 1) {
                ctxKeepBlock.fillStyle = keepBlock.color;
            } else {
                ctxKeepBlock.fillStyle = "white";
            }
            ctxKeepBlock.fillRect(
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
        x * SMALL_BLOCK_SIZE + BLOCK_GAP,
        (y - HIDE_SCREEN_HEIGHT_NUM) * SMALL_BLOCK_SIZE + BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP
    );
};

var drawOneBlockWithColor = function(x, y, colorName) {
    ctx.fillStyle = colorName;
    ctx.fillRect(
        x * SMALL_BLOCK_SIZE + BLOCK_GAP,
        (y - HIDE_SCREEN_HEIGHT_NUM) * SMALL_BLOCK_SIZE + BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP
    );
}

var drawWhiteLineOnBackground = function() {
    ctx.fillStyle = LINE_COLOR;
    for (var i = 0; i <= GAME_SCREEN_WIDTH_NUM; i++) {
        ctx.fillRect(
            i * SMALL_BLOCK_SIZE,
            0,
            BLOCK_GAP,
            GAME_SCREEN_HEIGHT
        );
    }
    for (var i = 0; i <= GAME_SCREEN_HEIGHT_NUM; i++) {
        ctx.fillRect(
            0,
            i * SMALL_BLOCK_SIZE,
            GAME_SCREEN_WIDTH,
            BLOCK_GAP
        );
    }
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

    timer.stopBottom();
    timer.stopBottomTemp();
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

const keepOrLoadBlock = function() {
    // 이미 불러온 블럭인 경우. 다시 저장이 불가능하다.
    if(nowBlock.isLoaded) return false;

    nowBlock.eraseBeforeBlock();
    const willKeepType = nowBlock.type; // 저장될 블럭 타입

    // 불러올 블럭 타입이 있는 경우
    if(keepBlockType) {
        nowBlock = new Block(getBlockTypeIndex(keepBlockType), BEGIN_X, BEGIN_Y);
        nowBlock.isLoaded = true;
    }
    else { // 불러올 블럭 타입이 없는 경우
        drawNewBlock(); // 새로운 블럭 생성
    }

    // 현재 블럭 타입 저장
    keepBlockType = willKeepType;
    drawKeepBlock();
    
    return true;
}
var nowBlock;
var nextBlockTypes = new NextBlock(NEXT_BLOCK_SIZE);
var keepBlockType;
var gameScreenArray = new Array(GAME_SCREEN_HEIGHT_NUM)
    .fill(-1)
    .map(row => new Array(GAME_SCREEN_WIDTH_NUM).fill(-1));
var timer = new Timer(SPEED, BLOCK_BOTTOM_TIMEOUT, BLOCK_BOTTOM_TEMP_TIMEOUT, SPEED_UP_INTERVAL, SPEED_UNIT_PERCENT,
    function () {
        nowBlock.drawDown()
    }, gameEnd,
    function () {
        moveBottomAndSetting()
    });

function gameStart() {
    drawNewBlock();
    drawWhiteLineOnBackground();
    timer.startGame();
}

function gameEnd() {
    alert("game over!");
};

// nextBlockTypes으로 Block 생성 후 nowBlock 갱신
function drawNewBlock() {
    nowBlock = new Block(nextBlockTypes.pop(), BEGIN_X, BEGIN_Y);
    nowBlock.drawDown(BEGIN_X, BEGIN_Y);
    drawNextBlocks();
    if (nowBlock.isBottom(BEGIN_X, BEGIN_Y)) {
        timer.stopGame();
        return;
    }
};


function drawNextBlocks() {
    var nextBlocks = nextBlockTypes.toArray();
    var x = SMALL_BLOCK_SIZE + 2 * CANVAS_BORDER_LINE_WIDTH;
    var y = SMALL_BLOCK_SIZE + 2 * CANVAS_BORDER_LINE_WIDTH;

    ctxNextBlock.clearRect(CANVAS_BORDER_LINE_WIDTH, CANVAS_BORDER_LINE_WIDTH,
        canvasNextBlock.width - 2 * CANVAS_BORDER_LINE_WIDTH,
        canvasNextBlock.height - 2 * CANVAS_BORDER_LINE_WIDTH);
    for (var k = 0; k < NEXT_BLOCK_SIZE; k++) {
        var nextBlock = blockType[nextBlocks[k]];
        ctxNextBlock.fillStyle = nextBlock.color;
        for (var i = 0; i < nextBlock.shape.length; i++) {
            for (var j = 0; j < nextBlock.shape.length; j++) {
                if (nextBlock.shape[i][j] == 0) {
                    continue;
                }
                ctxNextBlock.fillRect(
                    x + j * SMALL_BLOCK_SIZE + BLOCK_GAP,
                    y + i * SMALL_BLOCK_SIZE + BLOCK_GAP,
                    SMALL_BLOCK_SIZE - BLOCK_GAP,
                    SMALL_BLOCK_SIZE - BLOCK_GAP
                );
            }
        }
        y += BIG_BLOCK_SIZE;
    }
};

function drawKeepBlock() {
    var keepBlock = keepBlockType;
    if (!keepBlock) return;
    var x = SMALL_BLOCK_SIZE;
    var y = SMALL_BLOCK_SIZE;

    ctxKeepBlock.clearRect(CANVAS_BORDER_LINE_WIDTH, CANVAS_BORDER_LINE_WIDTH,
        canvasKeepBlock.width - 2 * CANVAS_BORDER_LINE_WIDTH,
        canvasKeepBlock.height - 2 * CANVAS_BORDER_LINE_WIDTH);
    ctxKeepBlock.fillStyle = keepBlock.color;
    for (var i = 0; i < keepBlock.shape.length; i++) {
        for (var j = 0; j < keepBlock.shape.length; j++) {
            if (keepBlock.shape[i][j] == 0) {
                continue;
            }
            ctxKeepBlock.fillRect(
                x + j * SMALL_BLOCK_SIZE + BLOCK_GAP,
                y + i * SMALL_BLOCK_SIZE + BLOCK_GAP,
                SMALL_BLOCK_SIZE - BLOCK_GAP,
                SMALL_BLOCK_SIZE - BLOCK_GAP
            );
        }
    }
    ctxKeepBlock.fillStyle = "white";
};

// sy ~ se row에서 지워질 수 있는 행 체크 & 지우기
// TODO test
function checkRowsAndErase(sy, ey) {
    let isEraseAnything = false;
    for (let i = sy; i <= ey; i++) {
        if (canEraseRow(i)) {
            eraseRow(i);
            isEraseAnything = true;
        }
    }
    if (isEraseAnything) {
        rearrange();
    }
};

function canEraseRow(row) {
    for (let j = 0; j < GAME_SCREEN_WIDTH_NUM; j++) {
        if (gameScreenArray[row][j] == -1) {
            return false;
        }
    }
    return true;
};

function eraseRow(row) {
    for (let j = 0; j < GAME_SCREEN_WIDTH_NUM; j++) {
        eraseOneBlock(row, j);
        gameScreenArray[row][j] = NOW_DELETE;
    }
};

function eraseOneBlock(x, y) {
    ctx.clearRect(
        x * SMALL_BLOCK_SIZE + BLOCK_GAP,
        (y - HIDE_SCREEN_HEIGHT_NUM) * SMALL_BLOCK_SIZE + BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP
    );
};

function drawOneBlockWithColor(x, y, colorName) {
    ctx.fillStyle = colorName;
    ctx.fillRect(
        x * SMALL_BLOCK_SIZE + BLOCK_GAP,
        (y - HIDE_SCREEN_HEIGHT_NUM) * SMALL_BLOCK_SIZE + BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP,
        SMALL_BLOCK_SIZE - BLOCK_GAP
    );
}

function drawWhiteLineOnBackground() {
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

function drawOneBlock(x, y, colorType) {
    drawOneBlockWithColor(x, y, blockType[colorType].color);
};

function rearrange() {
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

function moveBottomAndSetting(block = nowBlock) {
    console.log("below");
    block.moveBottom()
    setBlockInGameScreen(block);
    block.checkRowsAndErase();

    timer.stopBottom();
    timer.stopBottomTemp();
    drawNewBlock();
};

function setBlockInGameScreen(block) {
    const length = block.blockNum;
    const typeIndex = block.typeIndex;
    const shape = block.shape
    const position = block.position

    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (shape[j][i] == 1) {
                gameScreenArray[position.y + j][position.x + i] = typeIndex;
            }
        }
    }
};

function keepOrLoadBlock() {
    // 이미 불러온 블럭인 경우. 다시 저장이 불가능하다.
    if (nowBlock.isLoaded) return false;

    nowBlock.eraseBeforeBlock();
    const willKeepType = nowBlock.type; // 저장될 블럭 타입

    // 불러올 블럭 타입이 있는 경우
    if (keepBlockType) {
        nowBlock = new Block(getBlockTypeIndex(keepBlockType), BEGIN_X, BEGIN_Y);
        nowBlock.isLoaded = true;
    } else { // 불러올 블럭 타입이 없는 경우
        drawNewBlock(); // 새로운 블럭 생성
    }

    // 현재 블럭 타입 저장
    keepBlockType = willKeepType;
    drawKeepBlock();

    return true;
}

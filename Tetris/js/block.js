
function Block(blockTypeIndex, x, y) {
    this.typeIndex = blockTypeIndex;
    this.type = blockType[this.typeIndex];
    this.shapeIndex = 0;
    this.shape = this.type.shape[this.shapeIndex];
    this.x = x;
    this.y = y;

    this.drawLeftOrRight = function(nx, ny) {
        if (
            this.isDuplicatedBlockOrOutOfGameScreen(nx, ny) != NONE_DUPLICATED
        ) {
            console.log("duplicated!");
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
        }
    };

    this.drawDown = function(nx, ny) {
        if (this.isBottom(nx, ny)) {
            setBlockInGameScreen(this);

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
                    eraseOneBlock(this.x + j, this.y + i);
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
                    drawOneBlock(x + j, y + i, this.typeIndex);
                }
            }
        }

        this.x = x;
        this.y = y;
    };

    this.isDuplicatedBlockOrOutOfGameScreen = function(x, y) {
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                var nx = x + i;
                var ny = y + j;
                if (this.shape[j][i] == 0) continue;

                // out of game screen
                if (nx < 0) {
                    return LEFT_DUPLICATED;
                }
                if (GAME_SCREEN_WIDTH_NUM < nx) {
                    return RIGHT_DUPLICATED;
                }
                // duplicated another block
                if (gameScreenArray[ny][nx] != -1) {
                    return EITHER_DUPLICATED;
                }
            }
        }
        return NONE_DUPLICATED;
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
        var checkDuplicated = this.isDuplicatedBlockOrOutOfGameScreen(
            this.x,
            this.y
        );
        if (checkDuplicated != NONE_DUPLICATED) {
            var moveIndex = 0;
            if (
                checkDuplicated == LEFT_DUPLICATED ||
                checkDuplicated == EITHER_DUPLICATED
            ) {
                for (var i = 1; i < SMALL_BLOCK_NUM; i++) {
                    if (
                        this.isDuplicatedBlockOrOutOfGameScreen(
                            this.x + i,
                            this.y
                        ) == NONE_DUPLICATED
                    ) {
                        moveIndex = i;
                        break;
                    }
                }
            }
            if (
                checkDuplicated == RIGHT_DUPLICATED ||
                checkDuplicated == EITHER_DUPLICATED
            ) {
                for (var i = 1; i < SMALL_BLOCK_NUM; i++) {
                    if (
                        this.isDuplicatedBlockOrOutOfGameScreen(
                            this.x - i,
                            this.y
                        ) == NONE_DUPLICATED
                    ) {
                        moveIndex = -i;
                        break;
                    }
                }
            }

            // 움직여도 안되는 경우
            if (moveIndex == 0) {
                this.shapeIndex =
                    (this.shapeIndex + this.type.shape.length - 1) %
                    this.type.shape.length;
                this.shape = this.type.shape[this.shapeIndex];
            } else {
                this.x += moveIndex;
            }
        }
        this.drawBlock(this.x, this.y);
    };
}

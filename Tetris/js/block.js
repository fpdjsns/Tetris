
function Block(blockTypeIndex, x, y) {
    this.typeIndex = blockTypeIndex;
    this.type = blockType[this.typeIndex];
    this.shape = [...this.type.shape];
    this.x = x;
    this.y = y;
    this.isLoaded = false;

    this.drawPreview = function(nx, ny) {
        for (var k = 0; ; k++) {
            if(this.isBottom(nx, ny + k + 1)) {
                this.justDrawBlock(nx, ny + k, 'gray');
                return;
            }
        }
    }

    this.erasePreview = function(x, y) {
        for (var k = 0; ; k++) {
            if(this.isBottom(x, y + k + 1)) {
                this.eraseBlock(x, y + k);
                return;
            }
        }
    }

    this.drawLeftOrRight = function(nx, ny) {
        var isDuplicated = this.isDuplicatedBlockOrOutOfGameScreen(nx, ny);
        if (isDuplicated != NONE_DUPLICATED) {
            console.log("duplicated!");
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
        }
        timer.refreshBottomTemp();
    };

    this.checkRowsAndErase = function() {
        checkRowsAndErase(
            this.y,
            Math.min(
                GAME_SCREEN_HEIGHT_NUM - 1,
                this.y + SMALL_BLOCK_NUM - 1
            )
        );
    }

    this.drawDown = function(nx, ny) {
        if (this.isBottom(nx, ny)) {
            timer.startBottom();
            timer.startBottomTemp();
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
            timer.stopBottom();
            timer.stopBottomTemp();
        }
    };

    this.eraseBeforeBlock = function() {
        this.erasePreview(this.x, this.y);
        this.eraseBlock(this.x, this.y);
    };

    this.eraseBlock = function(x, y) {        
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                if (this.shape[i][j] == 1) {
                    eraseOneBlock(x + j, y + i);
                }
            }
        }
    }

    this.justDrawBlock = function(x, y, colorName) {
        for (var i = 0; i < SMALL_BLOCK_NUM; i++) {
            for (var j = 0; j < SMALL_BLOCK_NUM; j++) {
                if (this.shape[i][j] == 1) {
                    if(colorName == undefined){
                        drawOneBlock(x + j, y + i, this.typeIndex);
                    } else {
                        drawOneBlockWithColor(x + j, y + i, colorName);
                    }
                }
            }
        }
    }

    this.drawBlock = function(x, y) {
        
        // this.erasePreview(this.x, this.y);
        this.drawPreview(x, y);

        // Change colors just before drawing to avoid affecting the previous or next block color.
        this.justDrawBlock(x, y);

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
                if (gameScreenArray[ny] != undefined && gameScreenArray[ny][nx] != -1) {
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
        var length = this.shape.length
        var nextShape =  [[],[],[],[]];
        
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                var nx = length - 1 - j;
                var ny = i;
                var old = this.shape[i][j];
                nextShape[nx][ny] = old;
            }
        }

        var checkDuplicated = this.isDuplicatedBlockOrOutOfGameScreen(
            this.x,
            this.y
        );

        var rotatable = true;
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

            if (moveIndex == 0) { // x축을 움직여도 안되는경우 회전하지 않음
                rotatable = false;
            } else { // x축을 움직인다.
                this.x += moveIndex;
            }
        }

        if(rotatable) {
            this.shape = nextShape.slice();
        }
        this.drawBlock(this.x, this.y);
    };
}

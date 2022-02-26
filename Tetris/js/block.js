class Block {

    constructor(blockTypeIndex, x, y) {
        this.typeIndex = blockTypeIndex;
        this.type = blockType[this.typeIndex];
        this.shape = [...this.type.shape];
        this.blockNum = this.shape.length
        this.x = x;
        this.y = y;
        this.isLoaded = false;
    }

    drawPreview() {
        for (let k = 0; ; k++) {
            if (this.isBottom(this.x, this.y + k + 1)) {
                this.justDrawBlock(this.x, this.y + k, 'gray');
                return;
            }
        }
    }

    erasePreview() {
        for (let k = 0; ; k++) {
            if (this.isBottom(this.x, this.y + k + 1)) {
                this.eraseBlock(this.x, this.y + k);
                return;
            }
        }
    }

    drawLeftOrRight(nx, ny) {
        const isDuplicated = this.isDuplicatedBlockOrOutOfGameScreen(nx, ny);
        if (isDuplicated != NONE_DUPLICATED) {
            console.log("duplicated!");
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
        }
        timer.refreshBottomTemp();
    }

    checkRowsAndErase() {
        checkRowsAndErase(
            this.y,
            Math.min(
                GAME_SCREEN_HEIGHT_NUM - 1,
                this.y + this.blockNum - 1
            )
        );
    }

    drawDown(nx = this.x, ny = this.y + 1) {
        if (this.isBottom(nx, ny)) {
            timer.startBottom();
            timer.startBottomTemp();
        } else {
            this.eraseBeforeBlock();
            this.drawBlock(nx, ny);
            timer.stopBottom();
            timer.stopBottomTemp();
        }
    }

    eraseBeforeBlock() {
        this.erasePreview();
        this.eraseBlock();
    }

    eraseBlock(x = this.x, y = this.y) {
        for (let i = 0; i < this.blockNum; i++) {
            for (let j = 0; j < this.blockNum; j++) {
                if (this.shape[i][j] == 1) {
                    eraseOneBlock(x + j, y + i);
                }
            }
        }
    }

    justDrawBlock(x = this.x, y = this.y, colorName = undefined) {
        for (let i = 0; i < this.blockNum; i++) {
            for (let j = 0; j < this.blockNum; j++) {
                if (this.shape[i][j] == 1) {
                    if (colorName == undefined) {
                        drawOneBlock(x + j, y + i, this.typeIndex);
                    } else {
                        drawOneBlockWithColor(x + j, y + i, colorName);
                    }
                }
            }
        }
    }

    drawBlock(x, y) {
        this.x = x;
        this.y = y;

        // this.erasePreview(this.x, this.y);
        this.drawPreview();

        // Change colors just before drawing to avoid affecting the previous or next block color.
        this.justDrawBlock();

    }

    isDuplicatedBlockOrOutOfGameScreen(x, y, block) {
        var checkShape = this.shape;
        if (block != undefined) checkShape = block;

        for (var i = 0; i < this.blockNum; i++) {
            for (var j = 0; j < this.blockNum; j++) {
                var nx = x + i;
                var ny = y + j;
                if (checkShape[j][i] == 0) continue;

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
    }

    isBottom(x, y) {
        for (let i = 0; i < this.blockNum; i++) {
            for (let j = 0; j < this.blockNum; j++) {
                const nx = x + i;
                const ny = y + j;
                if (this.shape[j][i] == 0) continue;

                if (GAME_SCREEN_HEIGHT_NUM <= ny) return true;
                if (gameScreenArray[ny][nx] != -1) return true;
            }
        }
        return false;
    }

    rotation() {
        this.eraseBeforeBlock();
        const length = this.shape.length;
        const nextShape = [];
        for (let i = 0; i < length; i++) nextShape[i] = [];

        for (let i = 0; i < length; i++)
            for (let j = 0; j < length; j++)
                nextShape[length - 1 - j][i] = this.shape[i][j];

        var checkDuplicated = this.isDuplicatedBlockOrOutOfGameScreen(
            this.x,
            this.y,
            nextShape
        );

        let rotatable = true;
        if (checkDuplicated != NONE_DUPLICATED) {
            var moveIndex = 0;
            if (
                checkDuplicated == LEFT_DUPLICATED ||
                checkDuplicated == EITHER_DUPLICATED
            ) {
                for (i = 1; i < this.blockNum; i++) {
                    if (
                        this.isDuplicatedBlockOrOutOfGameScreen(
                            this.x + i,
                            this.y,
                            nextShape
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
                for (let i = 1; i < this.blockNum; i++) {
                    if (
                        this.isDuplicatedBlockOrOutOfGameScreen(
                            this.x - i,
                            this.y,
                            nextShape
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

        if (rotatable) {
            this.shape = nextShape.slice();
        }
        this.drawBlock(this.x, this.y);
    }
}

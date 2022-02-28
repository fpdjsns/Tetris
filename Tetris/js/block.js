function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.isEquals = function (x, y) {
    return this.x == x && this.y == y;
}

Point.prototype.isLower = function (x, y) {
    return this.y < y;
};

class Block {

    constructor(blockTypeIndex, x, y) {
        this.typeIndex = blockTypeIndex;
        this.type = blockType[this.typeIndex];
        this.shape = [...this.type.shape];
        this.blockNum = this.shape.length

        this.position = new Point(x, y)
        this.bottomPosition = new Point(x, y)
        this.isLoaded = false;

        this.setPreviewCoordinate()
    }

    // === private ===
    drawPreview() {
        this.justDrawBlock(this.bottomPosition.x, this.bottomPosition.y, 'gray');
    }

    erasePreview() {
        this.eraseBlock(this.bottomPosition.x, this.bottomPosition.y);
    }

    moveLeftOrRight(nx, ny) {
        this.move(nx, ny)
        timer.refreshBottomTemp();
    }

    setPreviewCoordinate() {
        for (let k = 0; ; k++) {
            if (this.isBottom(this.position.x, this.position.y + k + 1)) {
                this.bottomPosition.x = this.position.x
                this.bottomPosition.y = this.position.y + k
                return;
            }
        }
    }

    eraseBlock(x = this.position.x, y = this.position.y) {
        for (let i = 0; i < this.blockNum; i++) {
            for (let j = 0; j < this.blockNum; j++) {
                if (this.shape[i][j] == 1) {
                    eraseOneBlock(x + j, y + i);
                }
            }
        }
    }

    justDrawBlock(x = this.position.x, y = this.position.y, colorName = undefined) {
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

    isDuplicatedBlockOrOutOfGameScreen(x, y, shape = this.shape) {
        let checkShape = shape;

        for (let i = 0; i < this.blockNum; i++) {
            for (let j = 0; j < this.blockNum; j++) {
                const nx = x + i;
                const ny = y + j;

                if (checkShape[j][i] == 0) continue;

                // out of game screen
                if (nx < 0) {
                    return LEFT_DUPLICATED;
                }
                if (GAME_SCREEN_WIDTH_NUM < nx) {
                    return RIGHT_DUPLICATED;
                }
                if (GAME_SCREEN_HEIGHT_NUM <= ny) {
                    return BOTTOM_DUPLICATED;
                }
                // duplicated another block
                if (gameScreenArray[ny] != undefined && gameScreenArray[ny][nx] != -1) {
                    return EITHER_DUPLICATED;
                }
            }
        }
        return NONE_DUPLICATED;
    }

    // 블럭을 nx, ny로 움직일 때 실행
    // 블럭이 성공적으로 (nx, ny)로 움직였는지 boolean 값 반환
    move(nx, ny, shape = this.shape) {
        let moved = false

        // 움직일 수 있는 곳인지 체크 가능하지 않다면
        if (this.isDuplicatedBlockOrOutOfGameScreen(nx, ny) != NONE_DUPLICATED) {
            console.log("duplicated!");
        } else {
            // bottom 좌표 갱신
            this.eraseBeforeBlock();

            // bottom 좌표와 동일한지 체크( = 바닥인지 체크)
            if (this.bottomPosition.isLower(nx, ny)) {
                ny = this.bottomPosition.y
            } else {
                // move
                this.shape = shape;
                moved = true
            }

            this.drawBlock(nx, ny)
        }

        return moved;
    }

    // position의 갱신은 해당 함수에서만 이루어진다.
    drawBlock(x, y) {
        this.position.x = x
        this.position.y = y

        this.setPreviewCoordinate()
        this.drawPreview();
        this.justDrawBlock();
    }

    // public
    moveLeft() {
        this.moveLeftOrRight(this.position.x - 1, this.position.y)
    }

    moveRight() {
        this.moveLeftOrRight(this.position.x + 1, this.position.y)
    }

    checkRowsAndErase() {
        checkRowsAndErase(
            this.position.y,
            Math.min(
                GAME_SCREEN_HEIGHT_NUM - 1,
                this.position.y + this.blockNum - 1
            )
        );
    }

    drawDown(nx = this.position.x, ny = this.position.y + 1) {
        if (!this.move(nx, ny)) {
            timer.startBottom();
            timer.startBottomTemp();
        } else {
            timer.stopBottom();
            timer.stopBottomTemp();
        }
    }

    eraseBeforeBlock() {
        this.erasePreview();
        this.eraseBlock();
    }

    isBottom(x = this.position.x, y = this.position.y) {
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

    // shape 갱신
    rotation() {
        const nextShape = getRotateShape(this.shape);

        const originPosition = this.position
        let nx = this.position.x
        let ny = this.position.y

        let checkDuplicated = this.isDuplicatedBlockOrOutOfGameScreen(nx, ny, nextShape);

        let rotatable = true;

        // 충돌한 곳이 있다면
        if (checkDuplicated != NONE_DUPLICATED) {
            rotatable = false;
            // 왼쪽 면이 중복이거나 다른 블록가 중복이라면
            if (
                checkDuplicated == LEFT_DUPLICATED ||
                checkDuplicated == EITHER_DUPLICATED
            ) {
                for (let i = 1; i < this.blockNum; i++) {
                    if (
                        this.isDuplicatedBlockOrOutOfGameScreen(
                            originPosition.x + i,
                            originPosition.y,
                            nextShape
                        ) == NONE_DUPLICATED
                    ) {
                        rotatable = true;
                        nx = originPosition.x + i;
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
                            originPosition.x - i,
                            originPosition.y,
                            nextShape
                        ) == NONE_DUPLICATED
                    ) {
                        rotatable = true;
                        nx = originPosition.x - i;
                        break;
                    }
                }
            }

            // x축을 움직여도 안되는경우 회전하지 않음
        }

        if (rotatable) {
            this.move(nx, ny, nextShape.slice());
        }
    }

    moveBottom() {
        this.move(this.bottomPosition.x, this.bottomPosition.y)
    }

}

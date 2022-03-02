class Timer {


    // gameFunction, gameoverFunction, whenDropBlockNextFunction은 파라미터가 없는 함수이다.
    // sppeed, bottomTimeInterval, bottomTimeTempInterval은 모두 밀리 세컨드
    constructor(speed, bottomTimeInterval, bottomTimeTempInterval, speedUpInterval, speedUnitPercent,
                gameFunction, gameoverFunction, whenDropBlockNextFunction) {
        this.speed = speed;
        this.bottomTimeInterval = bottomTimeInterval;
        this.bottomTimeTempInterval = bottomTimeTempInterval;
        this.speedUpInterval = speedUpInterval;
        this.speedUnitPercent = speedUnitPercent;

        this.gameFunction = gameFunction; // 특정 시간 이후 실행되는 함수. 블럭이 한 칸 아래로 떨어지는 함수.
        this.gameoverFunction = gameoverFunction; // 게임 종료시 실행되는 함수.
        this.whenDropBlockNextFunction = whenDropBlockNextFunction; // 블럭이 땅에 도달했다고 판단 후 후처리 함수. (ex, 다음 블럭 생성)

        this.time = 0;
        this.timerId = null;
        this.gameTimerId = null;
        this.bottomTime = null;
        this.bottomTempTime = null;
        this.difficultyTimerId = null;
    }

    // ==== difficulty ====
    // ---- 난이도 조절 ----
    setDifficulty() {
        const that = this;
        if (this.difficultyTimerId) {
            clearInterval(this.difficultyTimerId);
        }
        that.difficultyTimerId = setInterval(function () {
            that.speed *= that.speedUnitPercent;
            console.log(that.speed);
            that.refreshGame(that.speed);
        }, that.speedUpInterval);
    }

    // ==== game ====
    startGame() {
        this.setTimer();
        this.refreshGame(this.speed);
        this.setDifficulty();
    }

    refreshGame(speed) {
        const that = this;
        if (this.gameTimerId)
            clearInterval(this.gameTimerId);
        return that.gameTimerId = setInterval(function () {
            if (that.bottomTime != null && that.bottomTempTime != null) {
                if (new Date().valueOf() < Math.min(that.bottomTime, that.bottomTempTime)) {
                    return;
                } else {
                    that.bottomTime = null;
                    that.bottomTempTime = null;
                    that.whenDropBlockNextFunction();
                }
            }
            that.gameFunction();
        }, speed);
    }

    setTimer() {
        const that = this;
        that.time = 0;
        if (that.timerId)
            clearInterval(this.timerId);
        return that.timerId = setInterval(function () {
            that.time++;
            const time = that.time
            const min = parseInt((time / 60) % 60)
            const hour = parseInt(time / (60 * 60))
            const sec = parseInt(time % 60)

            const el = document.getElementsByClassName("time-text")[0];
            const newText = hour + " : " + min + " : " + sec;
            el.innerText = newText;
        }, TIMER_UNIT);
    }

    stopGame() {
        if (!this.gameTimerId) return;
        clearInterval(this.gameTimerId);
        this.gameTimerId = null;
        clearInterval(this.timerId);
        this.timerId = null;
        this.time = 0;
        clearInterval(this.difficultyTimerId);
        this.difficultyTimerId = null;
        this.gameoverFunction();
    }

    // ==== bottom ====
    startBottom() {
        if (this.bottomTime != null) return; // 있는 경우 패스
        const tmp = new Date().valueOf();
        this.bottomTime = tmp + this.bottomTimeInterval;
    }

    stopBottom() {
        this.bottomTime = null;
    }

    // ==== bottomTemp ====
    startBottomTemp() {
        if (this.bottomTempTime != null) return; // 있는 경우 패스
        const tmp = new Date().valueOf();
        this.bottomTempTime = tmp + this.bottomTimeTempInterval;
    }

    refreshBottomTemp() {
        const tmp = new Date().valueOf();
        this.bottomTempTime = tmp + this.bottomTimeTempInterval;
    }

    stopBottomTemp() {
        this.bottomTempTime = null;
    }
}

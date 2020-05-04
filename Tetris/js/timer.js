class Timer {


    // gameFunction, gameoverFunction, whenDropBlockNextFunction은 파라미터가 없는 함수이다.
    // sppeed, bottomTimeInterval, bottomTimeTempInterval은 모두 밀리 세컨드
    constructor(speed, bottomTimeInterval, bottomTimeTempInterval, gameFunction, gameoverFunction, whenDropBlockNextFunction) {
        this.speed = speed;
        this.bottomTimeInterval = bottomTimeInterval;
        this.bottomTimeTempInterval = bottomTimeTempInterval;

        this.gameFunction = gameFunction; // 특정 시간 이후 실행되는 함수. 블럭이 한 칸 아래로 떨어지는 함수.
        this.gameoverFunction = gameoverFunction; // 게임 종료시 실행되는 함수.
        this.whenDropBlockNextFunction = whenDropBlockNextFunction; // 블럭이 땅에 도달했다고 판단 후 후처리 함수. (ex, 다음 블럭 생성)

        this.gameTimerId = null;
        this.bottomTime = null;
        this.bottomTempTime = null;
    }

    // ==== game ====
    startGame() {
        var that = this;
        return that.gameTimerId = setInterval(function() {
            if(that.bottomTime != null && that.bottomTempTime != null){
                if(new Date().valueOf() < Math.min(that.bottomTime, that.bottomTempTime)) {
                    return;
                } else {
                    that.bottomTime = null;
                    that.bottomTempTime = null;
                    that.whenDropBlockNextFunction();
                }
            }
            that.gameFunction();
        }, that.speed);
    }

    stopGame() {
        if(!this.gameTimerId) return;
        clearInterval(this.gameTimerId);
        this.gameTimerId = null;
        this.gameoverFunction();
    }

    // ==== bottom ====
    startBottom() {
        if(this.bottomTime != null) return; // 있는 경우 패스
        var tmp = new Date().valueOf();
        this.bottomTime = tmp + this.bottomTimeInterval;
    }

    stopBottom() {
        this.bottomTime = null;
    }

    // ==== bottomTemp ====
    startBottomTemp() {
        if(this.bottomTempTime != null) return; // 있는 경우 패스
        var tmp = new Date().valueOf();
        this.bottomTempTime = tmp + this.bottomTimeTempInterval;
    }

    refreshBottomTemp() {
        var tmp = new Date().valueOf();
        this.bottomTempTime = tmp + this.bottomTimeTempInterval;
    }

    stopBottomTemp() {
        this.bottomTempTime = null;
    }
}
// PC인 경우 상하좌우, 스페이스 keyCode
const PC_BUTTON = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACEBAR: 32,
    CTRL: 17
}

// MOBILE인 경우 상하좌우, 스페이스 keyCode
const MOBILE_BUTTON = {
    LEFT: -1,
    UP: -1,
    RIGHT: -1,
    DOWN: -1,
    SPACEBAR: -1,
    CTRL: -1
}

// mobile인지
const isMobile = (function () {
    var userAgent = navigator.userAgent;

    var isMobile = false;
    if (userAgent.indexOf("iPhone") > 0 || userAgent.indexOf("iPot") > 0 || userAgent.indexOf("iPad") > 0) {
        console.log("iPhone or iPot or iPad");
        isMobile = true;
    } else if (userAgent.indexOf("Android") > 0) {
        console.log("Android");
        isMobile = true;
    } else {
        console.log("PC");
    }

    return isMobile;
})();

// button 정보 세팅
const keyCode = {
    ...(isMobile ? MOBILE_BUTTON : PC_BUTTON)
};

(function () {
    if (isMobile) { // mobile인 경우
        // 300% 확대
        document.body.style.zoom = "300%";
    }
})();


var arrow_up = $(".fa-arrow-up");
var arrow_down = $(".fa-arrow-down");
var arrow_left = $(".fa-arrow-left");
var arrow_right = $(".fa-arrow-right");
var spacebar = $(".fa-arrow-circle-down");

var leftKeyDown = function () {
    //left
    arrow_left.addClass("click");
    nowBlock.moveLeft();
};
var upKeyDown = function () {
    //up
    arrow_up.addClass("click");

    //rotation
    nowBlock.rotation();
};
var rightKeyDown = function () {
    //right
    arrow_right.addClass("click");
    nowBlock.moveRight();
};
var downKeyDown = function () {
    //down
    arrow_down.addClass("click");
    nowBlock.drawDown();
};
var spacebarKeyDown = function () {
    spacebar.addClass("click");
    moveBottomAndSetting();
};

const keepOrLoadBlockKey = function () {
    keepOrLoadBlock();
};

var leftKeyUp = function () {
    arrow_left.removeClass("click");
};
var upKeyUp = function () {
    arrow_up.removeClass("click");
};
var rightKeyUp = function () {
    arrow_right.removeClass("click");
};
var downKeyUp = function () {
    arrow_down.removeClass("click");
};
var spacebarKeyUp = function () {
    spacebar.removeClass("click");
};

// TODO 함수나 변수 배열에 정리하면 switch 안쓰고 더 깔끔하게 할 수 있을 듯.
$(document).keydown(function (e) {
    switch (e.keyCode) {
        case keyCode.LEFT:
            leftKeyDown();
            break;
        case keyCode.UP:
            upKeyDown();
            break;
        case keyCode.RIGHT:
            rightKeyDown();
            break;
        case keyCode.DOWN:
            downKeyDown();
            break;
        case keyCode.SPACEBAR:
            spacebarKeyDown();
            break;
        case keyCode.CTRL:
            keepOrLoadBlockKey();
            break;
        default:
            break;
    }
});

$(document).keyup(function (e) {
    switch (e.keyCode) {
        case keyCode.LEFT:
            leftKeyUp();
            break;
        case keyCode.UP:
            upKeyUp();
            break;
        case keyCode.RIGHT:
            rightKeyUp();
            break;
        case keyCode.DOWN:
            downKeyUp();
            break;
        case keyCode.SPACEBAR:
            spacebarKeyUp();
            break;
        default:
            break;
    }
});

$(arrow_up).mouseup(upKeyUp);
$(arrow_down).mouseup(downKeyUp);
$(arrow_right).mouseup(rightKeyUp);
$(arrow_left).mouseup(leftKeyUp);
$(spacebar).mouseup(spacebarKeyUp);

$(arrow_up).mousedown(upKeyDown);
$(arrow_down).mousedown(downKeyDown);
$(arrow_right).mousedown(rightKeyDown);
$(arrow_left).mousedown(leftKeyDown);
$(spacebar).mousedown(spacebarKeyDown);

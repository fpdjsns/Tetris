const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SPACEBAR = 32;

var arrow_up = $(".fa-arrow-up");
var arrow_down = $(".fa-arrow-down");
var arrow_left = $(".fa-arrow-left");
var arrow_right = $(".fa-arrow-right");
var spacebar = $(".fa-arrow-circle-down");

var leftKeyDown = function() {
    //left
    arrow_left.addClass("click");
    nowBlock.drawLeftOrRight(nowBlock.x - 1, nowBlock.y);
};
var upKeyDown = function() {
    //up
    arrow_up.addClass("click");

    //rotation
    nowBlock.rotation();
    nowBlock.drawBlock(nowBlock.x, nowBlock.y);
};
var rightKeyDown = function() {
    //right
    arrow_right.addClass("click");
    nowBlock.drawLeftOrRight(nowBlock.x + 1, nowBlock.y);
};
var downKeyDown = function() {
    //down
    arrow_down.addClass("click");
    nowBlock.drawDown(nowBlock.x, nowBlock.y + 1);
};
var spacebarKeyDown = function() {
    spacebar.addClass("click");
    drawBelow(nowBlock);
};

var leftKeyUp = function() {
    arrow_left.removeClass("click");
};
var upKeyUp = function() {
    arrow_up.removeClass("click");
};
var rightKeyUp = function() {
    arrow_right.removeClass("click");
};
var downKeyUp = function() {
    arrow_down.removeClass("click");
};
var spacebarKeyUp = function() {
    spacebar.removeClass("click");
};

// TODO 함수나 변수 배열에 정리하면 switch 안쓰고 더 깔끔하게 할 수 있을 듯.
$(document).keydown(function(e) {
    switch (e.keyCode) {
        case LEFT:
            leftKeyDown();
            break;
        case UP:
            upKeyDown();
            break;
        case RIGHT:
            rightKeyDown();
            break;
        case DOWN:
            downKeyDown();
            break;
        case SPACEBAR:
            spacebarKeyDown();
            break;
        default:
            break;
    }
});

$(document).keyup(function(e) {
    switch (e.keyCode) {
        case LEFT:
            leftKeyUp();
            break;
        case UP:
            upKeyUp();
            break;
        case RIGHT:
            rightKeyUp();
            break;
        case DOWN:
            downKeyUp();
            break;
        case SPACEBAR:
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

$(window).load(function() {
    console.log("load");
    gameStart();
});

var gameStart = function(){
    //alert("game start!");
    drawNewBlock();
    drawWhiteLineOnBackground();
}

var gameEnd = function() {
    clearInterval(gameId);
    alert("game over!");
};

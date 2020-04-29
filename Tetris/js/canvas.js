var canvas = document.getElementById("game");
var canvasNextBlock = document.getElementById("nextBlock");

if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    canvas.width = GAME_SCREEN_WIDTH + BLOCK_GAP;
    canvas.height = GAME_SCREEN_HEIGHT + BLOCK_GAP;

    var ctxNextBlock = canvasNextBlock.getContext("2d");
    canvasNextBlock.width = BIG_BLOCK_SIZE;
    canvasNextBlock.height = BIG_BLOCK_SIZE * NEXT_BLOCK_SIZE;
} else {
    console.log("browser not supported canvas");
}
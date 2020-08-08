var canvas = document.getElementById("game");
var canvasNextBlock = document.getElementById("nextBlock");
var canvasKeepBlock = document.getElementById("keepBlock");

if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    canvas.width = GAME_SCREEN_WIDTH + BLOCK_GAP;
    canvas.height = GAME_SCREEN_HEIGHT + BLOCK_GAP;
    ctx.lineWidth = 2;
    ctx.strokeStyle="black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    var ctxNextBlock = canvasNextBlock.getContext("2d");
    canvasNextBlock.width = (BIG_BLOCK_SIZE + 2*SMALL_BLOCK_SIZE);
    canvasNextBlock.height = BIG_BLOCK_SIZE * NEXT_BLOCK_SIZE + 2*SMALL_BLOCK_SIZE;
    ctxNextBlock.lineWidth = 2;
    ctxNextBlock.strokeStyle="black";
    ctxNextBlock.strokeRect(0, 0, canvasNextBlock.width, canvasNextBlock.height);

    var ctxKeepBlock = canvasKeepBlock.getContext("2d");
    canvasKeepBlock.width = (BIG_BLOCK_SIZE + 2*SMALL_BLOCK_SIZE);
    canvasKeepBlock.height = (BIG_BLOCK_SIZE + 2*SMALL_BLOCK_SIZE);
    ctxKeepBlock.lineWidth = 2;
    ctxKeepBlock.strokeStyle="black";
    ctxKeepBlock.strokeRect(0, 0, canvasKeepBlock.width, canvasKeepBlock.height);

} else {
    console.log("browser not supported canvas");
}
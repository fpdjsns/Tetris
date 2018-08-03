var canvas = document.getElementById("game");
var canvasNextBlock = document.getElementById("nextBlock");

const SMALL_BLOCK_NUM = 4;
const SMALL_BLOCK_SIZE = 20;
const BIG_BLOCK_SIZE = SMALL_BLOCK_SIZE * SMALL_BLOCK_NUM;

const GAME_SCREEN_WIDTH_NUM = 10;
const GAME_SCREEN_HEIGHT_NUM = 20;
const GAME_SCREEN_WIDTH = GAME_SCREEN_WIDTH_NUM * SMALL_BLOCK_SIZE;
const GAME_SCREEN_HEIGHT = GAME_SCREEN_HEIGHT_NUM * SMALL_BLOCK_SIZE;

const GAME_SCREEN_LEFT = canvas.clientLeft;
const GAME_SCREEN_RIGHT = canvas.clientLeft + GAME_SCREEN_WIDTH;
const GAME_SCREEN_TOP = canvas.clientTop;
const GAME_SCREEN_BOTTOM = canvas.clientTop + GAME_SCREEN_HEIGHT;

const WAIT_NEXTBLOCK_TIME = 1000;

const NOW_DELETE = -2;

const BEGIN_X = GAME_SCREEN_LEFT + GAME_SCREEN_WIDTH_NUM / 2 - 4 / 2;
const BEGIN_Y = GAME_SCREEN_TOP;
const SPEED = 1000;

const NONE_DUPLICATED = 0;
const LEFT_DUPLICATED = 1;
const RIGHT_DUPLICATED = 2;
const EITHER_DUPLICATED = 3;

const BLOCK_GAP = 1;

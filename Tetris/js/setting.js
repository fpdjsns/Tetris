document.getElementById("key-up").value = keyCode.UP;
document.getElementById("key-left").value = keyCode.LEFT;
document.getElementById("key-right").value = keyCode.RIGHT;
document.getElementById("key-down").value = keyCode.DOWN;
document.getElementById("key-below").value = keyCode.SPACEBAR;
document.getElementById("key-keep").value = keyCode.CTRL;

const settingInput = document.getElementsByClassName('key_input');

function openSetting() {
    $('#setting').show();
}

function applySetting() {
    keyCode.UP = document.getElementById("key-up").value;
    keyCode.LEFT = document.getElementById("key-left").value;
    keyCode.RIGHT = document.getElementById("key-right").value;
    keyCode.DOWN = document.getElementById("key-down").value;
    keyCode.SPACEBAR = document.getElementById("key-below").value;
    keyCode.CTRL = document.getElementById("key-keep").value;
    console.log(keyCode)
    closeSetting();
}

function closeSetting() {
    $('#setting').hide();
};

for (let i = 0; i < settingInput.length; i++) {
    settingInput[i].addEventListener('keydown', e => {
        e.keyCode
        const that = settingInput[i];
        if (that.value == e.key) return;
        that.value = e.key
    })
}


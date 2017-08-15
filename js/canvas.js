(function(W, U) {

const dropColor = "rgba(250, 250, 250,";
const speed = 2; // move distance per frame
const delay = 5; // time per frame
const dropNum = 500;

let timer = null;
let currentPoses = [],
    lefts = [],
    endPoses = [],
    opacities = [];

function getOpacity(currentPos, endPos) {
    return (1 - currentPos / endPos);
}

const init = (function() {
    // initialize the canvas with blue sky
    drawBlueSky(0, 0, 800, 600);

    return function() {
        lefts = U.getRandomRange(dropNum, 0, canvas.width);
        endPoses = U.getRandomRange(dropNum, 0, canvas.height);
        opacities = Array.from(Array(dropNum)).fill(1);
        currentPoses = Array.from(Array(dropNum)).fill(0);
        drawGreySky(0, 0, 800, 600);
    };
})();

// rain is used in index.js
W.rain = function() {
    init();
    timer = setInterval(drawFrame, delay, dropNum);
}

function drawFrame(dropNum) {
    // draw background
    drawGreySky(0, 0, 800, 600);

    // draw drops
    drawDrops(dropNum);
}

function drawDrops(num) {
    for(var i = 0; i < num; i++) {
        drawNthDrop(i);
    }
}

function drawNthDrop(i) {
    drawArc(lefts[i], currentPoses[i], 2, 0, 2 * Math.PI, true, `${dropColor} ${opacities[i]})`);

    currentPoses[i] += speed;
    opacities[i] = getOpacity(currentPoses[i], endPoses[i]);

    // 当该雨点消失的时候，重新生成一个雨点开始降落。
    // 消失一个雨点就立即生成一个新的雨点，只不过新雨点的 left 和 endPos 和旧雨点的都不相同
    if(Math.floor(opacities[i]*10) == 0) {
        lefts[i]        = U.getRandomInt(0, canvas.width);
        currentPoses[i] = 0;
        opacities[i]    = 1;
    }
}

// stopRain is used in index.js
W.stopRain = function() {
    clearInterval(timer);
    drawGreySky(0, 0, 800, 600);
}

})(this, util);
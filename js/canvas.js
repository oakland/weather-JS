(function(W, U) {

// ---- rain start ----
const rainDropColor = "rgba(250, 250, 250,";
const rainSpeed = 2; // move distance per frame
const rainDelay = 5; // time per frame
const rainDropNum = 500;

let rainTimer = null;
let currentRainPoses = [],
    rainLefts = [],
    rainEndPoses = [],
    rainOpacities = [];

function getOpacity(currentPos, endPos) {
    return (1 - currentPos / endPos);
}

const initRain = (function() {
    // initialize the canvas with blue sky
    drawBlueSky(0, 0, canvasW, canvasH);

    return function() {
        rainLefts = U.getRandomRange(rainDropNum, 0, canvasW);
        rainEndPoses = U.getRandomRange(rainDropNum, 0, canvasH);
        rainOpacities = Array.from(Array(rainDropNum)).fill(1);
        currentRainPoses = Array.from(Array(rainDropNum)).fill(0);
        drawBlackSky(0, 0, canvasW, canvasH);
    };
})();

// rain is used in index.js
W.rain = function() {
    initRain();
    rainTimer = setInterval(drawRainFrame, rainDelay, rainDropNum);
}

function drawRainFrame(rainDropNum) {
    // draw background
    drawBlackSky(0, 0, canvasW, canvasH);

    // draw drops
    drawRainDrops(rainDropNum);
}

function drawRainDrops(num) {
    for(let i = 0; i < num; i++) {
        drawNthRainDrop(i);
    }
}

function drawNthRainDrop(i) {
    drawArc(rainLefts[i], currentRainPoses[i], 1, 0, 2 * Math.PI, true, `${rainDropColor} ${rainOpacities[i]})`);

    currentRainPoses[i] += rainSpeed;
    rainOpacities[i] = getOpacity(currentRainPoses[i], rainEndPoses[i]);

    // 当该雨点消失的时候，重新生成一个雨点开始降落。
    // 消失一个雨点就立即生成一个新的雨点，只不过新雨点的 left 和 endPos 和旧雨点的都不相同
    if(Math.floor(rainOpacities[i]*10) == 0) {
        rainLefts[i]        = U.getRandomInt(0, canvasW);
        currentRainPoses[i] = 0;
        rainOpacities[i]    = 1;
    }
}

// stopRain is used in index.js
W.stopRain = function() {
    clearInterval(rainTimer);
    drawBlackSky(0, 0, canvasW, canvasH);
}
// ---- rain end ----

// ---- flash start ----
let flashTimer = null;
let isFlash = false;
let flashStart = {
    x: U.getRandomInt(0, canvasW),
    y: U.getRandomInt(0, canvasH)
};

const flashDelay = 300;

function drawFlash() {
    drawRect(U.getRandomInt(0, canvasW), U.getRandomInt(0, canvasH), 20, 20, "white");
}

function drawFlashFrame() {
    // if (isFlash) {
    //     drawBlackSky(0, 0, canvasW, canvasH);
    //     drawFlash(); // update flash state each time
    // } else {
    //     drawWhiteSky(0, 0, canvasW, canvasH);
    // }
    // isFlash = !isFlash;
    drawRect(flashStart.x, flashStart.y, 2, 2, 'white');

    flashStart.x += xCoor[U.getRandomInt(0, xCoor.length)];
    flashStart.y += yCoor[U.getRandomInt(0, yCoor.length)];
    if(flashStart.x > canvasW || flashStart.y > canvasH) {
        clearInterval(flashTimer);
        flashStart = {
            x: U.getRandomInt(0, canvasW),
            y: U.getRandomInt(0, canvasH)
        };
    };
}

// W.flash = function() {
//     drawBlackSky(0, 0, canvasW, canvasH);
//     flashTimer = setInterval(drawFlashFrame, flashDelay);
// };

// W.stopFlash = function() {
//     clearInterval(flashTimer);
// };

// --new flash start--
function drawFlashFrame() {
    isFlash ? drawBlackSky(0, 0, canvasW, canvasH) : drawFlashNew()
    isFlash = !isFlash;
}

function drawFlashNew() {
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.moveTo(100, 50);
    ctx.lineTo(50, 100);
    ctx.lineTo(100, 100);
    ctx.lineTo(50, 150);
    ctx.lineTo(120, 80);
    ctx.lineTo(70, 80);
    ctx.lineTo(100, 50);
    ctx.stroke();
    ctx.fill();
}

W.flash = function() {
    flashTimer = setInterval(drawFlashFrame, flashDelay);
};
W.stopFlash = function() {
    clearInterval(flashTimer);
};
// --new flash end--
// ---- flash end ----

// ---- snow start ----

// 当一片雪花的 currentPos 不断变化，最终等于 canvasH，也就是 endPos 的时候，就重新生成一片雪花开始降落。
// 其实判断雪花掉落在地面的方式并不是 currentPos == canvasH。因为当地上降落一层雪花的时候，再掉落的雪花
// 是盖在地上的雪花之上的。
const snowDropColor = "rgb(250, 250, 250)";
const snowSpeed = 1; // move distance per frame
const snowDelay = 30; // time per frame
const snowDropNum = 5;

let snowTimer = null;

// snow is used in index.js
W.snow = function() {
    snowTimer = setInterval(drawSnowFrame, snowDelay);
}

function drawSnowFrame() {
    drawGreySky(0, 0, canvasW, canvasH);
    drawSnows();
    updateSnows();
    addRandomNumberOfSnows();
}

// 新生成一片雪花，返回值是一个 snow = {x, y}。这里的还可以生成彩色的雪花，如果规定颜色的话。
function makeASnow(x, y) {
    return {x, y};
}

// 生成规定数量的雪花片，这个其实是初始化的雪花片数组，雪花片的格式是 {x:random, y:0}，返回一个数组 snows = [{x1, y1}, {x2, y2}, ...]
function initRandomSnows(num) {
    let arr = [];
    for(let i = 0; i < num; i++) {
        const randomSnow = makeASnow(U.getRandomInt(0, canvasW), U.getRandomInt(0, 100));
        arr.push(randomSnow);
    };
    return arr;
}

let randomSnows = initRandomSnows(snowDropNum);
// 所有 currentPos == canvasH 的 snow 都从原来数组中 splice 出来，放入这个数组中。而原数组中则 push 进去一个新的 snow
let snowsOnTheGround = [];

// 每次都更新 randomSnows 的 x, y 属性，其中 x 值其实是不变的，变得只有 y 值。而 snowsOnTheGround 则不进行更新。
function updateSnows() {
    randomSnows.forEach((item, index) => {
        if(isOnTheGround(item) || isOnOtherSnows(item)) {
            snowsOnTheGround.push(item);
            randomSnows.splice(index, 1);
        } else {
            item.y += snowSpeed;
        };
    });
}

function isOnTheGround(snow) {
    return snow.y === canvasH;
}

function isOnOtherSnows(snow) {
    // 返回一个布尔值，判断是否与其他雪片接触
    // 和 snowsOnTheGround 的每个元素 s1 进行判断，当前的 snow.x 是否满足以下两个条件：
    // 1. s1.x - s1.width < snow.x < snow1.x + s1.width
    // 1. snow.y + snow.height === s1.y
    // 用 some 方法应该可以
    return snowsOnTheGround.some(item => {
        return (item.x-1 < snow.x) && (snow.x < snow.x+1) && (snow.y+1 === item.y);
    });
}
// 每次 updateSnows 之后都进行判断，当雪花中有一个降落到地上的时候，就给 snows = [] 这个数组添加一片雪花。先 makeASnow，然后 push 到 snows 中
function addASnow() {
    const newSnow = makeASnow(U.getRandomInt(0, canvasW), 0);
    randomSnows.push(newSnow);
}

function addRandomNumberOfSnows() {
    const num = U.getRandomInt(0, 2);
    for (let i = 0; i < num; i++) {
        addASnow();
    };
}

// 把 randomSnows 和 snowsOnTheGround 这两个数组中的所有 snow 依次遍历画出来
function drawSnows() {
    randomSnows.forEach(item => {
        drawArc(item.x, item.y, 1, 0, 2 * Math.PI, true, snowDropColor);
    });
    snowsOnTheGround.forEach(item => {
        drawArc(item.x, item.y, 1, 0, 2 * Math.PI, true, snowDropColor);
    });
}

// stopSnow is used in index.js
W.stopSnow = function() {
    console.log(snowsOnTheGround, randomSnows);

    clearInterval(snowTimer);
    drawGreySky(0, 0, canvasW, canvasH);
}
// ---- snow end ----

// ---- frost start ----
// 定义一个 frosts = [], 每隔一段时间就往里 push 进去一个 frostPiece，每个 frostPiece 的数据结果如下
// {
//     left: random,
//     top: random,
//     width: frostWidth,
//     height: frostHeight,
//     opacity: num between 0 and 1
// }
// 每隔一段时间每个 frostPiece 的 opacity 就增加一个0.1，最开始 push 进去的时候初始化的 opacity 是 0.1。
// 每隔一段时间 push frostPiece 的时候就验证一下 frosts.length 的大小，小于 max 继续 push，大于则停止
// 每隔一段时间验证下每个 frostPiece 的 opacity，当所有的 opacity 都等于 1 的时候，就 clearInterval。
const frostDelay = 300,
      maxFrostPiece = 20;

let frostTimer = null,
    frosts = [];

W.frost = function() {
    drawGreySky(0, 0, canvasW, canvasH);
    frostTimer = setInterval(drawFrostFrame, frostDelay);
};

function drawFrostFrame() {
    // draw every piece of frost in frosts array
    drawFrosts();

    if(frosts.length < maxFrostPiece) {
        const frost = produceAFrost();
        frosts.push(frost);
    };

    // let opacity of every frost in frost to be more clear, that is update opacity for 0.1
    updateFrosts();

    // check if all opacities in frosts reach to 1, if true clearInterval, else keep interval
    validateOpacities();
}

// 这里还可以优化，用 array forEach 的方法进行绘制
function drawFrosts() {
    frosts.forEach(item => {
        drawAPiceOfFrost(item);
    });
}

function drawAPiceOfFrost(frost) {
    // style
    ctx.strokeStyle = `rgba(255, 255, 255, ${frost.opacity})`;
    ctx.lineWidth = 1;

    // init some basic data
    const left = frost.left,
          top  = frost.top;

    // draw flake, begin path
    ctx.beginPath();

    // 1. draw a horizonal line
    ctx.moveTo(left-5, top);
    ctx.lineTo(left+5, top);
    ctx.stroke();

    // 2. draw a vertical line
    ctx.moveTo(left, top-5);
    ctx.lineTo(left, top+5);
    ctx.stroke();

    // 3. draw a slash line
    ctx.moveTo(left+3.5, top-3.5);
    ctx.lineTo(left-3.5, top+3.5);
    ctx.stroke();

    // 4. draw a back slash line
    ctx.moveTo(left-3.5, top-3.5);
    ctx.lineTo(left+3.5, top+3.5);
    ctx.stroke();
}

// produce a frost object
function produceAFrost() {
    const frost = {};

    frost.left = U.getRandomInt(0, canvasW);
    frost.top = U.getRandomInt(0, canvasH);
    frost.opacity = 0.1;

    return frost;
}

function updateFrosts() {
    frosts.forEach(item => {
        (item.opacity > 0.5) ? (item.opacity = 0.5) : (item.opacity += 0.1)
    });
}

function validateOpacities() {
    const isAllOpacitiesReachMax = frosts.every(item => {
        // sometimes the num gets wired in javascript, such as 0.1 + 0.2 = 0.3000000000004,
        // check if opacity is greater than 0.5 will fix this bug;
        return item.opacity >= 0.5;
    });
    if(isAllOpacitiesReachMax) {
        clearInterval(frostTimer);
    }
}

W.stopFrost = function() {
    clearInterval(frostTimer);
};
// ---- frost end ----
})(this, util);
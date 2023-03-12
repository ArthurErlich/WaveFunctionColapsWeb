"use strict";
var WFC2;
(function (WFC2) {
    const canvasDIM = 600;
    const frameLength = 2;
    //Canvas and Frames setup
    const canvas = document.createElement("div");
    const frameElements = new Array(frameLength * frameLength);
    const frames = new Array(frameLength * frameLength);
    setup();
    draw();
    class Frame {
        constructor() { }
    }
    class Tile {
        constructor() { }
    }
    const tiles = [new Tile()];
    function setup() {
        createCanvas();
        createFrames();
    }
    function draw() {
        createFrameElement();
    }
    function createCanvas() {
        canvas.setAttribute("id", "canvas");
        canvas.style.width = canvasDIM + "px";
        canvas.style.height = canvasDIM + "px";
        canvas.style.backgroundColor = "black";
        canvas.style.display = "flex";
        canvas.style.flexWrap = "wrap";
        (document.body).appendChild(canvas);
    }
    function createFrames() {
        let index = 0;
        for (let x = 0; x < canvasDIM; x++) {
            for (let y = 0; y < canvasDIM; y++) {
                //frames[index] = new Frame();
                index++;
            }
        }
    }
    function createFrameElement() {
        for (let i = 0; i < frames.length; i++) {
            const element = document.createElement("div");
            const frameSize = canvasDIM / frameLength;
            element.setAttribute("id", "frame");
            element.dataset.index = i.toString();
            element.dataset.colapsed = "false";
            element.style.width = frameSize - 2 + "px";
            element.style.height = frameSize - 2 + "px";
            element.style.backgroundSize = "cover";
            element.style.border = "1px solid black";
            element.style.flex;
            element.innerText = i.toString();
            element.style.color = "white";
            frameElements[i] = element;
            canvas.appendChild(element);
        }
    }
})(WFC2 || (WFC2 = {}));

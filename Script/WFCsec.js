"use strict";
var WFC2;
(function (WFC2) {
    class Frame {
        constructor(options) {
            this.options = options;
        }
    }
    class Tile {
        constructor(index, rotation, image, up, right, down, left) {
            this.index = index;
            this.rotation = rotation;
            this.image = image;
            this.up = up;
            this.right = right;
            this.down = down;
            this.left = left;
        }
    }
    const canvasDIM = 600;
    const frameCount = 2;
    //Canvas and Frames setup
    const canvas = document.createElement("div");
    const frameElements = new Array(frameCount * frameCount);
    const frames = new Array(frameCount * frameCount);
    const tiles = [
        //StrightTile
        new Tile(0, 0, "../images/stright.png"),
        new Tile(0, 0, "../images/blank.png"),
    ];
    let waveColapsed = false;
    //setting compatible options for Tiles
    //StrightTile
    tiles[0].up = new Set([tiles[0]]);
    tiles[0].right = new Set([tiles[0], tiles[1]]);
    tiles[0].down = new Set([tiles[0]]);
    tiles[0].left = new Set([tiles[0], tiles[1]]);
    //BlankTile
    tiles[1].up = new Set([tiles[1]]);
    tiles[1].right = new Set([tiles[1]]);
    tiles[1].down = new Set([tiles[1]]);
    tiles[1].left = new Set([tiles[1]]);
    setup();
    //test stuff
    console.log("all Frames:");
    console.log(frames);
    frames[0].options = [tiles[0]];
    //frames[1].options = [tiles[1]];
    //checkFrameSides(0);
    do {
        wafeFunction();
        draw();
    } while (waveColapsed);
    function setup() {
        createCanvas();
        createFrames();
        createFrameElement();
    }
    function draw() {
        //drawFrame(TILE);
        for (let i = 0; i < frames.length; i++) {
            if (isColapse(frames[i])) {
                drawImage(i, frames[i].options[0].image);
            }
        }
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
        for (let x = 0; x < frameCount; x++) {
            for (let y = 0; y < frameCount; y++) {
                frames[index] = new Frame(tiles);
                index++;
            }
        }
    }
    function createFrameElement() {
        for (let i = 0; i < frames.length; i++) {
            const element = document.createElement("div");
            const frameSize = canvasDIM / frameCount;
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
    function wafeFunction() {
        let colapsedFrames = new Set();
        let toColapseFrames = new Set();
        let optionsLengt = 0;
        for (let i = 0; i < frames.length; i++) {
            optionsLengt += frames[i].options.length;
            if (!isColapse(frames[i])) {
                colapsedFrames.add(frames[i]);
            }
        }
        //check if all frames are colapsed
        if (optionsLengt == 0) {
            waveColapsed = true;
        }
        //start to get tile wiht last entorpy / options
        for (let frame of frames) {
            if (!isColapse(frame)) {
                toColapseFrames.add(frame);
            }
        }
        console.log(toColapseFrames);
    }
    function drawImage(index, image) {
        frameElements[index].style.backgroundImage = "url(" + image + ")";
    }
    function isColapse(frame) {
        return (frame.options.length == 1);
    }
    //TODO: check if optoins of Frames is compatible with tiles.
    function checkFrameSides(index) {
        if (index % frameCount !== 0) {
            //left side
            console.log("left side");
            console.log(frames[index - 1].options);
        }
        if (((index + 1) % frameCount) !== 0) {
            //right side
            console.log("right side");
            console.log(frames[index + 1].options);
        }
        if (index >= frameCount) {
            //top side
            console.log("top side");
            console.log(frames[index - frameCount].options);
        }
        if (index < frameCount * (frameCount - 1)) {
            //bottom side
            console.log("bottom side");
            console.log(frames[index + frameCount].options);
        }
    }
    function setOptions(index, options) {
        frames[index].options = options;
    }
    function compareOptions(option1, option2) {
        let result = new Set;
        return result;
    }
})(WFC2 || (WFC2 = {}));

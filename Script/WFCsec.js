"use strict";
var WFC2;
(function (WFC2) {
    const logging = false;
    const loggingExtream = false;
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
        map() {
            return (this.index.toString() + this.rotation + this.image);
        }
    }
    class ColapseFrames {
        constructor(frame, index) {
            this.frame = frame;
            this.index = index;
        }
    }
    const canvasDIM = 800;
    const frameCount = 10;
    ;
    //Canvas and Frames setup
    const canvas = document.createElement("div");
    const frameElements = new Array(frameCount * frameCount);
    const frames = new Array(frameCount * frameCount);
    const tiles = [
        //BlankTile
        new Tile(0, 0, "../images/blank.png"),
        //StrightTile
        new Tile(1, 0, "../images/stright.png"),
        //StrightTile 90°
        new Tile(2, 1, "../images/stright.png"),
    ];
    let waveColapsed = false;
    //setting compatible options for Tiles Searching for better listing!
    //BlankTile
    tiles[0].up = new Set([tiles[0], tiles[2]]);
    tiles[0].right = new Set([tiles[0], tiles[1]]);
    tiles[0].down = new Set([tiles[0], tiles[2]]);
    tiles[0].left = new Set([tiles[0], tiles[1]]);
    //StrightTile
    tiles[1].up = new Set([tiles[1]]);
    tiles[1].right = new Set([tiles[1], tiles[0]]);
    tiles[1].down = new Set([tiles[1]]);
    tiles[1].left = new Set([tiles[1], tiles[0]]);
    //StrightTile 90°
    tiles[2].up = new Set([tiles[2], tiles[0]]);
    tiles[2].right = new Set([tiles[2]]);
    tiles[2].down = new Set([tiles[2]]);
    tiles[2].left = new Set([tiles[2], tiles[0]]);
    let pause = true;
    document.body.addEventListener("click", () => {
        console.log("--WAVE Clicked--");
        // checkFrameSides(1);
        // checkFrameSides(6);
        colapsTiles();
        draw();
        wafeFunction();
        draw();
        console.log("--WAVE END--");
    });
    setup();
    //test stuff
    if (logging) {
        console.log("all Frames:");
        console.log(frames);
        console.log("----");
    }
    function start() {
        do {
            console.log("--WAVE START--");
            //set Frame options on all Frames
            colapsTiles();
            draw();
            wafeFunction();
            draw();
            console.log(frames);
            console.log("--WAVE END--");
        } while (!waveColapsed && !pause); // !waveColapsed
    }
    function setup() {
        createCanvas();
        createFrames();
        createFrameElement();
        frames[Math.floor((frameCount * frameCount) / 2)].options = [tiles[0]];
        //colapsTiles();
        draw();
    }
    function draw() {
        //drawFrame(TILE);
        for (let i = 0; i < frames.length; i++) {
            if (isColapse(frames[i])) {
                drawImage(i, frames[i].options[0].image, frames[i].options[0].rotation);
            }
            drawFrameOptions(i, frames[i].options.length);
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
            //element.innerText = i.toString();
            //element.style.color = "white";
            frameElements[i] = element;
            canvas.appendChild(element);
        }
    }
    function wafeFunction() {
        let colapsedFrames = 0;
        let toColapseFrames = new Set();
        for (let i = 0; i < frames.length; i++) {
            if (isColapse(frames[i])) {
                colapsedFrames++;
            }
        }
        //check if all frames are colapsed
        if (colapsedFrames == frameCount * frameCount) {
            waveColapsed = true;
            console.warn("All Frames are colapsed");
        }
        //start to get tile wiht last entorpy / options
        let minOpt = tiles.length;
        for (let i = 0; i < frames.length; i++) {
            if (!isColapse(frames[i])) {
                if (minOpt > frames[i].options.length) {
                    minOpt = frames[i].options.length;
                }
            }
        }
        for (let i = 0; i < frames.length; i++) {
            if (!isColapse(frames[i]) && frames[i].options.length == minOpt) {
                toColapseFrames.add(i);
            }
        }
        if (logging) {
            console.log(toColapseFrames);
        }
        if (toColapseFrames.size > 1) {
            //randomly select one of the tiles
            const randomFrameID = Array.from(toColapseFrames)[Math.floor(Math.random() * toColapseFrames.size)];
            let selectedFrame = frames[randomFrameID];
            let randomOptionID = Math.floor(Math.random() * selectedFrame.options.length);
            let randomOption = selectedFrame.options[randomOptionID];
            if (logging) {
                console.log("This tile is selected:");
                console.log(selectedFrame);
                console.log(randomFrameID);
                console.log("This tile has this options:");
                console.log(randomOption);
                console.log(randomOptionID);
            }
            //set the frame options to the selected tile
            frames[randomFrameID].options = new Array(randomOption);
        }
        else if (toColapseFrames.size == 1) {
            let frameID = Array.from(toColapseFrames)[0];
            let selectedFrame = frames[frameID];
            let randomOption = selectedFrame.options[Math.floor(Math.random() * selectedFrame.options.length)];
            if (logging) {
                console.log("This tile is selected:");
                console.log(selectedFrame);
                console.log("This tile has this options:");
                console.log(randomOption);
            }
        }
        else if (toColapseFrames.size == 0) {
            console.warn("All possilbe Frames are colapsed");
            waveColapsed = true;
        }
    }
    function drawImage(index, image, rotation) {
        frameElements[index].style.backgroundImage = "url(" + image + ")";
        frameElements[index].style.rotate = rotation * 90 + "deg";
    }
    function drawFrameOptions(index, options) {
        frameElements[index].innerText = options.toString();
        frameElements[index].style.color = "white";
    }
    function isColapse(frame) {
        return (frame.options.length == 1);
    }
    //TODO: check if optoins of Frames is compatible with tiles.
    function checkFrameSides(index) {
        console.log("compare frames around: " + index);
        console.log(frames[index]);
        if (index >= frameCount) {
            //top side
            if (logging) {
                console.log("----");
                console.log("top side");
                console.log(frames[index - frameCount].options);
            }
            (frames[index], frames[index - frameCount], "top");
            compareAndSetOptions(frames[index], frames[index - frameCount], "top");
        }
        if (((index + 1) % frameCount) !== 0) {
            //right side
            if (logging) {
                console.log("----");
                console.log("right side");
                console.log(frames[index + 1].options);
            }
            compareAndSetOptions(frames[index], frames[index + 1], "right");
        }
        if (index < frameCount * (frameCount - 1)) {
            //bottom side
            if (logging) {
                console.log("----");
                console.log("bottom side");
                console.log(frames[index + frameCount].options);
            }
            compareAndSetOptions(frames[index], frames[index + frameCount], "bottom");
        }
        if (index % frameCount !== 0) {
            //left side
            if (logging) {
                console.log("----");
                console.log("left side");
                console.log(frames[index - 1].options);
            }
            compareAndSetOptions(frames[index], frames[index - 1], "left");
        }
    }
    function setOptions(index, options) {
        frames[index].options = options;
    }
    //--------------------compare and set options--------------------------------
    function compareAndSetOptions(a, b, direction) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let aOpt = new Set();
        switch (direction) {
            case "top":
                if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
                    //console.log("bottom side is equal ro top side");
                    return;
                }
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let optA = 0; optA < ((_a = a.options[indexA].up) === null || _a === void 0 ? void 0 : _a.size); optA++) {
                        for (let indexB = 0; indexB < b.options.length; indexB++) {
                            for (let optB = 0; optB < ((_b = b.options[indexB].down) === null || _b === void 0 ? void 0 : _b.size); optB++) {
                                if (JSON.stringify(Array.from(a.options[indexA].up)[optA]) === JSON.stringify(Array.from(b.options[indexB].up)[optB])) {
                                    aOpt.add(a.options[indexA]);
                                }
                            }
                        }
                    }
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            case "right":
                if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
                    // console.log("bottom side is equal ro top side");
                    return;
                }
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let optA = 0; optA < ((_c = a.options[indexA].right) === null || _c === void 0 ? void 0 : _c.size); optA++) {
                        for (let indexB = 0; indexB < b.options.length; indexB++) {
                            for (let optB = 0; optB < ((_d = b.options[indexB].left) === null || _d === void 0 ? void 0 : _d.size); optB++) {
                                if (JSON.stringify(Array.from(a.options[indexA].right)[optA]) === JSON.stringify(Array.from(b.options[indexB].left)[optB])) {
                                    aOpt.add(a.options[indexA]);
                                }
                            }
                        }
                    }
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            case "bottom":
                if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
                    // console.log("bottom side is equal ro top side");
                    return;
                }
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let optA = 0; optA < ((_e = a.options[indexA].down) === null || _e === void 0 ? void 0 : _e.size); optA++) {
                        for (let indexB = 0; indexB < b.options.length; indexB++) {
                            for (let optB = 0; optB < ((_f = b.options[indexB].up) === null || _f === void 0 ? void 0 : _f.size); optB++) {
                                if (JSON.stringify(Array.from(a.options[indexA].down)[optA]) === JSON.stringify(Array.from(b.options[indexB].up)[optB])) {
                                    aOpt.add(a.options[indexA]);
                                }
                            }
                        }
                    }
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            case "left":
                if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
                    // console.log("bottom side is equal ro top side");
                    return;
                }
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let optA = 0; optA < ((_g = a.options[indexA].left) === null || _g === void 0 ? void 0 : _g.size); optA++) {
                        for (let indexB = 0; indexB < b.options.length; indexB++) {
                            for (let optB = 0; optB < ((_h = b.options[indexB].right) === null || _h === void 0 ? void 0 : _h.size); optB++) {
                                if (JSON.stringify(Array.from(a.options[indexA].left)[optA]) === JSON.stringify(Array.from(b.options[indexB].right)[optB])) {
                                    aOpt.add(a.options[indexA]);
                                }
                            }
                        }
                    }
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            default:
                console.warn("no direction to compare found");
                break;
        }
        if (logging) {
            console.log("----");
        }
    }
    function colapsTiles() {
        for (let index = 0; index < frames.length; index++) {
            if (!isColapse(frames[index])) {
                checkFrameSides(index);
            }
        }
        for (let index = frames.length - 1; index > 0; index--) {
            if (!isColapse(frames[index])) {
                checkFrameSides(index);
            }
        }
    }
})(WFC2 || (WFC2 = {}));

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var WFC2;
(function (WFC2) {
    const logging = false;
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
            return this.index.toString() + this.rotation + this.image;
        }
    }
    const canvasDIM = 800;
    const frameCount = 10;
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
        //CronerTile right, down
        new Tile(3, 0, "../images/corner.png"),
    ];
    let waveColapsed = false;
    //setting compatible options for Tiles Searching for better listing!
    //BlankTile
    tiles[0].up = new Set([tiles[0], tiles[2]]);
    tiles[0].right = new Set([tiles[0], tiles[1]]);
    tiles[0].down = new Set([tiles[0], tiles[2]]);
    tiles[0].left = new Set([tiles[0], tiles[1]]);
    //StrightTile |
    tiles[1].up = new Set([tiles[1], tiles[3]]);
    tiles[1].right = new Set([tiles[1], tiles[0]]);
    tiles[1].down = new Set([tiles[1]]);
    tiles[1].left = new Set([tiles[1], tiles[0]]);
    //StrightTile - 90°
    tiles[2].up = new Set([tiles[2], tiles[0]]);
    tiles[2].right = new Set([tiles[2]]);
    tiles[2].down = new Set([tiles[2], tiles[0]]);
    tiles[2].left = new Set([tiles[2], tiles[3]]);
    //CronerTile right, down
    tiles[3].up = new Set([tiles[0], tiles[1]]);
    tiles[3].right = new Set([tiles[2]]);
    tiles[3].down = new Set([tiles[1]]);
    tiles[3].left = new Set([tiles[0], tiles[2]]);
    let pause = true;
    document.body.addEventListener("click", () => {
        console.log("--WAVE Clicked--");
        // checkFrameSides(1);
        // checkFrameSides(6);
        if (waveColapsed) {
            // location.reload();
        }
        else {
            start();
        }
        console.log("--WAVE END--");
    });
    setup();
    draw();
    start();
    draw();
    //test stuff
    if (logging) {
        console.log("all Frames:");
        console.log(frames);
        console.log("----");
    }
    function start() {
        return __awaiter(this, void 0, void 0, function* () {
            do {
                console.log("--WAVE START--");
                draw();
                wafeFunction();
                //console.log(frames);
                console.log("--WAVE END--");
                yield Sleep(3000);
            } while (!waveColapsed); // !waveColapsed
        });
    }
    function setup() {
        createCanvas();
        createFrames();
        createFrameElement();
        let randomTileID = Math.floor(Math.random() * tiles.length);
        let randomOptionID = Math.floor(Math.random() * frames[randomTileID].options.length);
        frames[randomTileID].options = [frames[randomTileID].options[randomOptionID]];
        //colapsTiles();
        draw();
    }
    function draw() {
        //drawFrame(TILE);
        for (let i = 0; i < frames.length; i++) {
            if (isColapse(frames[i])) {
                try {
                    drawImage(i, frames[i].options[0].image, frames[i].options[0].rotation);
                }
                catch (error) {
                    console.error(error);
                    stop();
                    //   location.reload();
                }
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
        document.body.appendChild(canvas);
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
            //location.reload();
        }
        // check if one Frame has zero option
        frames.forEach((frame) => {
            if (frame.options.length === 0) {
                waveColapsed = true;
                console.error("Frame has no options");
                draw();
                //location.reload();
            }
        });
        //start to get tile wiht last entorpy / options
        let minOpt = tiles.length + 1;
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
            checkFrameSidesCW(randomFrameID);
            checkFrameSidesCCW(randomFrameID);
            colapsTiles();
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
            const frameID = Array.from(toColapseFrames)[0];
            checkFrameSidesCW(frameID);
            checkFrameSidesCW(frameID);
            colapsTiles();
            let selectedFrame = frames[frameID];
            let randomOption = selectedFrame.options[Math.floor(Math.random() * selectedFrame.options.length)];
            if (logging) {
                console.log("This tile is selected:");
                console.log(selectedFrame);
                console.log("This tile has this options:");
                console.log(randomOption);
            }
            frames[frameID].options = new Array(randomOption);
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
        return frame.options.length == 1;
    }
    //TODO: check if optoins of Frames is compatible with tiles.
    function checkTopFrame(index) {
        if (logging) {
            console.log("compare frames around: " + index);
            console.log(frames[index]);
        }
        if (index >= frameCount) {
            //top side
            if (logging) {
                console.log("----");
                console.log("top side");
                console.log(frames[index - frameCount].options);
            }
            frames[index], frames[index - frameCount], "top";
            compareAndSetOptions(frames[index], frames[index - frameCount], "top");
            checkTopFrame(index - frameCount);
        }
    }
    function checkLeftFrame(index) {
        if (index % frameCount !== 0) {
            //left side
            if (logging) {
                console.log("----");
                console.log("left side");
                console.log(frames[index - 1].options);
            }
            compareAndSetOptions(frames[index], frames[index - 1], "left");
            checkLeftFrame(index - 1);
        }
    }
    function checkRightFrame(index) {
        if ((index + 1) % frameCount !== 0) {
            //right side
            if (logging) {
                console.log("----");
                console.log("right side");
                console.log(frames[index + 1].options);
            }
            compareAndSetOptions(frames[index], frames[index + 1], "right");
            checkRightFrame(index + 1);
        }
    }
    function checkBottomFrame(index) {
        if (index < frameCount * (frameCount - 1)) {
            //bottom side
            if (logging) {
                console.log("----");
                console.log("bottom side");
                console.log(frames[index + frameCount].options);
            }
            compareAndSetOptions(frames[index], frames[index + frameCount], "bottom");
            checkBottomFrame(index + frameCount);
        }
    }
    function checkFrameSidesCW(index) {
        checkTopFrame(index);
        checkRightFrame(index);
        checkBottomFrame(index);
        checkLeftFrame(index);
    }
    function checkFrameSidesCCW(index) {
        checkTopFrame(index);
        checkLeftFrame(index);
        checkBottomFrame(index);
        checkRightFrame(index);
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
                a.options = Array.from(aOpt).filter((item) => item !== undefined);
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
                a.options = Array.from(aOpt).filter((item) => item !== undefined);
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
                a.options = Array.from(aOpt).filter((item) => item !== undefined);
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
                a.options = Array.from(aOpt).filter((item) => item !== undefined);
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
                checkFrameSidesCW(index);
            }
        }
        for (let index = frames.length - 1; index > 0; index--) {
            if (!isColapse(frames[index])) {
                checkFrameSidesCCW(index);
            }
        }
    }
})(WFC2 || (WFC2 = {}));
function Sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
//# sourceMappingURL=WFCsec.js.map
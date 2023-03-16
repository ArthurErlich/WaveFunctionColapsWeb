"use strict";
var WFC2;
(function (WFC2) {
    const logging = true;
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
    const frameCount = 5;
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
    document.body.addEventListener("click", () => {
        console.log("--WAVE Clicked--");
        // checkFrameSides(1);
        // checkFrameSides(6);
        colapsTiles();
        wafeFunction();
        draw();
        console.log(frames);
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
            wafeFunction();
            draw();
            console.log(frames);
            console.log("--WAVE END--");
        } while (false); // !waveColapsed
    }
    function setup() {
        createCanvas();
        createFrames();
        createFrameElement();
        frames[0].options = [tiles[0]];
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
                toColapseFrames.add(new ColapseFrames(frames[i], i));
                console.warn("Tilese to kolapse");
                console.log(frames[i]);
            }
        }
        if (logging) {
            console.log(toColapseFrames);
        }
        if (toColapseFrames.size > 1) {
            const randomMumber = Math.floor(Math.random() * toColapseFrames.size);
            let opitons = Array.from(toColapseFrames)[randomMumber].frame.options;
            if (logging) {
                console.log("This tile is selected:");
                console.log(Array.from(toColapseFrames)[randomMumber]);
            }
            frames[Array.from(toColapseFrames)[randomMumber].index].options = [opitons[0]];
            //checkFrameSides(Array.from(toColapseFrames)[randomMumber].index);
        }
        else if (toColapseFrames.size == 1) {
            let opitons = Array.from(toColapseFrames)[0].frame.options;
            frames[Array.from(toColapseFrames)[0].index].options = [opitons[0]];
            if (logging) {
                console.log("This tile is selected:");
                console.log(Array.from(toColapseFrames)[0]);
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
        let aOpt = new Set();
        let bOpt = new Set();
        let result = new Set();
        switch (direction) {
            case "top":
                aOpt = new Set;
                bOpt = new Set;
                result = new Set;
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let indexB = 0; indexB < b.options.length; indexB++) {
                        let optionsA = Array.from(a.options[indexA].down);
                        let optionsB = Array.from(b.options[indexB].up);
                        for (let optA = 0; optA < optionsA.length; optA++) {
                            for (let optB = 0; optB < optionsB.length; optB++) {
                                if (loggingExtream) {
                                    console.log("-----------------");
                                    console.log(direction + " checking " + optA + optB);
                                    console.log((optionsA[optA]));
                                    console.log((optionsB[optB]));
                                    console.log("-----------------");
                                }
                                if ((JSON.stringify(optionsA[optB])) === (JSON.stringify(optionsB[optB]))) {
                                    aOpt.add(tiles[optionsB[optB].index]);
                                }
                            }
                        }
                    }
                }
                if (logging) {
                    console.log("-----------------");
                    console.warn("found match");
                    console.log("result: " + direction);
                    console.log(aOpt);
                    console.log("-----------------");
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            case "right":
                aOpt = new Set;
                bOpt = new Set;
                result = new Set;
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let indexB = 0; indexB < b.options.length; indexB++) {
                        let optionsA = Array.from(a.options[indexA].left);
                        let optionsB = Array.from(b.options[indexB].right);
                        for (let optA = 0; optA < optionsA.length; optA++) {
                            for (let optB = 0; optB < optionsB.length; optB++) {
                                if (loggingExtream) {
                                    console.log("-----------------");
                                    console.log(direction + " checking " + optA + optB);
                                    console.log((optionsA[optA]));
                                    console.log((optionsB[optB]));
                                    console.log("-----------------");
                                }
                                if ((JSON.stringify(optionsA[optB])) === (JSON.stringify(optionsB[optB]))) {
                                    aOpt.add(tiles[optionsB[optB].index]);
                                }
                            }
                        }
                    }
                }
                if (logging) {
                    console.log("-----------------");
                    console.warn("found match");
                    console.log("result: " + direction);
                    console.log(aOpt);
                    console.log("-----------------");
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            //TODO: Make Everthing like down this
            case "left":
                aOpt = new Set;
                bOpt = new Set;
                result = new Set;
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let indexB = 0; indexB < b.options.length; indexB++) {
                        let optionsA = Array.from(a.options[indexA].right);
                        let optionsB = Array.from(b.options[indexB].left);
                        for (let optA = 0; optA < optionsA.length; optA++) {
                            for (let optB = 0; optB < optionsB.length; optB++) {
                                if (loggingExtream) {
                                    console.log("-----------------");
                                    console.log(direction + " checking " + optA + optB);
                                    console.log((optionsA[optA]));
                                    console.log((optionsB[optB]));
                                    console.log("-----------------");
                                }
                                if ((JSON.stringify(optionsA[optB])) === (JSON.stringify(optionsB[optB]))) {
                                    aOpt.add(tiles[optionsB[optB].index]);
                                }
                            }
                        }
                    }
                }
                if (logging) {
                    console.log("-----------------");
                    console.warn("found match");
                    console.log("result: " + direction);
                    console.log(aOpt);
                    console.log("-----------------");
                }
                a.options = (Array.from(aOpt)).filter((item) => item !== undefined);
                break;
            case "bottom":
                aOpt = new Set;
                bOpt = new Set;
                result = new Set;
                for (let indexA = 0; indexA < a.options.length; indexA++) {
                    for (let indexB = 0; indexB < b.options.length; indexB++) {
                        let optionsA = Array.from(a.options[indexA].up);
                        let optionsB = Array.from(b.options[indexB].down);
                        for (let optA = 0; optA < optionsA.length; optA++) {
                            for (let optB = 0; optB < optionsB.length; optB++) {
                                if (loggingExtream) {
                                    console.log("-----------------");
                                    console.log(direction + " checking " + optA + optB);
                                    console.log((optionsA[optA]));
                                    console.log((optionsB[optB]));
                                    console.log("-----------------");
                                }
                                if ((JSON.stringify(optionsA[optB])) === (JSON.stringify(optionsB[optB]))) {
                                    aOpt.add(tiles[optionsB[optB].index]);
                                }
                            }
                        }
                    }
                }
                if (logging) {
                    console.log("-----------------");
                    console.warn("found match");
                    console.log("result: " + direction);
                    console.log(aOpt);
                    console.log("-----------------");
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

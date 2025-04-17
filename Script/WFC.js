"use strict";
var WFC3;
(function (WFC3) {
    const canvasDIM = 500;
    const frameCount = 4;
    //Canvas and Frames setup
    const canvas = document.createElement("div");
    const frameElements = new Array(frameCount * frameCount);
    //----Utility Classes----\\
    class Frame extends HTMLElement {
        constructor() {
            super();
            this.options = tiles;
            this.index = 0;
        }
    }
    customElements.define("custom-frame", Frame);
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
    const tiles = [
        //BlankTile
        new Tile(0, 0, "../images/blank.png"),
        //StrightTile
        new Tile(1, 0, "../images/stright.png"),
        //StrightTile 90°
        new Tile(2, 1, "../images/stright.png"),
        //CornerTile right, down
        new Tile(3, 0, "../images/corner.png"),
    ];
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
    //----Start of Render----\\
    setup();
    initFrame();
    drawCanvas();
    //should be in a loop until everything is collapsed
    waveFunction();
    drawCanvas();
    function setup() {
        createCanvas();
        createFrameElement();
    }
    function initFrame() {
        let frame = frameElements[1]; //Math.round((frameCount * frameCount) / 2)
        frame.options = [tiles[2]];
    }
    function drawCanvas() {
        frameElements.forEach((element) => {
            element.innerText = element.options.length.toString();
            if (isColapse(element)) {
                drawImage(element);
            }
        });
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
    function createFrameElement() {
        let i = 0;
        for (let y = 0; y < frameCount; y++) {
            for (let x = 0; x < frameCount; x++) {
                const element = document.createElement("custom-frame");
                const frameSize = canvasDIM / frameCount;
                element.index = i;
                element.setAttribute("id", "frame");
                element.dataset.index = i.toString();
                element.dataset.x = x.toString();
                element.dataset.y = x.toString();
                element.dataset.colapsed = "false";
                element.style.width = frameSize - 2 + "px";
                element.style.height = frameSize - 2 + "px";
                element.style.backgroundSize = "cover";
                element.style.border = "1px solid white";
                element.style.color = "white";
                element.style.display = "flex";
                element.style.justifyContent = "center";
                element.style.alignItems = "center";
                element.style.backgroundColor = "black";
                frameElements[i] = element;
                canvas.appendChild(element);
                i++;
                element.addEventListener("mousedown", () => {
                    element.classList.add("selected");
                });
                element.addEventListener("mouseup", () => {
                    element.classList.remove("selected");
                });
                element.addEventListener("mouseleave", () => {
                    element.classList.remove("selected");
                });
            }
        }
    }
    function isColapse(frame) {
        return frame.options.length == 1;
    }
    function drawImage(frame) {
        //get the iomage form the ony possible tile.
        frame.style.backgroundImage = "URL(" + frame.options[0].image + ")";
        frame.style.transform = "rotate(" + frame.options[0].rotation * 90 + "deg )";
    }
    function waveFunction() {
        //List of Frames with least entropy to be colapsed
        let toColapseFrames = new Set();
        //Check every Frame if one is colapsed
        for (let i = 0; i < frameElements.length; i++) {
            const frame = frameElements[i];
            //Check if Frame has only one Option
            if (isColapse(frame)) {
                drawImage(frame);
            }
            //Calculate Entropy to other tiles
            calculateEntropy();
            //start to get tile wiht last entorpy / options
            let leastEntropy = tiles.length; //start with maximum
            for (let i = 0; i < frameElements.length; i++) {
                const frame = frameElements[i];
                if (!isColapse(frame)) {
                    if (frame.options.length < leastEntropy) {
                        leastEntropy = frame.options.length;
                    }
                }
            }
            //add tile to list with least entropy/options
            for (let i = 0; i < frameElements.length; i++) {
                if (frame.options.length == leastEntropy) {
                    toColapseFrames.add(frame);
                }
            }
            //now start the colaps of frames
            if (toColapseFrames.size < 1) {
                return true;
            }
        }
        return false;
    }
    function calculateEntropy() {
        //Stort from left to right, keep treack of changed tiles and rerun if tiles changed.
        let updatedTiles = 0;
        do {
            console.log("UPDATE");
            updatedTiles = 0;
            for (let i = 0; i < frameElements.length; i++) {
                //Check sides top left bottom right remove entoryp/options of own tile if not compatible
                const frame = frameElements[i];
                if (checkRightFrame(frame)) {
                    //   updatedTiles++;
                }
                if (checkLeftFrame(frame)) {
                    //   updatedTiles++;
                }
                if (checkBottomFrame(frame)) {
                    //   updatedTiles++;
                }
                if (checkTopFrame(frame)) {
                    //   updatedTiles++;
                }
            }
        } while (updatedTiles > 0);
    }
    function checkTopFrame(frame) {
        let isChanged = false;
        if (frame.index - frameCount > 0) {
            let neighbor = frameElements[frame.index - frameCount];
            let possibleOptions;
            if (neighbor.options.length == frame.options.length) {
                return isChanged;
            }
            isChanged = true;
            possibleOptions = compareAndGetOptions(frame, neighbor, "");
            return isChanged; //DEBUG
            frame.options = possibleOptions;
        }
        return isChanged;
    }
    function checkLeftFrame(frame) {
        let isChanged = false;
        if (frame.index % frameCount !== 0) {
            let neighbor = frameElements[frame.index - 1];
            let possibleOptions;
            if (neighbor.options.length == frame.options.length) {
                return isChanged;
            }
            isChanged = true;
            possibleOptions = compareAndGetOptions(frame, neighbor, "");
            return isChanged; //DEBUG
            frame.options = possibleOptions;
        }
        return isChanged;
    }
    function checkBottomFrame(frame) {
        let isChanged = false;
        if (frame.index < frameCount * frameCount - frameCount - 1) {
            let neighbor = frameElements[frame.index + frameCount];
            let possibleOptions;
            if (neighbor.options.length == frame.options.length) {
                return isChanged;
            }
            isChanged = true;
            possibleOptions = compareAndGetOptions(frame, neighbor, "");
            return isChanged; //DEBUG
            frame.options = possibleOptions;
        }
        return isChanged;
    }
    function checkRightFrame(frame) {
        let isChanged = false;
        if ((frame.index + 1) % frameCount !== 0) {
            let neighbor = frameElements[frame.index + 1];
            let possibleOptions;
            if (neighbor.options.length == frame.options.length) {
                return isChanged;
            }
            isChanged = true;
            possibleOptions = compareAndGetOptions(frame, neighbor, "");
            return isChanged; //DEBUG
            frame.options = possibleOptions;
        }
        return isChanged;
    }
    function compareAndGetOptions(frame, neighbor, direct) {
        //Compare the sides with allowd option
        //go trouhg all Options and compare the Sets
        //example direction down
        console.log(frame.options[0].down);
        console.log(frame.options[0].up);
        return [];
    }
})(WFC3 || (WFC3 = {}));

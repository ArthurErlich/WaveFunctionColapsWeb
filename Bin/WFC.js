"use strict";
var wfc;
(function (wfc) {
    const body = document.body;
    let canvasSize = 400;
    let gridSize = 2;
    let tileElement = new Array(gridSize * gridSize);
    let tileElementList = new Array(gridSize * gridSize);
    class Tile {
        constructor(rotation, imageURL, up, right, down, left) {
            this.rotation = 0;
            this.imageURL = "";
            this.rotation = rotation;
            this.imageURL = imageURL;
            this.up = up;
            this.right = right;
            this.down = down;
            this.left = left;
        }
    }
    class TRot {
        constructor(tile, rotation) {
            this.tile = tile;
            this.rotation = rotation;
        }
    }
    class TileElement {
        isColapsed() {
            return this.colapsed;
        }
        getEntropy() {
            return this.possibleTiles.length;
        }
        getPossibleTiles(index) {
            return this.possibleTiles[index];
        }
        constructor(rotation, possibleTiles) {
            this.colapsed = false;
            this.rotation = rotation;
            this.possibleTiles = possibleTiles;
        }
    }
    const tileList = [
        new Tile(0, "../images/blank.png", [new TRot(0, 0)], [new TRot(0, 0), new TRot(1, 0)], [new TRot(0, 0)], [new TRot(0, 0), new TRot(1, 0)]),
        new Tile(0, "../images/stright.png", [new TRot(1, 0)], [new TRot(0, 0), new TRot(1, 0)], [new TRot(1, 0)], [new TRot(0, 0), new TRot(1, 0)]),
    ];
    const canvas = setUpCanvas();
    setGrid(gridSize);
    canvas.addEventListener("click", (event) => {
        if (gridSize * gridSize != tileElement.length) {
            canvas.innerHTML = "";
            setGrid(gridSize);
            console.log("Gridsize changed to: " + gridSize);
        }
        colapsTileOne();
        console.log("start WVC");
        colapse();
        checkNeigbors(0);
    });
    function setUpCanvas() {
        const canvas = document.createElement("div");
        canvas.setAttribute("id", "canvas");
        canvas.style.width = canvasSize + "px";
        canvas.style.height = canvasSize + "px";
        canvas.style.backgroundColor = "black";
        canvas.style.display = "flex";
        canvas.style.flexWrap = "wrap";
        body.appendChild(canvas);
        return canvas;
    }
    function setGrid(size) {
        tileElement = new Array(size * size);
        let i = 0;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                tileElement[i] = canvas.appendChild(createtileElement(size, i));
                i++;
            }
        }
    }
    function createtileElement(size, index) {
        const tileElementSize = canvasSize / size;
        const tileElement = document.createElement("div");
        tileElementList[index] = new TileElement(0, tileList);
        tileElement.setAttribute("id", "frame");
        tileElement.dataset.index = index.toString();
        tileElement.dataset.entropy = tileList.length.toString();
        tileElement.dataset.colapsed = "false";
        tileElement.style.width = tileElementSize - 2 + "px";
        tileElement.style.height = tileElementSize - 2 + "px";
        tileElement.style.backgroundSize = "cover";
        tileElement.style.border = "1px solid black";
        tileElement.style.flex;
        tileElement.addEventListener("click", () => {
            console.log((tileElementList[parseInt(tileElement.dataset.index)]).getPossibleTiles);
        });
        return tileElement;
    }
    function fillTileElment(tile, tileElement) {
        console.log("filling Tile");
        tileElement.style.backgroundImage = "url(" + tile.imageURL + ")";
        tileElement.style.backgroundPosition = "center";
        tileElement.style.transform = "rotate(" + tile.rotation * 90 + "deg)";
        tileElement.dataset.rotation = tile.rotation.toString();
        tileElement.dataset.elemnt = tile.imageURL;
    }
    function colapsTileOne() {
        let tile = tileElementList[0];
        tile.possibleTiles = new Array(tileList[1]);
        tile.colapsed = true;
    }
    function colapse() {
        for (let i = 0; i < tileList.length; i++) {
            if (!tileElementList[i].isColapsed()) {
            }
            else {
                fillTileElment(tileList[Math.floor(Math.random() * tileList.length)], tileElement[0]);
            }
        }
    }
    function indexWithLeastEntropy() {
        let least = tileElementList.length;
        console.log(least);
        for (let i = 0; i < tileList.length; i++) {
            if (tileElementList[i].getEntropy() < least) {
                least = i;
            }
        }
        if (tileElement) { }
        return tileElementList[0];
    }
    function checkNeigbors(index) {
        if (index % gridSize !== 0) {
            console.log("checkin " + (index - 1));
            let selectedTile = tileElementList[index];
            let tileLeft = tileElementList[index - 1];
            let tileRightElements = [];
            selectedTile.possibleTiles.forEach(selection => {
                tileLeft.possibleTiles.forEach(left => {
                    if (selection.left === left.right) {
                    }
                    tileRightElements.push(left);
                });
            });
        }
        else {
            console.log("border");
        }
        if ((index + 1) % gridSize !== 0) {
            console.log("cheking " + (index + 1));
        }
        else {
            console.log("border");
        }
        if (index >= gridSize) {
            console.log("checking " + (index - gridSize));
        }
        else {
            console.log("border");
        }
        if (index < gridSize * (gridSize - 1)) {
            console.log("checking " + (index + gridSize));
            let selectedTile = tileElementList[index];
            let tileDown = tileElementList[index + gridSize];
            let tileDownElements = [];
            for (let i = 0; i < selectedTile.possibleTiles.length; i++) {
                for (let s = 0; s < tileDown.possibleTiles.length; s++) {
                    let downAccepted = selectedTile.possibleTiles[i].down;
                    let upAcceptetd = tileDown.possibleTiles[s].up;
                    upAcceptetd.forEach(up => {
                        downAccepted.forEach(down => {
                            if (down.tile === up.tile && down.rotation === up.rotation) {
                                console.log("-----");
                                console.log(up);
                                console.log("-----");
                            }
                        });
                    });
                }
            }
            console.log("-----");
            console.log(tileDownElements);
        }
        else {
            console.log("border");
        }
    }
})(wfc || (wfc = {}));
//# sourceMappingURL=WFC.js.map
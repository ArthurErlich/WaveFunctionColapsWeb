"use strict";
const body = document.body;
let canvasSize = 800;
let gridSize = 2;
let tileElement = new Array(gridSize * gridSize);
//Tiles
class Tile {
    constructor(rotation, imageURL, up, right, down, left) {
        //name: string = "";
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
const tileList = [
    //Blank
    new Tile(0, "../images/blank.png", [new TRot(0, 0)], //up
    [new TRot(0, 0)], //right
    [new TRot(0, 0)], //down
    [new TRot(0, 0)]),
    //Stright
    new Tile(0, "../images/stright.png", [new TRot(0, 0)], //up
    [new TRot(0, 0)], //right
    [new TRot(0, 0)], //down
    [new TRot(0, 0)]),
    new Tile(1, "../images/stright.png", [new TRot(0, 0)], //up
    [new TRot(0, 0)], //right
    [new TRot(0, 0)], //down
    [new TRot(0, 0)]),
    //Corner
    new Tile(0, "../images/corner.png", [new TRot(0, 0)], //up
    [new TRot(0, 0)], //right
    [new TRot(0, 0)], //down
    [new TRot(0, 0)]), //left
];
const canvas = setUpCanvas();
setGrid(gridSize);
canvas.addEventListener("click", (event) => {
    if (gridSize * gridSize != tileElement.length) {
        canvas.innerHTML = "";
        setGrid(gridSize);
        console.log("Gridsize changed to: " + gridSize);
    }
});
function setUpCanvas() {
    const canvas = document.createElement("div");
    canvas.setAttribute("id", "canvas");
    console.log(canvas);
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
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            tileElement[x + y] = canvas.appendChild(createtileElement(size, x + y));
        }
    }
}
function createtileElement(size, index) {
    const tileElementSize = canvasSize / size;
    const tileElement = document.createElement("div");
    fillTileElment(tileList[Math.floor(Math.random() * tileList.length)], tileElement); //colaps tile
    tileElement.setAttribute("id", "frame");
    tileElement.dataset.index = index.toString();
    tileElement.dataset.colapsed = "false";
    tileElement.style.width = tileElementSize - 2 + "px";
    tileElement.style.height = tileElementSize - 2 + "px";
    tileElement.style.backgroundSize = "cover";
    tileElement.style.border = "1px solid black";
    tileElement.style.flex;
    tileElement.addEventListener("click", () => {
        console.log("tileElement clicked: " + tileElement.dataset.index + "\n"
            + "colapsed: " + tileElement.dataset.colapsed + "\n"
            + "rotation: " + parseInt(tileElement.dataset.rotation) * 90 + "°"); // parseInt(tileElement.dataset.rotation) * 90 + "°" -> undefined?!
    });
    return tileElement;
}
function fillTileElment(tile, tileElement) {
    tileElement.style.backgroundImage = "url(" + tile.imageURL + ")";
    tileElement.style.backgroundPosition = "center";
    tileElement.style.transform = "rotate(" + tile.rotation * 90 + "deg)";
    tileElement.dataset.rotation = tile.rotation.toString();
    tileElement.dataset.elemnt = tile.imageURL;
}
function changetileElement(index) {
    tileElement[index].style.backgroundColor = "red";
}

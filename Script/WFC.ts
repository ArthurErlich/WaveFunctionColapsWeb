const body: HTMLElement = document.body;

let canvasSize: number = 800;
let gridSize: number = 2;
let tileElement: HTMLElement[] = new Array(gridSize * gridSize);


//Tiles
class Tile {
    //name: string = "";
    rotation: number = 0;
    //connections
    up: TRot[];
    right: TRot[];
    down: TRot[];
    left: TRot[];

    imageURL: string = "";

    constructor(rotation: number, imageURL: string, up: TRot[], right: TRot[], down: TRot[], left: TRot[]) {
        this.rotation = rotation;
        this.imageURL = imageURL;
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
    }
}
class TRot {
    tile: number;
    rotation: number;
    constructor(tile: number, rotation: number) {
        this.tile = tile;
        this.rotation = rotation;
    }
}
const tileList: Tile[] = [
    //Blank
    new Tile(0, "../images/blank.png",
        [new TRot(0, 0)], //up
        [new TRot(0, 0)], //right
        [new TRot(0, 0)], //down
        [new TRot(0, 0)]), //left

    //Stright
    new Tile(0, "../images/stright.png",
        [new TRot(0, 0)], //up
        [new TRot(0, 0)], //right
        [new TRot(0, 0)], //down
        [new TRot(0, 0)]), //left


    new Tile(1, "../images/stright.png",
        [new TRot(0, 0)], //up
        [new TRot(0, 0)], //right
        [new TRot(0, 0)], //down
        [new TRot(0, 0)]), //left

    //Corner
    new Tile(0, "../images/corner.png",
        [new TRot(0, 0)], //up
        [new TRot(0, 0)], //right
        [new TRot(0, 0)], //down
        [new TRot(0, 0)]), //left

];

const canvas: HTMLElement = setUpCanvas();
setGrid(gridSize);

canvas.addEventListener("click", (event: MouseEvent) => {
    if (gridSize * gridSize != tileElement.length) {
        canvas.innerHTML = "";
        setGrid(gridSize);
        console.log("Gridsize changed to: " + gridSize);

    }
});


function setUpCanvas(): HTMLElement {
    const canvas: HTMLElement = document.createElement("div");
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

function setGrid(size: number): void {
    tileElement = new Array(size * size);
    for (let x: number = 0; x < size; x++) {
        for (let y: number = 0; y < size; y++) {
            tileElement[x + y] = canvas.appendChild(createtileElement(size, x + y));
        }
    }
}

function createtileElement(size: number, index: number): HTMLElement {
    const tileElementSize: number = canvasSize / size;
    const tileElement: HTMLElement = document.createElement("div");

    fillTileElment(tileList[Math.floor(Math.random() * tileList.length)], tileElement);//colaps tile

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
            + "rotation: " + parseInt(tileElement.dataset.rotation) * 90 + "°") // parseInt(tileElement.dataset.rotation) * 90 + "°" -> undefined?!

    });

    return tileElement;
}
function fillTileElment(tile: Tile, tileElement: HTMLElement) {
    tileElement.style.backgroundImage = "url(" + tile.imageURL + ")";
    tileElement.style.backgroundPosition = "center";
    tileElement.style.transform = "rotate(" + tile.rotation * 90 + "deg)"
    tileElement.dataset.rotation = tile.rotation.toString();
    tileElement.dataset.elemnt = tile.imageURL;
}

function changetileElement(index: number) {
    tileElement[index].style.backgroundColor = "red";
}
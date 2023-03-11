const body: HTMLElement = document.body;

let canvasSize: number = 400;
let gridSize: number = 2;
let tileElement: HTMLElement[] = new Array(gridSize * gridSize);
let tileElementList: TileElement[] = new Array(gridSize * gridSize);


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
class TileElement {
    public colapsed: boolean = false;
    public rotation: number;
    public possibleTiles: Tile[];

    public isColapsed(): boolean {
        return this.colapsed;
    }
    public getEntropy(): number {
        return this.possibleTiles.length;
    }
    public getPossibleTiles(index: number): Tile {
        return this.possibleTiles[index];
    }

    constructor(rotation: number, possibleTiles: Tile[]) {
        this.rotation = rotation;
        this.possibleTiles = possibleTiles;
    }
}
const tileList: Tile[] = [
    //Kreate a list for better fisualisation- maybe a JSON file?
    //Blank
    new Tile(0, "../images/blank.png",
        [new TRot(0, 0)], //up
        [new TRot(0, 0), new TRot(1, 0)], //right
        [new TRot(0, 0)], //down
        [new TRot(0, 0), new TRot(1, 0)]), //left

    //Stright
    new Tile(0, "../images/stright.png",
        [new TRot(1, 0)], //up
        [new TRot(0, 0), new TRot(1, 0)], //right
        [new TRot(1, 0)], //down
        [new TRot(0, 0), new TRot(1, 0)]), //left

    /*
    new Tile(1, "../images/stright.png",
        [new TRot(0, 0)], //up
        [new TRot(1, 1)], //right
        [new TRot(1, 1)], //down
        [new TRot(0, 0)]), //left

    //Corner
    /*new Tile(0, "../images/corner.png",
        [new TRot(0, 0)], //up
        [new TRot(0, 0)], //right
        [new TRot(0, 0)], //down
        [new TRot(0, 0)]), //left
*/
];


const canvas: HTMLElement = setUpCanvas();
setGrid(gridSize);

canvas.addEventListener("click", (event: MouseEvent) => {
    if (gridSize * gridSize != tileElement.length) {
        canvas.innerHTML = "";
        setGrid(gridSize);
        console.log("Gridsize changed to: " + gridSize);
    }
    colapsTileOne();
    console.log("start WVC");
    //console.log(tileElementList);
    colapse();
    checkNeigbors(0);
});


function setUpCanvas(): HTMLElement {
    const canvas: HTMLElement = document.createElement("div");
    canvas.setAttribute("id", "canvas");
    //console.log(canvas);

    canvas.style.width = canvasSize + "px";
    canvas.style.height = canvasSize + "px";
    canvas.style.backgroundColor = "black";
    canvas.style.display = "flex";
    canvas.style.flexWrap = "wrap";
    body.appendChild(canvas);

    return canvas;
}

function setGrid(size: number): void {
    //console.log("genGridSize: "+ size*size);

    tileElement = new Array(size * size);
    let i: number = 0;
    for (let x: number = 0; x < size; x++) {
        for (let y: number = 0; y < size; y++) {
            tileElement[i] = canvas.appendChild(createtileElement(size, i));
            //console.log("genTile: "+ (i));
            i++;

        }
    }
}

function createtileElement(size: number, index: number): HTMLElement {
    const tileElementSize: number = canvasSize / size;
    const tileElement: HTMLElement = document.createElement("div");

    tileElementList[index] = new TileElement(0, tileList,);

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
        console.log((tileElementList[parseInt(tileElement.dataset.index!)]).getPossibleTiles);

        /*console.log("tileElement clicked: " + tileElement.dataset.index + "\n"
            + "colapsed: " + tileElement.dataset.colapsed + "\n"
            + "rotation: " + parseInt(tileElement.dataset.rotation!) * 90 + "°") // parseInt(tileElement.dataset.rotation) * 90 + "°" -> undefined?!*/

    });

    return tileElement;
}
// to class!
function fillTileElment(tile: Tile, tileElement: HTMLElement) {
    console.log("filling Tile");
    tileElement.style.backgroundImage = "url(" + tile.imageURL + ")";
    tileElement.style.backgroundPosition = "center";
    tileElement.style.transform = "rotate(" + tile.rotation * 90 + "deg)"
    tileElement.dataset.rotation = tile.rotation.toString();
    tileElement.dataset.elemnt = tile.imageURL;
}

function colapsTileOne(): void {
    let tile: TileElement = tileElementList[0];
    tile.possibleTiles = new Array(tileList[1]);
    tile.colapsed = true;
}

function colapse(): void {
    for (let i: number = 0; i < tileList.length; i++) {
        if (!tileElementList[i].isColapsed()) {
        } else {
            fillTileElment(tileList[Math.floor(Math.random() * tileList.length)], tileElement[0]);
        }
    }
}
function indexWithLeastEntropy(): TileElement {
    let least: number = tileElementList.length;
    console.log(least);


    //-> instand of setting entropy. just use the list of possible tieles
    //console.log(tileElementList[0].getEntropy());

    for (let i: number = 0; i < tileList.length; i++) {

        if (tileElementList[i].getEntropy() < least) {
            least = i;
        }
    }
    if (tileElement) { }

    return tileElementList[0];
}
function checkNeigbors(index: number): void {
    //check left
    if (index % gridSize !== 0) {
        console.log("checkin " + (index - 1));

        let selectedTile: TileElement = tileElementList[index];
        let tileLeft: TileElement = tileElementList[index - 1];

        let tileRightElements: Tile[] = [];

        //Chekc the if the tile is possilbe on the left
        selectedTile.possibleTiles.forEach(selection => {
            tileLeft.possibleTiles.forEach(left => {
                if (selection.left === left.right) {
                }
                tileRightElements.push(left);
            });
        });
        // console.log(tileRightElements);

    } else {
        console.log("border");
    }

    //check right
    if ((index + 1) % gridSize !== 0) {
        console.log("cheking " + (index + 1));



    } else {
        console.log("border");
    }

    // check up
    if (index >= gridSize) {
        console.log("checking " + (index - gridSize));

    } else {
        console.log("border");
    }

    // check down
    if (index < gridSize * (gridSize - 1)) {
        console.log("checking " + (index + gridSize));

        let selectedTile: TileElement = tileElementList[index];
        let tileDown: TileElement = tileElementList[index + gridSize];

        let tileDownElements: TRot[] = [];

        //Chekc the if the tile is possilbe on the right

        //This are the posssabilities
        for (let i: number = 0; i < selectedTile.possibleTiles.length; i++) {
            //get all the tilese of the checked tile
            for (let s: number = 0; s < tileDown.possibleTiles.length; s++) {
                let downAccepted = selectedTile.possibleTiles[i].down;
                let upAcceptetd = tileDown.possibleTiles[s].up;


                /// only tile 1 is right? Which is wrong!
                upAcceptetd.forEach(up => {
                    downAccepted.forEach(down => {
                        if(down.tile === up.tile && down.rotation === up.rotation){
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

    } else {
        console.log("border");

    }

}


//fix tileList -> make objetct to save the Entropy and if the tile is collapsed
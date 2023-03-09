const body: HTMLElement = document.body;

let canvasSize: number = 400;
let gridSize: number = 2;
let tileElement: HTMLElement[] = new Array(gridSize * gridSize);
let tileElementList:TileElement[] = new Array(gridSize*gridSize);


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
    public colapsed:boolean = false;
    public rotation:number;
    public entropy:number;
    public possibleTiles:Tile[];

    public isColapsed():boolean{
        return this.colapsed;
    }
    public getEntropy():number{
        return this.entropy;
    }
    public getPossibleTiles(index:number):Tile{
        return this.possibleTiles[index];
    }

    constructor(rotation:number,entropy:number,possibleTiles:Tile[]){
        this.rotation=rotation;
        this.entropy=entropy;
        this.possibleTiles = possibleTiles;
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
        [new TRot(1, 0)], //up
        [new TRot(0, 0)], //right
        [new TRot(1, 0)], //down
        [new TRot(0, 0)]), //left


    new Tile(1, "../images/stright.png",
        [new TRot(0, 0)], //up
        [new TRot(1, 1)], //right
        [new TRot(1, 1)], //down
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
    console.log("start WVC");
    //colapseTile();
    console.log(tileElementList);
    
    
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

    fillTileElment(tileList[Math.floor(Math.random() * tileList.length)], tileElement);//colaps tile needed

    tileElementList[index] = new TileElement(0,tileElementList.length,tileList,);

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
        /*console.log("tileElement clicked: " + tileElement.dataset.index + "\n"
            + "colapsed: " + tileElement.dataset.colapsed + "\n"
            + "rotation: " + parseInt(tileElement.dataset.rotation!) * 90 + "°") // parseInt(tileElement.dataset.rotation) * 90 + "°" -> undefined?!*/

    });

    return tileElement;
}
// to class!
function fillTileElment(tile: Tile, tileElement: HTMLElement) {
    tileElement.style.backgroundImage = "url(" + tile.imageURL + ")";
    tileElement.style.backgroundPosition = "center";
    tileElement.style.transform = "rotate(" + tile.rotation * 90 + "deg)"
    tileElement.dataset.rotation = tile.rotation.toString();
    tileElement.dataset.elemnt = tile.imageURL;
}


function colapseTile():void{
    for(let i:number = 0; i < tileList.length;i++){
        if(!tileElementList[i].isColapsed()){
            console.log("tile wiht least entropy "+indexWithLeastEntropy());
             
        }
    }
}
function indexWithLeastEntropy():HTMLElement{
    let least:number = tileElementList.length;

    //-> instand of setting entropy. just use the list of possible tieles

    for(let i:number = 0; i < tileList.length;i++){

        if(tileElementList[i].getEntropy() < least){
            least = i;
            console.log(least);
        }
    }
    return tileElement[least];
}

//fix tileList -> make objetct to save the Entropy and if the tile is collapsed
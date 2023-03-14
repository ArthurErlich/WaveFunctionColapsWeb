namespace WFC2 {
    class Frame {
        options: Tile[];
        constructor(options: Tile[]) {
            this.options = options;
        }
    }
    class Tile {
        rotation: number;
        image?: string;
        index: number;

        up?: Set<Tile>;
        right?: Set<Tile>;
        down?: Set<Tile>;
        left?: Set<Tile>;

        constructor(
            index: number,
            rotation: number,
            image?: string,
            up?: Set<Tile>,
            right?: Set<Tile>,
            down?: Set<Tile>,
            left?: Set<Tile>,) {

            this.index = index;
            this.rotation = rotation;
            this.image = image;
            this.up = up;
            this.right = right;
            this.down = down;
            this.left = left;
        }
    }

    const canvasDIM: number = 600;
    const frameCount: number = 2;

    //Canvas and Frames setup
    const canvas: HTMLElement = document.createElement("div");
    const frameElements: HTMLElement[] = new Array(frameCount * frameCount);

    const frames: Frame[] = new Array(frameCount * frameCount);
    const tiles: Tile[] = [
        //StrightTile
        new Tile(0, 0, "../images/stright.png"),
        new Tile(0, 0, "../images/blank.png"),
    ];

    let waveColapsed: boolean = false;

    //setting compatible options for Tiles

    //StrightTile
    tiles[0].up = new Set<Tile>([tiles[0]]);
    tiles[0].right = new Set<Tile>([tiles[0], tiles[1]]);
    tiles[0].down = new Set<Tile>([tiles[0]]);
    tiles[0].left = new Set<Tile>([tiles[0], tiles[1]]);

    //BlankTile

    tiles[1].up = new Set<Tile>([tiles[1]]);
    tiles[1].right = new Set<Tile>([tiles[1]]);
    tiles[1].down = new Set<Tile>([tiles[1]]);
    tiles[1].left = new Set<Tile>([tiles[1]]);


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
    
    function setup(): void {
        createCanvas();
        createFrames();
        createFrameElement();
    }

    function draw(): void {
        //drawFrame(TILE);
        for (let i: number = 0; i < frames.length; i++) {
            if (isColapse(frames[i])) {
                drawImage(i, frames[i].options[0].image!);
            }
        }
    }

    function createCanvas(): void {
        canvas.setAttribute("id", "canvas");
        canvas.style.width = canvasDIM + "px";
        canvas.style.height = canvasDIM + "px";
        canvas.style.backgroundColor = "black";
        canvas.style.display = "flex";
        canvas.style.flexWrap = "wrap";
        (document.body).appendChild(canvas);
    }
    function createFrames(): void {
        let index: number = 0;
        for (let x: number = 0; x < frameCount; x++) {
            for (let y: number = 0; y < frameCount; y++) {
                frames[index] = new Frame(tiles);
                index++;
            }
        }
    }
    function createFrameElement(): void {
        for (let i: number = 0; i < frames.length; i++) {
            const element: HTMLElement = document.createElement("div");
            const frameSize: number = canvasDIM / frameCount;

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
    function wafeFunction(): void {
        let colapsedFrames: Set<Frame> = new Set<Frame>();
        let toColapseFrames: Set<Frame> = new Set<Frame>();

        let optionsLengt: number = 0;

        for (let i: number = 0; i < frames.length; i++) {
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
        for (let frame of frames){
            if(!isColapse(frame)){
                toColapseFrames.add(frame);
            }
        }
        console.log(toColapseFrames);
        
  

    }
    function drawImage(index: number, image: string): void {
        frameElements[index].style.backgroundImage = "url(" + image + ")";
    }

    function isColapse(frame: Frame): boolean {
        return (frame.options.length == 1);
    }

    //TODO: check if optoins of Frames is compatible with tiles.
    function checkFrameSides(index:number): void {
        if (index % frameCount !== 0) {
            //left side
            console.log("left side");
            console.log(frames[index-1].options);
        }
        if(((index+1)% frameCount) !== 0){
            //right side
            console.log("right side");
            console.log(frames[index+1].options);
        }
        if(index >= frameCount){
            //top side
            console.log("top side");
            console.log(frames[index-frameCount].options);
        }
        if(index < frameCount * (frameCount-1)){
            //bottom side
            console.log("bottom side");
            console.log(frames[index+frameCount].options);
        }
    }

    function setOptions(index: number, options: Tile[]): void {
        frames[index].options = options;
    }

    function compareOptions(option1:Frame, option2:Frame):Set<Frame>{
        let result:Set<Frame> = new Set<Frame>;
        return result;
    }
}
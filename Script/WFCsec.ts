namespace WFC2 {
    class Frame {
        options: Tile[];
        constructor(options: Tile[]) {
            this.options = options;
        }
    }
    class Tile {
        rotation: number;
        image: string;

        up: Set<Tile>;
        right: Set<Tile>;
        down: Set<Tile>;
        left: Set<Tile>;

        constructor(rotation: number, image: string, up: Set<Tile>, right: Set<Tile>, down: Set<Tile>, left: Set<Tile>,) {
            this.rotation = rotation;
            this.image = image;
            this.up = up;
            this.right = right;
            this.down = down;
            this.left = left;
        }
    }

    const canvasDIM: number = 600;
    const frameLength: number = 2;

    //Canvas and Frames setup
    const canvas: HTMLElement = document.createElement("div");
    const frameElements: HTMLElement[] = new Array(frameLength * frameLength);

    const frames: Frame[] = new Array(frameLength * frameLength);
    const tiles: Tile[] = [

        //StrightTile
        new Tile(
            0,".//images/stright.png",
        new Set<Tile>()),
        new Tile()

    ];


    setup();
    draw();


    function setup(): void {
        createCanvas();
        createFrames();
        createFrameElement();
    }

    function draw(): void {
        //drawFrame(TILE);
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
        for (let x: number = 0; x < canvasDIM; x++) {
            for (let y: number = 0; y < canvasDIM; y++) {
                frames[index] = new Frame();
                index++;
            }
        }
    }
    function createFrameElement(): void {
        for (let i: number = 0; i < frames.length; i++) {
            const element: HTMLElement = document.createElement("div");
            const frameSize: number = canvasDIM / frameLength;

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
}
namespace WFC2 {

    const logging: boolean = true;

    class Frame {
        options: Tile[];
        constructor(options: Tile[]) {
            this.options = options;
        }
    }
    class Tile {
        index: number;
        rotation: number;
        image: string;

        up?: Set<Tile>;
        right?: Set<Tile>;
        down?: Set<Tile>;
        left?: Set<Tile>;

        constructor(
            index: number,
            rotation: number,
            image: string,
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
        public map(): string {
            return (this.index.toString() + this.rotation + this.image);
        }

    }
    class ColapseFrames {
        frame: Frame;
        index: number;
        constructor(frame: Frame, index: number) {
            this.frame = frame;
            this.index = index;
        }
    }

    const canvasDIM: number = 800;
    const frameCount: number = 2
        ;

    //Canvas and Frames setup
    const canvas: HTMLElement = document.createElement("div");
    const frameElements: HTMLElement[] = new Array(frameCount * frameCount);

    const frames: Frame[] = new Array(frameCount * frameCount);
    const tiles: Tile[] = [
        //BlankTile
        new Tile(0, 0, "../images/blank.png"),
        //StrightTile
        new Tile(1, 0, "../images/stright.png"),
        //StrightTile 90°
        new Tile(2, 1, "../images/stright.png"),


    ];

    let waveColapsed: boolean = false;

    //setting compatible options for Tiles Searching for better listing!

    //BlankTile
    tiles[0].up = new Set<Tile>([tiles[0], tiles[2]]);
    tiles[0].right = new Set<Tile>([tiles[0], tiles[1]]);
    tiles[0].down = new Set<Tile>([tiles[0], tiles[1]]);
    tiles[0].left = new Set<Tile>([tiles[0], tiles[2]]);

    //StrightTile
    tiles[1].up = new Set<Tile>([tiles[1]]);
    tiles[1].right = new Set<Tile>([tiles[1], tiles[0]]);
    tiles[1].down = new Set<Tile>([tiles[1]]);
    tiles[1].left = new Set<Tile>([tiles[1], tiles[0]]);

    //StrightTile 90°
    tiles[2].up = new Set<Tile>([tiles[2], tiles[0]]);
    tiles[2].right = new Set<Tile>([tiles[2]]);
    tiles[2].down = new Set<Tile>([tiles[2], tiles[0]]);
    tiles[2].left = new Set<Tile>([tiles[2]]);





    document.body.addEventListener("click", () => {
        console.log("--WAVE Clicked--");
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

    function start(): void {
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

    function setup(): void {
        createCanvas();
        createFrames();
        createFrameElement();

        frames[0].options = [tiles[0]];
        //colapsTiles();
        checkFrameSides(2);
        draw();
    }

    function draw(): void {
        //drawFrame(TILE);
        for (let i: number = 0; i < frames.length; i++) {
            if (isColapse(frames[i])) {
                drawImage(i, frames[i].options[0].image!, frames[i].options[0].rotation!);
            }
            drawFrameOptions(i, frames[i].options.length);
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

            //element.innerText = i.toString();
            //element.style.color = "white";

            frameElements[i] = element;
            canvas.appendChild(element);
        }
    }
    function wafeFunction(): void {
        let colapsedFrames: number = 0;
        let toColapseFrames: Set<ColapseFrames> = new Set<ColapseFrames>();



        for (let i: number = 0; i < frames.length; i++) {
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
        for (let i: number = 0; i < frames.length; i++) {
            if (!isColapse(frames[i])) {


                toColapseFrames.add(new ColapseFrames(frames[i], i));
            }
        }

        if (logging) {
            console.log(toColapseFrames);
        }

        if (toColapseFrames.size > 1) {
            const randomMumber: number = Math.floor(Math.random() * toColapseFrames.size)
            if (logging) {
                console.log("This tile is selected:");
                console.log(Array.from(toColapseFrames)[randomMumber]);
            }
            frames[Array.from(toColapseFrames)[randomMumber].index].options = [tiles[Math.floor(Math.random() * tiles.length)]];

        } else if (toColapseFrames.size == 1) {
            frames[Array.from(toColapseFrames)[0].index].options = [tiles[Math.floor(Math.random() * tiles.length)]];
            if (logging) {
                console.log("This tile is selected:");
                console.log(Array.from(toColapseFrames)[0]);
            }
        } else if (toColapseFrames.size == 0) {
            console.warn("All possilbe Frames are colapsed");
            waveColapsed = true;
        }




    }
    function drawImage(index: number, image: string, rotation: number): void {
        frameElements[index].style.backgroundImage = "url(" + image + ")";
        frameElements[index].style.rotate = rotation * 90 + "deg";
    }
    function drawFrameOptions(index: number, options: number): void {
        frameElements[index].innerText = options.toString();
        frameElements[index].style.color = "white";
    }

    function isColapse(frame: Frame): boolean {
        return (frame.options.length == 1);
    }

    //TODO: check if optoins of Frames is compatible with tiles.
    function checkFrameSides(index: number): void {

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

    function setOptions(index: number, options: Tile[]): void {
        frames[index].options = options;
    }

    function compareAndSetOptions(a: Frame, b: Frame, direction: string): void {
        let aOpt: Set<Tile> = new Set<Tile>();
        let bOpt: Set<Tile> = new Set<Tile>();

        let result: Set<Tile> = new Set<Tile>();

        switch (direction) {
            case "top":
                aOpt  = new Set<Tile>();
                bOpt  = new Set<Tile>();

                a.options.forEach(opt => {
                    if (opt.down !== undefined) {
                        aOpt = new Set<Tile>([...aOpt, ...opt.down!]);
                    }
                });
                b.options.forEach(opt => {
                    if (opt.up !== undefined) {
                        bOpt = new Set<Tile>([...bOpt, ...opt.up!]);
                    }
                });


                for (let itmeA of aOpt) {          
                    for (let itemB of bOpt) {
                        if (JSON.stringify(itmeA) === JSON.stringify(itemB)) {
                            console.warn(itmeA);
                            console.warn(itemB);
                            result.add(itemB);
                        }
                        console.log("new loop");
                    }
                }
                if (logging) {
                    console.log("This are the options for the new frame");
                    console.log(result);
                }
                a.options = Array.from(result);


                break;

            case "right":
                aOpt  = new Set<Tile>();
                bOpt  = new Set<Tile>();
                console.error(a.options[0].right);
                console.error(a.options[1].right);

                // dUMM -> ich muss jede Option von A einzelnd Betrachten!!
                /*
                a.options.forEach(opt => {
                    if (opt.right !== undefined) {
                        aOpt = new Set<Tile>([...aOpt, ...opt.right!]);
                    }
                });
                b.options.forEach(opt => {
                    if (opt.left !== undefined) {
                        bOpt = new Set<Tile>([...bOpt, ...opt.left!]);
                    }
                });
                
                console.error(aOpt);
                

                for (let itmeA of aOpt) {
                    for (let itemB of bOpt) {
                        if (JSON.stringify(itmeA) === JSON.stringify(itemB)) {
                            console.warn(itmeA);
                            console.warn(itemB);
                            result.add(itemB);
                        }
                        console.log("new loop");
                    }
                }
                if (logging) {
                    console.log("This are the options for the new frame");
                    console.log(result);
                }
                */
                a.options = Array.from(result);

                break;
            case "left":
                aOpt  = new Set<Tile>();
                bOpt  = new Set<Tile>();

                a.options.forEach(opt => {
                    if (opt.left !== undefined) {
                        aOpt = new Set<Tile>([...aOpt, ...opt.left!]);
                    }
                });
                b.options.forEach(opt => {
                    if (opt.right !== undefined) {
                        bOpt = new Set<Tile>([...bOpt, ...opt.right!]);
                    }
                });

                for (let itmeA of aOpt) {
                    for (let itemB of bOpt) {
                        if (JSON.stringify(itmeA) === JSON.stringify(itemB)) {
                            result.add(itemB);
                        }
                    }
                }
                if (logging) {
                    console.log("This are the options for the new frame");
                    console.log(result);
                }
                a.options = Array.from(result);

                break;

            case "bottom":
                aOpt  = new Set<Tile>();
                bOpt  = new Set<Tile>();

                a.options.forEach(opt => {
                    if (opt.up !== undefined) {
                        aOpt = new Set<Tile>([...aOpt, ...opt.up!]);
                    }
                });
                b.options.forEach(opt => {
                    if (opt.down !== undefined) {
                        bOpt = new Set<Tile>([...bOpt, ...opt.down!]);
                    }
                });

                for (let itmeA of aOpt) {
                    for (let itemB of bOpt) {
                        if (JSON.stringify(itmeA) === JSON.stringify(itemB)) {
                            console.warn(itmeA);
                            console.warn(itemB);
                            result.add(itemB);
                        }
                        console.log("new loop");
                    }
                }
                if (logging) {
                    console.log("This are the options for the new frame");
                    console.log(result);
                }
                a.options = Array.from(result);

                break;
            default:
                console.warn("no direction to compare found");

                break;
        }
        if (logging) {
            console.log("----");
        }
    }

    function colapsTiles(): void {
        for (let index: number = 0; index < frames.length; index++) {
            if (!isColapse(frames[index])) {
                checkFrameSides(index);
            }
        }
        /*
        for (let index: number = frames.length-1; index >= 0; index--) {
            if (!isColapse(frames[index])) {
                checkFrameSides(index);
            }
        }
        */
    }
}
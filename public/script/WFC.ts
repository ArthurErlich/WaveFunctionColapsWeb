/**
 * @author Arthur Erlich <work@arhuterlich.de>
 *
 */

namespace WFC3 {
  let canvasDIM: number = 500;
  let frameCount: number = 10;
  const logging: boolean = false;

  //Canvas and Frames setup
  const canvas: HTMLElement = document.createElement("div");
  const frameElements: Frame[] = new Array(frameCount * frameCount);

  //----Utility Classes----\\
  class Frame extends HTMLElement {
    index: number;
    options: Tile[];
    constructor() {
      super();
      this.options = tiles;
      this.index = 0;
    }
  }
  customElements.define("custom-frame", Frame);

  class Tile {
    index: number;
    rotation: number;
    image: string;

    /* 
    Change to StyleCode: Convert color code of 3 Points to hash value eg.:
    010 for left:White, right:Wihte, middle,Black -> sha256(string)
    I can use this hash for comparisong later
    
    BTW: Hashing doese not realy exist in vanilla JS....
    */

    up: string = "";
    right: string = "";
    down: string = "";
    left: string = "";

    constructor(index: number, rotation: number, image: string) {
      this.index = index;
      this.rotation = rotation;
      this.image = image;
    }
  }

  enum Directions {
    TOP,
    LEFT,
    BOTTOM,
    RIGHT,
  }

  interface Config {
    tilesX: number;
    canvasDimPX: number;
    waitTime: number;
  }

  const tiles: Tile[] = [
    //BlankTile
    new Tile(0, 0, "../images/blank.png"),
    //StrightTile
    new Tile(1, 0, "../images/stright.png"),
    //StrightTile 90°
    new Tile(2, 1, "../images/stright.png"),
    //CornerTile right, down
    new Tile(3, 0, "../images/corner.png"),
    //CornerTile down, left
    new Tile(4, 1, "../images/corner.png"),
    //CornerTile  left, up
    new Tile(5, 2, "../images/corner.png"),
    //CornerTile up, right
    new Tile(6, 3, "../images/corner.png"),
  ];
  //Setting compatible options for Tiles Searching for better listing!

  //BlankTile
  tiles[0].up = "000";
  tiles[0].right = "000";
  tiles[0].down = "000";
  tiles[0].left = "000";

  //StrightTile |
  tiles[1].up = "010";
  tiles[1].right = "000";
  tiles[1].down = "010";
  tiles[1].left = "000";

  //StrightTile - 90°
  tiles[2].up = "000";
  tiles[2].right = "010";
  tiles[2].down = "000";
  tiles[2].left = "010";

  //CronerTile right, down
  tiles[3].up = "000";
  tiles[3].right = "010";
  tiles[3].down = "010";
  tiles[3].left = "000";

  //CronerTile down, left
  tiles[4].up = "000";
  tiles[4].right = "000";
  tiles[4].down = "010";
  tiles[4].left = "010";

  //CronerTile  left, up
  tiles[5].up = "010";
  tiles[5].right = "000";
  tiles[5].down = "000";
  tiles[5].left = "010";

  //CronerTile  up, right
  tiles[6].up = "010";
  tiles[6].right = "010";
  tiles[6].down = "000";
  tiles[6].left = "000";

  //----Start of Render----\\
  main();
  async function main (): Promise<void> {
    let config = await loadConfig("/script/config.json");
    frameCount = config.tilesX;
    canvasDIM = config.canvasDimPX;
    setup();
    initFrame();
    drawCanvas();
    //Calculate Entropy to other tiles
    let isNotColapsed: boolean = true;
    while (isNotColapsed) {
      calculateEntropy();
      drawCanvas();
      isNotColapsed = !waveFunction();
      if (config.waitTime > 0) {
        await Sleep(config.waitTime);
      }
    }
  }
  // document.body.addEventListener("click", (event) => {
  //   // console.clear();
  //   calculateEntropy();
  //   drawCanvas();
  // });

  function setup (): void {
    createCanvas();
    createFrameElement();
  }

  function initFrame (): void {
    let frame = frameElements[Math.round(Math.random() * (frameCount * frameCount))];
    frame.options = [tiles[0]];
  }

  function drawCanvas (): void {
    frameElements.forEach((element) => {
      if (logging) {
        element.innerText = element.options.length.toString();
      }
      if (isColapsed(element)) {
        drawImage(element);
      }
    });
  }

  function createCanvas (): void {
    canvas.setAttribute("id", "canvas");
    canvas.style.width = canvasDIM + "px";
    canvas.style.height = canvasDIM + "px";
    // canvas.style.border = "solid 1px black";
    canvas.style.display = "flex";
    canvas.style.flexWrap = "wrap";
    document.body.appendChild(canvas);
  }

  function createFrameElement (): void {
    let i: number = 0;
    for (let y: number = 0; y < frameCount; y++) {
      for (let x: number = 0; x < frameCount; x++) {
        const element: Frame = document.createElement("custom-frame") as Frame;
        const frameSize: number = canvasDIM / frameCount;

        element.index = i;

        element.setAttribute("id", "frame");
        element.dataset.index = i.toString();
        element.dataset.x = x.toString();
        element.dataset.y = y.toString();
        element.dataset.colapsed = "false";

        element.style.width = frameSize + "px";
        element.style.height = frameSize + "px";
        element.style.backgroundSize = "cover";
        // element.style.border = "1px solid white";
        element.style.color = "red";
        element.style.display = "flex";
        element.style.justifyContent = "center";
        element.style.alignItems = "center";
        element.style.backgroundColor = "black";

        frameElements[i] = element;
        canvas.appendChild(element);
        i++;
        if (logging) {
          element.addEventListener("mousedown", (event) => {
            element.classList.add("selected");

            let target: Frame = event.target as Frame;
            console.log("Selection", target, " Tiles Frame has those Options", target.options);
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
  }

  function isColapsed (frame: Frame): boolean {
    if (frame.options.length == 1) {
      frame.dataset.colapsed = "true";
      return true;
    }
    return false;
  }

  function drawImage (frame: Frame): void {
    //get the iomage form the ony possible tile.
    frame.style.backgroundImage = "URL(" + frame.options[0].image + ")";
    frame.style.transform = "rotate(" + frame.options[0].rotation * 90 + "deg )";
  }

  function waveFunction (): boolean {
    //List of Frames with least entropy to be colapsed
    let notColapseFrames: Set<Frame> = new Set<Frame>();
    let toColapseFrames: Array<Frame> = [];
    let leastEntropy = tiles.length; //start with maximum
    //Check every Frame if one is colapsed
    let colapsedFrames: number = 0;
    for (let i = 0; i < frameElements.length; i++) {
      if (isColapsed(frameElements[i])) {
        colapsedFrames++;
        continue;
      } else {
        notColapseFrames.add(frameElements[i]);
      }
    }

    //find least entropy
    notColapseFrames.forEach((frame) => {
      if (frame.options.length < leastEntropy) {
        leastEntropy = frame.options.length;
      }
    });

    //chose frame with more then least entropy
    notColapseFrames.forEach((frame) => {
      if (frame.options.length == leastEntropy) {
        toColapseFrames.push(frame);
      }
    });

    if (toColapseFrames.length == 0) {
      return true;
    }
    if (toColapseFrames.length == 1) {
      setRendomFrameOption(toColapseFrames[0]);
    } else {
      let selectedFrame: Frame = toColapseFrames[Math.round(Math.random() * (toColapseFrames.length - 1))];
      setRendomFrameOption(selectedFrame);
    }
    return colapsedFrames == frameElements.length;
  }

  function calculateEntropy (): void {
    //Stort from left to right, keep treack of changed tiles and rerun if tiles changed.
    let updatedTiles: number = 0;
    do {
      // updatedTiles = 0;
      for (let i = 0; i < frameElements.length; i++) {
        //Check sides top left bottom right remove entoryp/options of own tile if not compatible
        const frame = frameElements[i];

        if (checkFrame(frame, Directions.TOP)) {
          updatedTiles++;
        }
        if (checkFrame(frame, Directions.RIGHT)) {
          updatedTiles++;
        }
        if (checkFrame(frame, Directions.BOTTOM)) {
          updatedTiles++;
        }
        if (checkFrame(frame, Directions.LEFT)) {
          updatedTiles++;
        }
      }
      updatedTiles--;
    } while (updatedTiles > 0);
  }
  function checkFrame (frame: Frame, direction: Directions): boolean {
    let neighbor: Frame;
    let neighborIndex;
    let isChanged = false;
    let possibleOptions: Tile[];
    if (frame.options.length == 1) {
      return isChanged;
    }

    //Check Frame direktion if a Frame exist
    switch (direction) {
      case Directions.TOP:
        neighborIndex = frame.index - frameCount;
        if (!(neighborIndex > 0)) {
          return isChanged;
        }
        break;
      case Directions.RIGHT:
        neighborIndex = frame.index + 1;
        if (!(neighborIndex % frameCount !== 0)) {
          return isChanged;
        }
        break;
      case Directions.BOTTOM:
        neighborIndex = frame.index + frameCount;
        if (!(frame.index < frameCount * frameCount - frameCount)) {
          return isChanged;
        }
        break;
      case Directions.LEFT:
        neighborIndex = frame.index - 1;
        if (!(frame.index % frameCount !== 0)) {
          return isChanged;
        }
        break;

      default:
        return isChanged;
    }
    neighbor = frameElements[neighborIndex];

    if (neighbor.options.length == frame.options.length) {
      return isChanged;
    }
    possibleOptions = compareAndGetOptions(frame, neighbor, direction);

    if (possibleOptions.length !== frame.options.length) {
      isChanged = true;
    }

    frame.options = possibleOptions;

    return isChanged;
  }

  function compareAndGetOptions (frame: Frame, neighbor: Frame, direction: Directions): Tile[] {
    let possibleOptions: Tile[] = new Array();
    //Compare the sides with allowd option
    //go through all Options and compare the Sets

    if (logging) {
      console.log("Comparing Frame:", frame, " Neighbor: ", neighbor, " Looking: ", Directions[direction]);
      console.log("Frame has: ", frame.options.length, "Options. Neighbot has: ", neighbor.options.length, "Options.");
    }

    if (frame.options.length < neighbor.options.length) {
      if (logging) {
        console.log("I am smaller, skipping check");
      }
      return frame.options;
    }
    if (frame.options.length < 0 || neighbor.options.length < 0) {
      if (logging) {
        console.warn("There was a problem! \n one of the check has only 0 Frames!? Something went realy wrong");
      }
    }

    switch (direction) {
      case Directions.TOP:
        frame.options.forEach((frameOptions) => {
          neighbor.options.forEach((neighborOptions) => {
            const aOptions = frameOptions.up;
            const bOptions = neighborOptions.down;

            if (logging) {
              console.log("Compatible Tiles: ", " A: ", aOptions, " B: ", bOptions);
            }
            if (!(bOptions == undefined || aOptions == undefined)) {
              const foundOptions: Tile[] = compareFrameOptions(aOptions, bOptions, frameOptions);
              addElementIfNotExist(foundOptions, possibleOptions);
              if (logging) {
                console.log("Possilbe Options: ", possibleOptions);
              }
            }
          });
        });
        break;

      case Directions.BOTTOM:
        frame.options.forEach((frameOptions) => {
          neighbor.options.forEach((neighborOptions) => {
            const aOptions = frameOptions.down;
            const bOptions = neighborOptions.up;

            if (logging) {
              console.log("Compatible Tiles: ", " A: ", aOptions, " B: ", bOptions);
            }
            if (!(bOptions == undefined || aOptions == undefined)) {
              const foundOptions: Tile[] = compareFrameOptions(aOptions, bOptions, frameOptions);
              addElementIfNotExist(foundOptions, possibleOptions);
              if (logging) {
                console.log("Possilbe Options: ", possibleOptions);
              }
            }
          });
        });
        break;
      case Directions.LEFT:
        frame.options.forEach((frameOptions) => {
          neighbor.options.forEach((neighborOptions) => {
            const aOptions = frameOptions.left;
            const bOptions = neighborOptions.right;

            if (logging) {
              console.log("Compatible Tiles: ", " A: ", aOptions, " B: ", bOptions);
            }
            if (!(bOptions == undefined || aOptions == undefined)) {
              const foundOptions: Tile[] = compareFrameOptions(aOptions, bOptions, frameOptions);
              addElementIfNotExist(foundOptions, possibleOptions);
              if (logging) {
                console.log("Possilbe Options: ", possibleOptions);
              }
            }
          });
        });
        break;
      case Directions.RIGHT:
        frame.options.forEach((frameOptions) => {
          neighbor.options.forEach((neighborOptions) => {
            const aOptions = frameOptions.right;
            const bOptions = neighborOptions.left;

            if (logging) {
              console.log("Compatible Tiles: ", " A: ", aOptions, " B: ", bOptions);
            }
            if (!(bOptions == undefined || aOptions == undefined)) {
              const foundOptions: Tile[] = compareFrameOptions(aOptions, bOptions, frameOptions);
              addElementIfNotExist(foundOptions, possibleOptions);
              if (logging) {
                console.log("Possilbe Options: ", possibleOptions);
              }
            }
          });
        });
        break;
      default:
        possibleOptions = frame.options;
        break;
    }
    if (possibleOptions.length > frame.options.length) {
      return frame.options;
    }
    if (possibleOptions.length < 0) {
      console.warn("Hey! I want to set 0 Options! Check me please!");
    }
    return possibleOptions;
  }

  function compareFrameOptions (a: string, b: string, tile: Tile): Tile[] {
    let possibleOptions: Tile[] = new Array();
    if (a === b) {
      if (logging) {
        console.log("Found a Compatible Tile. Adding to List: ", b);
      }
      possibleOptions.push(tile); //TODOO: Add Tile of Options
    }
    return possibleOptions;
  }

  function addElementIfNotExist (option: Tile[], possibleOptions: Tile[]) {
    option.forEach((element) => {
      let found: Tile | undefined = possibleOptions.find((obj) => obj.index === element.index);
      //add element to options only if its not exist
      if (found === undefined) {
        possibleOptions.push(element);
      }
    });
  }
  async function loadConfig (url: string): Promise<Config> {
    let promise;
    promise = await fetch(url);
    return promise.json();
  }

  function setRendomFrameOption (frame: Frame): void {
    frame.options = [frame.options[Math.round(Math.random() * (frame.options.length - 1))]];
  }
}
async function Sleep (milliseconds: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

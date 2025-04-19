namespace WFC2 {
  const logging: boolean = false;

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

    constructor(index: number, rotation: number, image: string, up?: Set<Tile>, right?: Set<Tile>, down?: Set<Tile>, left?: Set<Tile>) {
      this.index = index;
      this.rotation = rotation;
      this.image = image;
      this.up = up;
      this.right = right;
      this.down = down;
      this.left = left;
    }
    public map(): string {
      return this.index.toString() + this.rotation + this.image;
    }
  }

  const canvasDIM: number = 800;
  const frameCount: number = 10;
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
    //CronerTile right, down
    new Tile(3, 0, "../images/corner.png"),
  ];

  let waveColapsed: boolean = false;

  //setting compatible options for Tiles Searching for better listing!
  //BlankTile
  tiles[0].up = new Set<Tile>([tiles[0], tiles[2]]);
  tiles[0].right = new Set<Tile>([tiles[0], tiles[1]]);
  tiles[0].down = new Set<Tile>([tiles[0], tiles[2]]);
  tiles[0].left = new Set<Tile>([tiles[0], tiles[1]]);

  //StrightTile |
  tiles[1].up = new Set<Tile>([tiles[1], tiles[3]]);
  tiles[1].right = new Set<Tile>([tiles[1], tiles[0]]);
  tiles[1].down = new Set<Tile>([tiles[1]]);
  tiles[1].left = new Set<Tile>([tiles[1], tiles[0]]);

  //StrightTile - 90°
  tiles[2].up = new Set<Tile>([tiles[2], tiles[0]]);
  tiles[2].right = new Set<Tile>([tiles[2]]);
  tiles[2].down = new Set<Tile>([tiles[2], tiles[0]]);
  tiles[2].left = new Set<Tile>([tiles[2], tiles[3]]);

  //CronerTile right, down

  tiles[3].up = new Set<Tile>([tiles[0], tiles[1]]);
  tiles[3].right = new Set<Tile>([tiles[2]]);
  tiles[3].down = new Set<Tile>([tiles[1]]);
  tiles[3].left = new Set<Tile>([tiles[0], tiles[2]]);

  let pause: boolean = true;

  document.body.addEventListener("click", () => {
    console.log("--WAVE Clicked--");
    // checkFrameSides(1);
    // checkFrameSides(6);
    if (waveColapsed) {
      // location.reload();
    } else {
      start();
    }
    console.log("--WAVE END--");
  });

  setup();
  draw();
  start();
  draw();

  //test stuff
  if (logging) {
    console.log("all Frames:");
    console.log(frames);
    console.log("----");
  }

  async function start(): Promise<void> {
    do {
      console.log("--WAVE START--");
      draw();
      wafeFunction();
      //console.log(frames);
      console.log("--WAVE END--");
      await Sleep(3000);
    } while (!waveColapsed); // !waveColapsed
  }

  function setup(): void {
    createCanvas();
    createFrames();
    createFrameElement();

    let randomTileID = Math.floor(Math.random() * tiles.length);
    let randomOptionID = Math.floor(Math.random() * frames[randomTileID].options.length);
    frames[randomTileID].options = [frames[randomTileID].options[randomOptionID]];

    //colapsTiles();
    draw();
  }

  function draw(): void {
    //drawFrame(TILE);
    for (let i: number = 0; i < frames.length; i++) {
      if (isColapse(frames[i])) {
        try {
          drawImage(i, frames[i].options[0].image!, frames[i].options[0].rotation!);
        } catch (error) {
          console.error(error);
          stop();
          //   location.reload();
        }
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
    document.body.appendChild(canvas);
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
    let toColapseFrames: Set<number> = new Set<number>();

    for (let i: number = 0; i < frames.length; i++) {
      if (isColapse(frames[i])) {
        colapsedFrames++;
      }
    }
    //check if all frames are colapsed
    if (colapsedFrames == frameCount * frameCount) {
      waveColapsed = true;
      console.warn("All Frames are colapsed");
      //location.reload();
    }
    // check if one Frame has zero option
    frames.forEach((frame) => {
      if (frame.options.length === 0) {
        waveColapsed = true;
        console.error("Frame has no options");
        draw();
        //location.reload();
      }
    });

    //start to get tile wiht last entorpy / options
    let minOpt = tiles.length + 1;
    for (let i: number = 0; i < frames.length; i++) {
      if (!isColapse(frames[i])) {
        if (minOpt > frames[i].options.length) {
          minOpt = frames[i].options.length;
        }
      }
    }
    for (let i: number = 0; i < frames.length; i++) {
      if (!isColapse(frames[i]) && frames[i].options.length == minOpt) {
        toColapseFrames.add(i);
      }
    }

    if (logging) {
      console.log(toColapseFrames);
    }

    if (toColapseFrames.size > 1) {
      //randomly select one of the tiles
      const randomFrameID: number = Array.from(toColapseFrames)[Math.floor(Math.random() * toColapseFrames.size)];
      checkFrameSidesCW(randomFrameID);
      checkFrameSidesCCW(randomFrameID);

      colapsTiles();
      let selectedFrame: Frame = frames[randomFrameID];
      let randomOptionID: number = Math.floor(Math.random() * selectedFrame.options.length);
      let randomOption: Tile = selectedFrame.options[randomOptionID];

      if (logging) {
        console.log("This tile is selected:");
        console.log(selectedFrame);
        console.log(randomFrameID);
        console.log("This tile has this options:");
        console.log(randomOption);
        console.log(randomOptionID);
      }
      //set the frame options to the selected tile
      frames[randomFrameID].options = new Array(randomOption);
    } else if (toColapseFrames.size == 1) {
      const frameID: number = Array.from(toColapseFrames)[0];
      checkFrameSidesCW(frameID);
      checkFrameSidesCW(frameID);

      colapsTiles();
      let selectedFrame: Frame = frames[frameID];
      let randomOption: Tile = selectedFrame.options[Math.floor(Math.random() * selectedFrame.options.length)];

      if (logging) {
        console.log("This tile is selected:");
        console.log(selectedFrame);
        console.log("This tile has this options:");
        console.log(randomOption);
      }
      frames[frameID].options = new Array(randomOption);
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
    return frame.options.length == 1;
  }

  //TODO: check if optoins of Frames is compatible with tiles.
  function checkTopFrame(index: number): void {
    if (logging) {
      console.log("compare frames around: " + index);
      console.log(frames[index]);
    }

    if (index >= frameCount) {
      //top side
      if (logging) {
        console.log("----");
        console.log("top side");
        console.log(frames[index - frameCount].options);
      }

      frames[index], frames[index - frameCount], "top";
      compareAndSetOptions(frames[index], frames[index - frameCount], "top");
      checkTopFrame(index - frameCount);
    }
  }

  function checkLeftFrame(index: number): void {
    if (index % frameCount !== 0) {
      //left side

      if (logging) {
        console.log("----");
        console.log("left side");
        console.log(frames[index - 1].options);
      }
      compareAndSetOptions(frames[index], frames[index - 1], "left");
      checkLeftFrame(index - 1);
    }
  }
  function checkRightFrame(index: number): void {
    if ((index + 1) % frameCount !== 0) {
      //right side
      if (logging) {
        console.log("----");
        console.log("right side");
        console.log(frames[index + 1].options);
      }
      compareAndSetOptions(frames[index], frames[index + 1], "right");
      checkRightFrame(index + 1);
    }
  }
  function checkBottomFrame(index: number): void {
    if (index < frameCount * (frameCount - 1)) {
      //bottom side
      if (logging) {
        console.log("----");
        console.log("bottom side");
        console.log(frames[index + frameCount].options);
      }
      compareAndSetOptions(frames[index], frames[index + frameCount], "bottom");
      checkBottomFrame(index + frameCount);
    }
  }

  function checkFrameSidesCW(index: number): void {
    checkTopFrame(index);
    checkRightFrame(index);
    checkBottomFrame(index);
    checkLeftFrame(index);
  }
  function checkFrameSidesCCW(index: number): void {
    checkTopFrame(index);
    checkLeftFrame(index);
    checkBottomFrame(index);
    checkRightFrame(index);
  }

  function setOptions(index: number, options: Tile[]): void {
    frames[index].options = options;
  }

  //--------------------compare and set options--------------------------------
  function compareAndSetOptions(a: Frame, b: Frame, direction: string): void {
    let aOpt: Set<Tile> = new Set<Tile>();
    switch (direction) {
      case "top":
        if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
          //console.log("bottom side is equal ro top side");
          return;
        }

        for (let indexA: number = 0; indexA < a.options.length; indexA++) {
          for (let optA: number = 0; optA < a.options[indexA].up?.size!; optA++) {
            for (let indexB: number = 0; indexB < b.options.length; indexB++) {
              for (let optB: number = 0; optB < b.options[indexB].down?.size!; optB++) {
                if (JSON.stringify(Array.from(a.options[indexA].up!)[optA]) === JSON.stringify(Array.from(b.options[indexB].up!)[optB])) {
                  aOpt.add(a.options[indexA]);
                }
              }
            }
          }
        }
        a.options = Array.from(aOpt).filter((item) => item !== undefined);

        break;

      case "right":
        if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
          // console.log("bottom side is equal ro top side");

          return;
        }

        for (let indexA: number = 0; indexA < a.options.length; indexA++) {
          for (let optA: number = 0; optA < a.options[indexA].right?.size!; optA++) {
            for (let indexB: number = 0; indexB < b.options.length; indexB++) {
              for (let optB: number = 0; optB < b.options[indexB].left?.size!; optB++) {
                if (JSON.stringify(Array.from(a.options[indexA].right!)[optA]) === JSON.stringify(Array.from(b.options[indexB].left!)[optB])) {
                  aOpt.add(a.options[indexA]);
                }
              }
            }
          }
        }
        a.options = Array.from(aOpt).filter((item) => item !== undefined);

        break;
      case "bottom":
        if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
          // console.log("bottom side is equal ro top side");

          return;
        }

        for (let indexA: number = 0; indexA < a.options.length; indexA++) {
          for (let optA: number = 0; optA < a.options[indexA].down?.size!; optA++) {
            for (let indexB: number = 0; indexB < b.options.length; indexB++) {
              for (let optB: number = 0; optB < b.options[indexB].up?.size!; optB++) {
                if (JSON.stringify(Array.from(a.options[indexA].down!)[optA]) === JSON.stringify(Array.from(b.options[indexB].up!)[optB])) {
                  aOpt.add(a.options[indexA]);
                }
              }
            }
          }
        }
        a.options = Array.from(aOpt).filter((item) => item !== undefined);

        break;
      case "left":
        if (JSON.stringify(a.options) == JSON.stringify(b.options)) {
          // console.log("bottom side is equal ro top side");

          return;
        }

        for (let indexA: number = 0; indexA < a.options.length; indexA++) {
          for (let optA: number = 0; optA < a.options[indexA].left?.size!; optA++) {
            for (let indexB: number = 0; indexB < b.options.length; indexB++) {
              for (let optB: number = 0; optB < b.options[indexB].right?.size!; optB++) {
                if (JSON.stringify(Array.from(a.options[indexA].left!)[optA]) === JSON.stringify(Array.from(b.options[indexB].right!)[optB])) {
                  aOpt.add(a.options[indexA]);
                }
              }
            }
          }
        }
        a.options = Array.from(aOpt).filter((item) => item !== undefined);
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
        checkFrameSidesCW(index);
      }
    }

    for (let index: number = frames.length - 1; index > 0; index--) {
      if (!isColapse(frames[index])) {
        checkFrameSidesCCW(index);
      }
    }
  }
}

function Sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

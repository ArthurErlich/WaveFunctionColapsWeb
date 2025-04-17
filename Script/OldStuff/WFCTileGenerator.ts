namespace WFC2TileGen {
    const folderURL: string = "../images";

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


    getImages();
    function getImages():string[]{
        
         folderURL + "/blank.png";
         folderURL + "/corner.png";
         folderURL + "/stright.png";

        return[""];
    }

}
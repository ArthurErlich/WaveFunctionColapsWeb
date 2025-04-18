"use strict";
var WFC2TileGen;
(function (WFC2TileGen) {
    const folderURL = "../images";
    class Tile {
        constructor(index, rotation, image, up, right, down, left) {
            this.index = index;
            this.rotation = rotation;
            this.image = image;
            this.up = up;
            this.right = right;
            this.down = down;
            this.left = left;
        }
        map() {
            return (this.index.toString() + this.rotation + this.image);
        }
    }
    getImages();
    function getImages() {
        folderURL + "/blank.png";
        folderURL + "/corner.png";
        folderURL + "/stright.png";
        return [""];
    }
})(WFC2TileGen || (WFC2TileGen = {}));
//# sourceMappingURL=WFCTileGenerator.js.map
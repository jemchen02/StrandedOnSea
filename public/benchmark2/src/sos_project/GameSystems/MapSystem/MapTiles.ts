export default class MapTiles {
    private mapArray: Array<Array<MapTile>>;
    constructor(initArray: Array<Array<number>>) {
        this.mapArray = [];
        for (let i = 0; i < initArray.length; i++) {
            this.mapArray[i] = [];
            for (let j = 0; j < initArray[i].length; j++) {
                this.mapArray[i][j] = new MapTile(initArray[i][j], false);
            }
        }
    }
    getMapTileRowCol(row: number, col: number) {
        return this.mapArray[row][col].tileType;
    }
}
class MapTile {
    public tileType: number;
    public isVisible: boolean;
    constructor(tileType: number, isVisible: boolean) {
        this.tileType = tileType;
        this.isVisible = isVisible;
    }
}
import Vec2 from "../Wolfie2D/DataTypes/Vec2";

export class SOSLevel{
    public iconType : number; //TODO make class better. This is just for testing!

    constructor(){
        this.iconType = 0;
    }
}

export class OverlayStatus{
    public isStorm : boolean;
    public isFog : boolean;
    public isLand : boolean;

    constructor(storm: boolean = false, fog: boolean = false, land: boolean = false){
        this.isStorm = storm;
        this.isFog = fog;
        this.isLand = land;
    }
}
export class SavedStats{
    public money: number;
    public health: number;
    public mines: number;
    public torpedos: number;
    public repairs: number;
    public location: Vec2;
    public mapOverlays: OverlayStatus[][];
    constructor(money: number, health: number, mines: number, torpedos: number, repairs: number, location: Vec2, overlays: OverlayStatus[][]) {
        this.money = money;
        this.health = health;
        this.mines = mines;
        this.torpedos = torpedos;
        this.repairs = repairs;
        this.location = location;
        this.mapOverlays = overlays;
    }
}
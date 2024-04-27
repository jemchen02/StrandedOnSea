import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import { OverlayStatus, SOSLevel, SavedStats } from "./SOSLevel";
import { Costs } from "./GameConstants";
import Emitter from "../Wolfie2D/Events/Emitter";

export class GameStateManager {
    private static instance: GameStateManager;
    public static get(): GameStateManager {
      if (GameStateManager.instance){
        return GameStateManager.instance;
      }

      else {
        GameStateManager.instance = new GameStateManager();
        return GameStateManager.instance;
      }
    }

    public money : number;
    public health : number;
    public maxHealth : number;

    public numRepairs : number;

    public numMine : number;
    public numTorpedo : number;

    public hasCrowsNest : boolean;
    public hasRadar : boolean;
    public hasPump : boolean;

    public ownedShips: ShipType[];
    public shipType : ShipType;
    public ownedMovements: MovementType[];
    public movementType : MovementType;

    public playerLocation : Vec2;

    public gameMap: SOSLevel[][]; 
    public mapOverlays: OverlayStatus[][];

    public isPaused: boolean;
    private stormCanMove: boolean;

    public prevWon: boolean;

    private saved: SavedStats;

    protected emitter: Emitter;

    // We define starting amounts here.
    constructor(){
        this.money = 400;
        this.health = 100;
        this.maxHealth = 100;
        this.numRepairs = 1;
        this.numMine = 2;
        this.numTorpedo = 2;
        this.hasCrowsNest = false;
        this.hasRadar = false;
        this.hasPump = false;
        this.ownedShips = [ShipType.WOOD];
        this.shipType = ShipType.WOOD;
        this.ownedMovements = [MovementType.OAR];
        this.movementType = MovementType.OAR;
        this.isPaused = false;
        this.stormCanMove = false;
        this.prevWon = true;

        this.emitter = new Emitter();

        this.playerLocation = new Vec2(-1, 0); //Has to be 1 away for movePlayer to work right.

        
        this.gameMap = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new SOSLevel())
        );

        this.mapOverlays = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new OverlayStatus())
        );
        this.buildMap();
        this.movePlayer(new Vec2(0, 0));
        this.saved = new SavedStats(0, 0,0,0,0, this.playerLocation, this.mapOverlays);
    }
    
    public togglePause() {
        this.isPaused = !this.isPaused;
    }
    //TODO REALLY BAD HACK THIS SHOULD BE CHANGED
    private buildMap() : void{
        //THIS IS THE MAP
        const mapInit = [
            [4, 2, 3, 5, 3],
            [1, 3, 2, 1, 5],
            [5, 1, 5, 3, 1],
            [2, 1, 3, 2, 5],
            [3, 5, 5, 3, 4]
        ];
        const n = mapInit.length;
        const m = mapInit[0].length;

        const overlayInit = [
            [3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3]
        ];

        for(let i = 0; i < this.mapOverlays.length; i++){
            for(let j = 0; j < this.mapOverlays.length; j++){
                if(overlayInit[i][j] == 2){
                    this.mapOverlays[i][j].isStorm = true;
                }
                if(overlayInit[i][j] == 3){
                    this.mapOverlays[i][j].isFog = true;
                }
            }
        }

        for(let i = 0; i < this.gameMap.length; i++){
            for(let j = 0; j < this.gameMap.length; j++){
                this.gameMap[i][j].iconType = mapInit[i][j];
            }
        }
    }
    public onLand(): boolean {
        return this.gameMap[this.playerLocation.x][this.playerLocation.y].iconType == 4;
    }
    private isInBounds(location : Vec2): boolean {
        return location.x >= 0 && location.x < this.mapOverlays.length && location.y >= 0 && location.y < this.mapOverlays[location.x].length;
    }
    public movePlayer(location : Vec2) : boolean {
        let self = this; //bit of a hack but works to get around scoping

        let normalDirections : Vec2[] = [new Vec2(1, 0), new Vec2(-1, 0), new Vec2(0, 1), new Vec2(0, -1)];
        

        let includes : boolean = false;
        for(let i = 0; i < normalDirections.length; i++){
            if(normalDirections[i].equals(location.clone().sub(this.playerLocation))){
                includes = true;
                break
            }
        }

        if(!includes) return false;
        if(!this.isInBounds(location)) return false;
      
        if(this.mapOverlays[location.x][location.y].isStorm) return false;
      
        this.saved = new SavedStats(this.money, this.health, this.numMine, this.numTorpedo, this.numRepairs, this.playerLocation, this.mapOverlays.map(innerMap => innerMap.slice().map(tile => new OverlayStatus(tile.isStorm, tile.isFog, tile.isLand))));

        //Removes fog in adjacent tiles
        //TODO account for crows nest and radar...
        if(this.hasCrowsNest) {
            for(let i = 0; i < crowDirections.length; i++){
                if(this.isInBounds(location.clone().add(crowDirections[i]))){
                    this.mapOverlays[location.x + crowDirections[i].x][location.y + crowDirections[i].y].isFog = false;
                }
            }
        } else {
            for(let i = 0; i < normalDirections.length; i++){
                if(this.isInBounds(location.clone().add(normalDirections[i]))){
                    this.mapOverlays[location.x + normalDirections[i].x][location.y + normalDirections[i].y].isFog = false;
                }
            }
        }
        
        const n = this.gameMap.length;
        if(this.stormCanMove) {
            let p1 = 0;
            let p2 = 0;
            let psum = 0;
            while(p2 < n) {
                psum = p1 + p2;
                if(!this.mapOverlays[p1][p2].isStorm) break;
                p1 > p2 ? p2++ : p1++;
            }
            for(let i = 0; i < n; i++) {
                for(let j = 0; j < n; j++) {
                    if(i + j == psum) {
                        this.mapOverlays[i][j].isStorm = true;
                    }
                }
            }
            this.stormCanMove = false;
        } else {
            this.stormCanMove = true;
        }
        this.playerLocation = location;

        return true;
    }
    public buyMine() : boolean {
        if(this.money >= Costs.MINE_COST) {
            this.money -= Costs.MINE_COST;
            this.numMine += 5;
            return true;
        }
        return false;
    }
    public buyTorpedo() : boolean {
        if(this.money >= Costs.TORPEDO_COST) {
            this.money -= Costs.TORPEDO_COST;
            this.numTorpedo += 5;
            return true;
        }
        return false;
    }
    public buyRepair() : boolean {
        if(this.money >= Costs.REPAIR_COST) {
            this.money -= Costs.REPAIR_COST;
            this.numRepairs += 2;
            return true;
        }
        return false;
    }
    public buyWood() : boolean {
        if(this.ownedShips.includes(ShipType.WOOD)) {
            return true;
        }
        if(this.money >= Costs.WOOD_COST) {
            this.money -= Costs.WOOD_COST;
            this.shipType = ShipType.WOOD;
            this.ownedShips.push(ShipType.WOOD);
            return true;
        }
        return false;
    }
    public buyFiber() : boolean {
        if(this.ownedShips.includes(ShipType.FIBERGLASS)) {
            return true;
        }
        if(this.money >= Costs.FIBER_COST) {
            this.money -= Costs.FIBER_COST;
            this.shipType = ShipType.FIBERGLASS;
            this.ownedShips.push(ShipType.FIBERGLASS);
            return true;
        }
        return false;
    }
    public buyMetal() : boolean {
        if(this.ownedShips.includes(ShipType.METAL)) {
            return true;
        }
        if(this.money >= Costs.METAL_COST) {
            this.money -= Costs.METAL_COST;
            this.shipType = ShipType.METAL;
            this.ownedShips.push(ShipType.METAL);
            return true;
        }
        return false;
    }
    public buyOar() : boolean {
        if(this.ownedMovements.includes(MovementType.OAR)) {
            return true;
        }
        if(this.money >= Costs.OAR_COST) {
            this.money -= Costs.OAR_COST;
            this.movementType = MovementType.OAR;
            this.ownedMovements.push(MovementType.OAR);
            return true;
        }
        return false;
    }
    public hasSail(): boolean {
        return this.ownedMovements.includes(MovementType.SAIL)
    }
    public buySail() : boolean {
        if(this.hasSail()) {
            return true;
        }
        if(this.money >= Costs.SAIL_COST) {
            this.money -= Costs.SAIL_COST;
            this.movementType = MovementType.SAIL;
            this.ownedMovements.push(MovementType.SAIL);
            return true;
        }
        return false;
    }
    public buyMotor() : boolean {
        if(this.ownedMovements.includes(MovementType.MOTOR)) {
            return true;
        }
        if(this.money >= Costs.MOTOR_COST) {
            this.money -= Costs.MOTOR_COST;
            this.movementType = MovementType.MOTOR;
            this.ownedMovements.push(MovementType.MOTOR);
            return true;
        }
        return false;
    }
    public buyPump() : boolean {
        if(this.hasPump) {
            return true;
        }
        if(this.money >= Costs.PUMP_COST) {
            this.money -= Costs.PUMP_COST;
            this.hasPump = true;
            return true;
        }
        return false;
    }
    public buyCrow() : boolean {
        if(this.hasCrowsNest) {
            return true;
        }
        if(this.money >= Costs.CROW_COST) {
            this.money -= Costs.CROW_COST;
            this.hasCrowsNest = true;
            for(let i = 0; i < crowDirections.length; i++){
                if(this.isInBounds(new Vec2(this.playerLocation.x + crowDirections[i].x, this.playerLocation.y + crowDirections[i].y))){
                    this.mapOverlays[this.playerLocation.x + crowDirections[i].x][this.playerLocation.y + crowDirections[i].y].isFog = false;
                }
            }
            return true;
        }
        return false;
    }
    public buyRadar() : boolean {
        if(this.hasRadar) {
            return true;
        }
        if(this.money >= Costs.RADAR_COST) {
            this.money -= Costs.RADAR_COST;
            this.hasRadar = true;
            for(let i = 0 ; i < this.mapOverlays.length; i++) {
                for(let j = 0; j < this.mapOverlays[0].length; j++) {
                    this.mapOverlays[i][j].isFog = false;
                }
            }
            return true;
        }
        return false;
    }

    public restoreSaved(): void{
        this.money = this.saved.money;
        this.health = this.saved.health;
        this.numMine = this.saved.mines;
        this.numTorpedo = this.saved.torpedos;
        this.numRepairs = this.saved.repairs;
        this.playerLocation = this.saved.location;
        this.mapOverlays = this.saved.mapOverlays;
    }

    public generateLoot(rarity: number) {
        this.money += Math.floor(rarity*10*Math.random())+10;
        this.numMine += Math.floor(1.5*rarity * Math.random());
        this.numTorpedo += Math.floor(1.2 * rarity*Math.random());
    }

    public setHealth(newHealth : number){
        if(newHealth < 0){
            this.health = 0;
            this.emitter.fireEvent("gameLoss");
            //TODO add death
        }

        else if(newHealth > this.maxHealth){
            this.health = this.maxHealth;
        }

        else{
            this.health = newHealth;
        }
    }
}

export enum ShipType {
    WOOD,
    METAL,
    FIBERGLASS
}

export enum MovementType {
    OAR,
    SAIL,
    MOTOR
}
const crowDirections = [new Vec2(1, 0), new Vec2(-1, 0), new Vec2(0, 1), new Vec2(0, -1), new Vec2(2, 0), new Vec2(-2, 0), new Vec2(0, 2), new Vec2(0, -2), new Vec2(1, 1), new Vec2(-1, 1), new Vec2(1, -1), new Vec2(-1, -1)];
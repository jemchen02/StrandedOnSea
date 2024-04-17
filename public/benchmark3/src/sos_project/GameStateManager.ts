import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import { OverlayStatus, SOSLevel } from "./SOSLevel";
import { Costs } from "./GameConstants";

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

    public numCannon : number;
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

    // We define starting amounts here.
    constructor(){
        this.money = 800;
        this.health = 100;
        this.maxHealth = 100;
        this.numRepairs = 0;
        this.numCannon = 0;
        this.numTorpedo = 0;
        this.hasCrowsNest = false;
        this.hasRadar = false;
        this.hasPump = false;
        this.ownedShips = [ShipType.WOOD];
        this.shipType = ShipType.WOOD;
        this.ownedMovements = [MovementType.OAR];
        this.movementType = MovementType.OAR;
        this.isPaused = false;
        this.stormCanMove = false;

        this.playerLocation = new Vec2(-1, 0); //Has to be 1 away for movePlayer to work right.
        
        this.gameMap = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new SOSLevel())
        );

        this.mapOverlays = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new OverlayStatus())
        );

        this.buildMap();
        this.movePlayer(new Vec2(0, 0));
    }
    
    public togglePause() {
        this.isPaused = !this.isPaused;
    }
    //TODO REALLY BAD HACK THIS SHOULD BE CHANGED
    private buildMap() : void{
        //THIS IS THE MAP
        const mapInit = [
            [4, 2, 3, 2, 1],
            [1, 3, 2, 1, 0],
            [1, 1, 2, 3, 2],
            [4, 1, 2, 2, 2],
            [0, 3, 1, 1, 4]
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
    public buyCannon() : boolean {
        if(this.money >= Costs.CANNON_COST) {
            this.money -= Costs.CANNON_COST;
            this.numCannon++;
            return true;
        }
        return false;
    }
    public buyTorpedo() : boolean {
        if(this.money >= Costs.TORPEDO_COST) {
            this.money -= Costs.TORPEDO_COST;
            this.numTorpedo++;
            return true;
        }
        return false;
    }
    public buyRepair() : boolean {
        if(this.money >= Costs.REPAIR_COST) {
            this.money -= Costs.REPAIR_COST;
            this.numRepairs++;
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
    public buySail() : boolean {
        if(this.ownedMovements.includes(MovementType.SAIL)) {
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
            return true;
        }
        return false;
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
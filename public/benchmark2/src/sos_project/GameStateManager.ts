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

        this.playerLocation = new Vec2(4, 0);
        
        this.gameMap = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new SOSLevel())
        );

        this.mapOverlays = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new OverlayStatus())
        );

        this.buildMap();
        this.movePlayer(this.playerLocation);
    }
    

    //TODO REALLY BAD HACK THIS SHOULD BE CHANGED
    private buildMap() : void{
        const mapInit = [[4, 2, 3, 2, 1], [1, 3, 2, 1, 0], [1, 1, 2, 3, 2], [4, 1, 2, 2, 2], [0, 3, 1, 1, 4]];
        const n = mapInit.length;
        const m = mapInit[0].length;

        const overlayInit = [];
        for(let i = 0; i < n; i++) {
            overlayInit[i] = [];
            for(let j = 0; j < m; j++) {
                if(i == 0 && j == 0) {
                    overlayInit[i][j] = 1;
                } else if ((i == 0 && j == 1) || (i == 1 && j == 0)) {
                    overlayInit[i][j] = 0;
                } else if (mapInit[i][j] == 0) {
                    overlayInit[i][j] = 0;
                } else {
                    overlayInit[i][j] = 3;
                }
            }
        }

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

    public movePlayer(location : Vec2) : boolean {
        function isInBounds(location : Vec2): boolean {
            return location.x >= 0 && location.x < this.mapOverlays.length && location.y >= 0 && location.y < this.mapOverlays[location.x].length;
        }

        let checkDirections : Vec2[] = [new Vec2(1, 0), new Vec2(1, 0), new Vec2(1, 0), new Vec2(1, 0)]

        if(!checkDirections.includes(location.sub(this.playerLocation))) return false;
        if(!isInBounds(location)) return false;

        //Removes fog in adjacent tiles
        //TODO account for crows nest and radar...
        for(let i = 0; i < checkDirections.length; i++){
            if(isInBounds(location.clone().add(checkDirections[i]))){
                this.mapOverlays[this.playerLocation.x + checkDirections[i].x][this.playerLocation.y + checkDirections[i].y].isFog = false;
            }
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

enum ShipType {
    WOOD,
    METAL,
    FIBERGLASS
}

enum MovementType {
    OAR,
    SAIL,
    MOTOR
}
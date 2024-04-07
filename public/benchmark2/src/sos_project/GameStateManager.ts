import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import { OverlayStatus, SOSLevel } from "./SOSLevel";

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
    public numPumps : number;

    public numCannon : number;
    public numTorpedo : number;

    public hasCrowsNest : boolean;
    public hasRadar : boolean;

    public shipType : ShipType;
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
        this.numPumps = 0;
        this.numCannon = 0;
        this.numTorpedo = 0;
        this.hasCrowsNest = false;
        this.hasRadar = false;
        this.shipType = ShipType.WOOD;
        this.movementType = MovementType.OAR;

        this.playerLocation = new Vec2(0, 4);
        
        this.gameMap = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new SOSLevel())
        );

        this.mapOverlays = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => new OverlayStatus())
        );

        this.movePlayer(this.playerLocation);
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
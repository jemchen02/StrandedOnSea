import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import { SOSLevel } from "./SOSLevel";

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
    public health : number

    public numRepairs : number;
    public numPumps : number;

    public numCannon : number
    public numTorpedo : number

    public hasCrowsNest : boolean
    public hasRadar : boolean

    public shipType : ShipType;
    public movementType : MovementType;

    public playerLocation : Vec2;
    public gameMap: SOSLevel[][];

    // We define starting amounts here.
    GameStateManager(){
        this.money = 800;
        this.health = 100;
        this.numRepairs = 0;
        this.numPumps = 0;
        this.numCannon = 0;
        this.numTorpedo = 0;
        this.hasCrowsNest = false;
        this.hasRadar = false;
        this.shipType = ShipType.WOOD;
        this.movementType = MovementType.OAR;

        this.playerLocation = new Vec2(0, 4);
        
        this.gameMap = new SOSLevel[5][5];
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                this.gameMap[i][j] = new SOSLevel();
            }
        }
    }

    public movePlayer(location : Vec2) : boolean {
        let dummyLocation1 : Vec2 = this.playerLocation.clone();
        let dummyLocation2 : Vec2 = this.playerLocation.clone();
        let dummyLocation3 : Vec2 = this.playerLocation.clone();
        let dummyLocation4 : Vec2 = this.playerLocation.clone();
        dummyLocation1.x += 1;
        dummyLocation2.x -= 1;
        dummyLocation3.y += 1;
        dummyLocation4.y -= 1;

        if(location != dummyLocation1 && location != dummyLocation2 && location != dummyLocation3 && location != dummyLocation4){
            return false;
        }
        

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
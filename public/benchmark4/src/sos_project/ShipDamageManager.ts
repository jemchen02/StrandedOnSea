import GameEvent from "../Wolfie2D/Events/GameEvent";
import Receiver from "../Wolfie2D/Events/Receiver";
import { DamageAmounts } from "./GameConstants";
import { GameStateManager } from "./GameStateManager";

export class ShipDamageManager {
    private static instance: ShipDamageManager;
    public static get(): ShipDamageManager {
      if (ShipDamageManager.instance){
        return ShipDamageManager.instance;
      }

      else {
        ShipDamageManager.instance = new ShipDamageManager();
        return ShipDamageManager.instance;
      }
    }

    hits : ShipHit[];

    hitTime : number;

    receiver: Receiver;

    constructor(){
        this.hits = [];
        this.hitTime = 0;
        this.receiver = new Receiver();

        this.receiver.subscribe("gameend");
    }

    public registerHit(damage : number, time : number) : void{
        this.hits.push(new ShipHit(this.hitTime, damage, time));
    }

    public onUpdate(deltaTime : number){
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        this.hitTime += deltaTime;

        for(let i = this.hits.length - 1; i >= 0; i--){
            let hit : ShipHit = this.hits[i];

            let elapsedTime = this.hitTime - hit.startTime;
            let percentageTime = deltaTime / hit.bleedTime;

            if(elapsedTime > hit.bleedTime){
                this.hits.splice(i, 1);
                continue;
            }
            
            GameStateManager.get().setHealth(GameStateManager.get().health - (hit.damage * percentageTime));
        }

        if(GameStateManager.get().hasPump){
            GameStateManager.get().setHealth(GameStateManager.get().health - (DamageAmounts.PUMP_DAMAGE * deltaTime));
        }
    }

    public handleEvent(event : GameEvent){
        switch (event.type) {
            case "gameend":
                this.hits = [];
                break;
        }
    }
}

class ShipHit{
    public startTime : number;
    public damage : number;
    public bleedTime : number;

    constructor(startTime : number, damage : number, bleedTime : number){
        this.startTime = startTime;
        this.damage = damage;
        this.bleedTime = bleedTime;
    }
}
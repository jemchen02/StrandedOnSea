import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import PlayerActor from "../Actors/PlayerActor";
import { CollisionManager } from "../CollisionManager";
import { DamageAmounts, DamageTimes } from "../GameConstants";
import { ShipDamageManager } from "../ShipDamageManager";

export default class EnemyMineAI implements AI {
    // The owner of this AI
    protected owner: Sprite;
    private player: PlayerActor;

    private exploded : boolean;

    initializeAI(owner: Sprite, options: Record<string, any>): void {
        this.owner = owner;
        this.player = options.player;
        this.exploded = false;

        if(this.owner.position.distanceTo(this.player.position) < 100){
            this.exploded = true;
            this.owner.visible = false;
        }
    }

    activate(options: Record<string, any>): void {
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        if(this.exploded) return;

        this.owner.visible = this.owner.position.distanceTo(this.player.position) < 100;

        if(this.owner.position.distanceTo(this.player.position) < 20){
            ShipDamageManager.get().registerHit(DamageAmounts.OBSTACLE_MINE, DamageTimes.OBSTACLE_MINE_TIME);
            this.owner.visible = false;
            this.exploded = true;
        }
    }

    destroy(): void {
        //Do nothing
    }
}
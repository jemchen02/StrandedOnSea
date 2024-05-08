import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import PlayerActor from "../Actors/PlayerActor";
import { CollisionManager } from "../CollisionManager";
import { DamageAmounts, DamageTimes } from "../GameConstants";
import { ShipDamageManager } from "../ShipDamageManager";
import ExplosionAI from "./Explosion";
import PlayerAI from "./Player/PlayerAI";

export default class EnemyMineAI implements AI {
    // The owner of this AI
    protected owner: Sprite;
    private player: PlayerActor;

    private exploded : boolean;

    private emitter : Emitter;

    initializeAI(owner: Sprite, options: Record<string, any>): void {
        this.owner = owner;
        this.player = options.player;
        this.exploded = false;
        this.emitter = new Emitter();

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
            if((<PlayerAI>this.player._ai).invincibleTimer <= 0) {
                ShipDamageManager.get().registerHit(DamageAmounts.OBSTACLE_MINE, DamageTimes.OBSTACLE_MINE_TIME);
                (<PlayerAI>this.player._ai).justTookDamage();
            }
            this.owner.visible = false;
            this.exploded = true;
            const explosion = this.owner.getScene().add.animatedSprite(AnimatedSprite, "explosion", "primary");
            explosion.position = this.owner.position;
            explosion.addAI(ExplosionAI, {isSplash:false});
            this.emitter.fireEvent("player_hit");
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mine_boom", loop: false, holdReference: true});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "fire2", loop: false, holdReference: true});
        }
    }

    destroy(): void {
    }
}
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import PlayerActor from "../Actors/PlayerActor";
import { CollisionManager } from "../CollisionManager";

export default class EnemyMineAI implements AI {
    // The owner of this AI
    protected owner: Sprite;
    private player: PlayerActor;

    initializeAI(owner: Sprite, options: Record<string, any>): void {
        this.owner = owner;
        this.player = options.player;
    }

    activate(options: Record<string, any>): void {
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        this.owner.visible = this.owner.position.distanceTo(this.player.position) < 100;
    }

    destroy(): void {
        //Do nothing
    }
}
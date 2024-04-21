import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CollisionManager } from "../CollisionManager";

export default class MineAI implements AI {
    // The owner of this AI
    protected owner: Sprite;

    public shooter : GameNode;
    private emitter: Emitter;

    initializeAI(owner: Sprite, options: Record<string, any>): void {
        this.owner = owner;
        this.emitter = new Emitter();
    }

    activate(options: Record<string, any>): void {
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        if(!this.owner.visible) return;
        
        let otherCollider : GameNode = CollisionManager.get().GetHits(this.owner.collisionShape);
        if(otherCollider && otherCollider != this.shooter){
            this.emitter.fireEvent("mineHit", {"node": otherCollider});
            this.owner.destroy();
        }
    }

    destroy(): void {
        //Do nothing
    }
}
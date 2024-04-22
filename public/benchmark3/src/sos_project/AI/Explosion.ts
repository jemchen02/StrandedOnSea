import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { CollisionManager } from "../CollisionManager";

export default class ExplosionAI implements AI {
    private owner: AnimatedSprite;
    private duration: number;
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.duration = 1;
        this.owner = owner;
        owner.animation.play("EXPLOSION", false);
    }

    activate(options: Record<string, any>): void {
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        this.duration -= deltaT;
        if(this.duration <= 0) {
            this.owner.destroy();
        }
    }

    destroy(): void {
    }
}
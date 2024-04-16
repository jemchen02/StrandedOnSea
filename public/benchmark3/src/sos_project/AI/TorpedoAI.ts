import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { CollisionManager } from "../CollisionManager";

export default class TorpedoAI implements AI {
    // The owner of this AI
    protected owner: Graphic;

    public static SPEED: number = 250;

    timeLeft : number = 5;

    public startingVelocity : Vec2;

    public shooter : GameNode;

    initializeAI(owner: Graphic, options: Record<string, any>): void {
        this.owner = owner;
    }

    activate(options: Record<string, any>): void {
        this.startingVelocity = options.startingVelocity
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        if(!this.owner.visible) return;

        this.timeLeft -= deltaT;
        if(this.timeLeft < 0){
            this.owner.visible = false;
        }

        //SOS TODO holme better
        if(Input.getGlobalMousePosition().distanceTo(this.owner.position) < 5){
            this.timeLeft -= (deltaT * 10);
            return;
        }

        let mouseX = Input.getGlobalMousePosition().x;
        let mouseY = Input.getGlobalMousePosition().y;

        let deltaX = mouseX - this.owner.position.x;
        let deltaY = mouseY - this.owner.position.y;
        let angleToMouse = Math.atan2(deltaY, deltaX);

        this.owner.rotation = angleToMouse;

        this.owner.position.add((new Vec2(1, 0).rotateCCW(this.owner.rotation)).scaled(TorpedoAI.SPEED * deltaT).add(this.startingVelocity));

        let otherCollider : GameNode = CollisionManager.get().GetHits(this.owner.collisionShape);
        if(otherCollider && otherCollider != this.shooter){
            console.log("Hit " + otherCollider);
        }
    }

    destroy(): void {
        //Do nothing
    }
}
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CollisionManager } from "../CollisionManager";
import ExplosionAI from "./Explosion";

export default class TorpedoAI implements AI {
    // The owner of this AI
    protected owner: AnimatedSprite;

    public static SPEED: number = 150;

    timeLeft : number = 30;

    public startingVelocity : Vec2;

    public shooter : GameNode;
    private emitter: Emitter;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.emitter = new Emitter();
    }

    activate(options: Record<string, any>): void {
        this.owner.rotation = this.getAngleToMouse();
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        if(!this.owner.visible) return;

        this.timeLeft -= deltaT;
        if(this.timeLeft < 0){
            //this.owner.visible = false;
        }

        let angleToMouse = this.getAngleToMouse();
        this.owner.rotation = this.angleLerp(this.owner.rotation, angleToMouse, deltaT * 1.25);

        this.owner.position.add((new Vec2(0, 1).rotateCCW(this.owner.rotation)).scaled(TorpedoAI.SPEED * deltaT).mult(new Vec2(1, -1)));

        let otherCollider : GameNode = CollisionManager.get().GetHits(this.owner.collisionShape);
        if(otherCollider && otherCollider != this.shooter){
            this.emitter.fireEvent("torpedoHit", {"node": otherCollider});
            this.owner.destroy();
        }
    }

    getAngleToMouse() : number{
        let mouseX = Input.getGlobalMousePosition().x;
        let mouseY = Input.getGlobalMousePosition().y;

        let deltaX = mouseX - this.owner.position.x;
        let deltaY = this.owner.position.y - mouseY;
        return Math.atan2(deltaY, deltaX) - (Math.PI/2);
    }

    angleLerp(current, dest, inc) : number{
        current = this.normalize(current);
        dest = this.normalize(dest);

        if(Math.abs(current-dest) < inc) return dest;

        let positiveDiff = this.normalize(current-dest);
        let negativeDiff = this.normalize(dest-current);

        if(positiveDiff < negativeDiff){
            return current - inc;
        } else{
            return current + inc;
        }
    }

    normalize(angle : number) : number{
        return (angle+(2*Math.PI))%(2*Math.PI);
    }


    destroy(): void {
        const explosion = this.owner.getScene().add.animatedSprite(AnimatedSprite, "explosion", "primary");
        explosion.position = this.owner.position;
        explosion.addAI(ExplosionAI);
    }
}
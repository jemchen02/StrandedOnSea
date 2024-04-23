import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Color from "../../Wolfie2D/Utils/Color";
import { CollisionManager } from "../CollisionManager";

export default class CannonBallAI implements AI {
    // The owner of this AI
    protected owner: Graphic;

    public static SPEED: number = 100;

    public left : boolean;
    public startingVelocity : Vec2;

    public shooter : GameNode;
    private emitter: Emitter;

    initializeAI(owner: Graphic, options: Record<string, any>): void {
        this.owner = owner;
        this.emitter = new Emitter();
        this.owner.setColor(Color.BLACK)
        this.owner.useCustomShader("CANNON_BALL")
    }

    activate(options: Record<string, any>): void {
        this.left = options.left;
        this.startingVelocity = options.startingVelocity
    }

    handleEvent(event: GameEvent): void {
        //Do nothing
    }

    update(deltaT: number): void {
        if(!this.owner.visible) return;
        
        if(this.left) this.owner.position.add((new Vec2(-1, 0).rotateCCW(2 * Math.PI - this.owner.rotation)).scaled(CannonBallAI.SPEED * deltaT).add(this.startingVelocity));
        else this.owner.position.add((new Vec2(1, 0).rotateCCW(2 * Math.PI  - this.owner.rotation)).scaled(CannonBallAI.SPEED * deltaT).add(this.startingVelocity));

        let otherCollider : GameNode = CollisionManager.get().GetHits(this.owner.collisionShape);
        if(otherCollider && otherCollider != this.shooter){
            this.emitter.fireEvent("cannonHit", {"node": otherCollider});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: true});
            this.owner.destroy();
        }
    }

    destroy(): void {
        //Do nothing
    }
}
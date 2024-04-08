import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";

export default class TorpedoAI implements AI {
    // The owner of this AI
    protected owner: Graphic;

    public static SPEED: number = 250;

    public startingVelocity : Vec2;

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
        this.owner.position.add((new Vec2(0, -1).rotateCCW(2 * Math.PI  - this.owner.rotation)).scaled(TorpedoAI.SPEED * deltaT).add(this.startingVelocity));
    }

    destroy(): void {
        //Do nothing
    }
}
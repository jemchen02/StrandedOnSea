import Actor from "../../../Wolfie2D/DataTypes/Interfaces/Actor";
import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import ShipAI from "../ShipAI";

export enum ShipAnimationType {
    IDLE = "IDLE",
    MOVE_FORWARD = "MOVE_FORWARD",
    MOVE_BACKWARD = "MOVE_BACKWARD",
    TURN_LEFT = "TURN_LEFT",
    TURN_RIGHT = "TURN_RIGHT",
    FIRE_STARBOARD = "FIRE_STARBOARD",
    FIRE_PORT = "FIRE_PORT",
    TAKE_DAMAGE = "TAKE_DAMAGE",
    SINKING = "SINKING"
}


export enum ShipStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DYING = "DYING",
    DEAD = "DEAD"
}

export default abstract class ShipState extends State {
    protected parent: ShipAI;
    protected owner: AnimatedSprite;

    public constructor(parent: ShipAI, owner: AnimatedSprite) {
        super(parent);
        this.owner = owner;
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {
        
    }
    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in ShipState!`);
            }
        }
    }
    

}

import Idle from "./Idle";
import Moving from "./Moving";
// More states needed
export { Idle, Moving }
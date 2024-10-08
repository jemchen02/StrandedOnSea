import ShipState from "../../ShipStates/ShipState";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent } from "../../../Events"
import Item from "../../../GameSystems/ItemSystem/Item";
import PlayerAI from "../PlayerAI";


export enum PlayerAnimationType {
    IDLE = "IDLE",
    MOVE = "MOVE",
    FIRE_STARBOARD = "FIRE_STARBOARD",
    FIRE_PORT = "FIRE_PORT",
    TAKE_DAMAGE = "TAKE_DAMAGE",
    SINKING = "SINKING"

}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DYING = "DYING",
    DEAD = "DEAD"
}

export default abstract class PlayerState extends ShipState {

    protected parent: PlayerAI;
    protected owner: PlayerActor;

    public constructor(parent: PlayerAI, owner: AnimatedSprite) {
        super(parent, owner);
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {

        // // Handle the player trying to pick up an item
        // if (this.parent.controller.pickingUp) {
        //     // Request an item from the scene
        //     this.emitter.fireEvent(ItemEvent.ITEM_REQUEST, {node: this.owner, inventory: this.owner.inventory});
        // }

        // // Handle the player trying to drop an item
        // if (this.parent.controller.dropping) {
            
        // }

        // if (this.parent.controller.useItem) {

        // }
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

}

import Invincible from "./Invincible";
import Dead from "./Dead";
import PlayerActor from "../../../Actors/PlayerActor";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
export { Invincible, Dead} 
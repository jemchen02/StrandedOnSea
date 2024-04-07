import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import PlayerActor from "../../Actors/PlayerActor";
import { ItemEvent } from "../../Events";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import Item from "../../GameSystems/ItemSystem/Item";
import PlayerController from "./PlayerController";
import { Idle, Invincible, Moving, Dead, PlayerStateType } from "./PlayerStates/PlayerState";
import ShipAI from "./ShipAI";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
export default class PlayerAI extends ShipAI {
    /** A set of controls for the player */
    public controller: PlayerController;
    /** The inventory object associated with the player */
    public inventory: Inventory;
    
    public initializeAI(owner: PlayerActor, opts: Record<string, any>): void {
        super.initializeAI(owner, opts);
        this.controller = new PlayerController(owner);

        // Add the players states to it's StateMachine
        this.addState(PlayerStateType.IDLE, new Idle(this, this.owner as PlayerActor));
        this.addState(PlayerStateType.INVINCIBLE, new Invincible(this, this.owner as PlayerActor));
        this.addState(PlayerStateType.MOVING, new Moving(this, this.owner as PlayerActor));
        this.addState(PlayerStateType.DEAD, new Dead(this, this.owner as PlayerActor));
        
        // Initialize the players state to Idle
        this.initialize(PlayerStateType.IDLE);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        this.collision = this.controller.isColliding
        this.forwardAxis = this.controller.acceleration
        this.turnDirection = this.controller.rotation
        super.update(deltaT);
		if(this.controller.fireTorpedo){
			// SOS_TODO Add torpedo event
		}


    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            // Add events here
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

}
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../Wolfie2D/Timing/Timer";
import PlayerActor from "../../Actors/PlayerActor";
import { ItemEvent } from "../../Events";
import { GameStateManager } from "../../GameStateManager";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import Item from "../../GameSystems/ItemSystem/Item";
import PlayerController from "./PlayerController";
import { ShipStateType } from "../ShipStates/ShipState";
import { Invincible,  Dead } from "./PlayerStates/PlayerState";
import ShipAI from "../ShipAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
export default class PlayerAI extends ShipAI {
    /** A set of controls for the player */
    public controller: PlayerController;
    /** The inventory object associated with the player */
    public inventory: Inventory;
    public InvincibleTimer: Timer;
    public isInvincible: boolean;
    
    public initializeAI(owner: PlayerActor, opts: Record<string, any>): void {
        super.initializeAI(owner, opts);
        this.isInvincible = false;
        this.controller = new PlayerController(owner);

        // Add the players states to it's StateMachine
        this.addState(ShipStateType.INVINCIBLE, new Invincible(this, this.owner as PlayerActor));
        this.addState(ShipStateType.DEAD, new Dead(this, this.owner as AnimatedSprite));
        
        
        this.receiver.subscribe("ramCollision");
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        if(this.InvincibleTimer) {
            this.InvincibleTimer.update(deltaT);
            if(this.InvincibleTimer.isStopped()) {
                this.isInvincible = false;
            }
        }
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
            case "ramCollision":
                this.onRamCollision();
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
    public onRamCollision(): void {
        if (this.isInvincible) {
            return
        } else {
            this.isInvincible = true;
            GameStateManager.get().health -= 5;
            this.InvincibleTimer = new Timer(2000);
            this.InvincibleTimer.start();
        }
    }

}
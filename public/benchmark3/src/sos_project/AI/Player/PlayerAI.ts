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
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import CannonBallAI from "../CannonBall";
import TorpedoAI from "../TorpedoAI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import { DamageAmounts } from "../../GameConstants";

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
        this.receiver.subscribe("whirlpoolKO");
        this.receiver.subscribe("cannonHit");
        this.receiver.subscribe("torpedoHit");
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
            this.fire_torpedo();
		}
        if(this.controller.firePort){
            this.fire_cannon(true);
		}
        if(this.controller.fireStarBoard){
            this.fire_cannon(false);
		}
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            // Add events here
            case "ramCollision":
                this.onRamCollision();
                break;
            case "whirlpoolKO":
                this.onWhirlpoolKO();
                break;
            case "cannonHit":
                if(event.data.get("node") == this.owner) {
                    this.onCannonHit();
                }
                break;
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
            GameStateManager.get().health -= DamageAmounts.RAM_DAMAGE;
            this.InvincibleTimer = new Timer(2000);
            this.InvincibleTimer.start();
        }
    }
    public onCannonHit(): void {
        if (this.isInvincible) {
            return
        } else {
            this.isInvincible = true;
            GameStateManager.get().health -= DamageAmounts.CANNON_DAMAGE;
            this.InvincibleTimer = new Timer(2000);
            this.InvincibleTimer.start();
        }
    }
    public onWhirlpoolKO(): void {
        GameStateManager.get().health = 0;
    }

    public fire_cannon(left : boolean) : void{
        if(GameStateManager.get().numCannon <= 0) return;
        GameStateManager.get().numCannon --;

        let cannonBall : Graphic = this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(10, 10)});
        cannonBall.visible = true;
        cannonBall.addAI(CannonBallAI);
        cannonBall.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
        (<CannonBallAI>cannonBall._ai).shooter = this.owner;

        //let dir = Vec2.UP.rotateCCW(this.owner.rotation);
        //cannonBall.setAIActive(true, {direction: dir});

        cannonBall.setAIActive(true, {left: left, startingVelocity : this.owner.getLastVelocity()});

        cannonBall.rotation = this.owner.rotation;
        cannonBall.position = new Vec2(0, 0).add(this.owner.position);

        cannonBall.isCollidable = false;
    }

    public fire_torpedo() : void{
        if(GameStateManager.get().numTorpedo <= 0) return;
        GameStateManager.get().numTorpedo --;

        let topedo : Graphic = this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(10, 10)});
        topedo.visible = true;
        topedo.addAI(TorpedoAI);
        topedo.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
        (<TorpedoAI>topedo._ai).shooter = this.owner;

        //let dir = Vec2.UP.rotateCCW(this.owner.rotation);
        //cannonBall.setAIActive(true, {direction: dir});

        topedo.setAIActive(true, {startingVelocity : this.owner.getLastVelocity()});

        topedo.rotation = this.owner.rotation;
        topedo.position = new Vec2(0, 0).add(this.owner.position);

        topedo.isCollidable = false;
    }
}
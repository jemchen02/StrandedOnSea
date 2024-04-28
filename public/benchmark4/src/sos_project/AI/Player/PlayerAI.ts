import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../Wolfie2D/Timing/Timer";
import PlayerActor from "../../Actors/PlayerActor";
import { ItemEvent } from "../../Events";
import { GameStateManager, MovementType, ShipType } from "../../GameStateManager";
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
import { DamageAmounts, DamageTimes, Speeds } from "../../GameConstants";
import { ShipDamageManager } from "../../ShipDamageManager";
import MineAI from "../Mine";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import EnemyActor from "../../Actors/EnemyActor";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
export default class PlayerAI extends ShipAI {
    /** A set of controls for the player */
    public controller: PlayerController;
    /** The inventory object associated with the player */
    public inventory: Inventory;
    public invincibleTimer: number;
    public cannonCooldown: number;
    public deflectChance: number;
    
    public initializeAI(owner: PlayerActor, opts: Record<string, any>): void {
        super.initializeAI(owner, opts);
        this.invincibleTimer = 0;
        this.cannonCooldown = 0;
        this.deflectChance = 0;
        this.controller = new PlayerController(owner);

        // Add the players states to it's StateMachine
        this.addState(ShipStateType.INVINCIBLE, new Invincible(this, this.owner as PlayerActor));
        this.addState(ShipStateType.DEAD, new Dead(this, this.owner as AnimatedSprite));
        
        if(GameStateManager.get().movementType == MovementType.SAIL) {
            this.MAX_SPEED = Speeds.SAIL_SPEED;
        } else if(GameStateManager.get().movementType == MovementType.MOTOR) {
            this.MAX_SPEED = Speeds.MOTOR_SPEED;
        }
        if(GameStateManager.get().shipType == ShipType.FIBERGLASS) {
            this.deflectChance = 0.25;
        } else if(GameStateManager.get().shipType == ShipType.METAL) {
            this.deflectChance = 0.40;
        }

        this.receiver.subscribe("ramCollision");
        this.receiver.subscribe("whirlpoolKO");
        this.receiver.subscribe("cannonHit");
        this.receiver.subscribe("collectLoot")
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        this.invincibleTimer -= deltaT;
        this.cannonCooldown -= deltaT;

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

        ShipDamageManager.get().onUpdate(deltaT);
        if(this.controller.placeMine) {
            this.place_mine();
        }
        if(this.controller.invincible) {
            this.make_invincible();
        }
        if(this.controller.repair) {
            this.repair();
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
                if(event.data.get("node") == this.owner && Math.random() > this.deflectChance) {
                    this.onCannonHit();
                } else {
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key:"hit"});
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "deflect", loop: false, holdReference: true});
                }
                break;
            case "collectLoot":
                GameStateManager.get().generateLoot(event.data.get('rarity'))
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
    public onRamCollision(): void {
        if (this.invincibleTimer > 0) {
            return
        } else if(Math.random() > this.deflectChance) {
            ShipDamageManager.get().registerHit(DamageAmounts.RAM_DAMAGE, DamageTimes.RAM_TIME);
            this.invincibleTimer = Math.max(1, this.invincibleTimer);
        } else {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "deflect", loop: false, holdReference: true});
        }
    }
    public onCannonHit(): void {
        if (this.invincibleTimer > 0) {
            return
        } else {
            ShipDamageManager.get().registerHit(DamageAmounts.CANNON_DAMAGE, DamageTimes.CANNON_TIME);
            this.invincibleTimer = Math.max(1, this.invincibleTimer);
        }
    }
    public onWhirlpoolKO(): void {
        this.emitter.fireEvent("gameLoss");
    }

    public fire_cannon(left : boolean) : void{
        if(this.cannonCooldown <= 0) {
            if(GameStateManager.get().hasRapidFire) {
                this.cannonCooldown = 0.3;
            } else {
                this.cannonCooldown = 0.5;
            }
            let cannonBall : Sprite = this.owner.getScene().add.sprite("cannonball", "primary");
            cannonBall.scale.set(0.15, 0.15);
            cannonBall.addAI(CannonBallAI);
            cannonBall.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
            (<CannonBallAI>cannonBall._ai).shooter = this.owner;
    
            //let dir = Vec2.UP.rotateCCW(this.owner.rotation);
            //cannonBall.setAIActive(true, {direction: dir});
    
            cannonBall.setAIActive(true, {left: left, startingVelocity : this.owner.getLastVelocity()});
    
            cannonBall.rotation = this.owner.rotation;
            cannonBall.position = new Vec2(0, 0).add(this.owner.position);
    
            cannonBall.isCollidable = false;

            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "fire", loop: false, holdReference: true});
        }
       
    }

    public fire_torpedo() : void{
        if(GameStateManager.get().numTorpedo <= 0) return;
        GameStateManager.get().numTorpedo --;

        let torpedo : AnimatedSprite = this.owner.getScene().add.animatedSprite(EnemyActor, "torpedoProjectile", "primary");
        torpedo.animation.play("MOVING");
        torpedo.visible = true;
        torpedo.addAI(TorpedoAI);
        torpedo.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
        (<TorpedoAI>torpedo._ai).shooter = this.owner;

        //let dir = Vec2.UP.rotateCCW(this.owner.rotation);
        //cannonBall.setAIActive(true, {direction: dir});

        torpedo.position = new Vec2(0, 0).add(this.owner.position);
        torpedo.setAIActive(true, {});

        torpedo.isCollidable = false;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "fire", loop: false, holdReference: true});
    }
    public place_mine() : void{
        if(GameStateManager.get().numMine <= 0) return;
        GameStateManager.get().numMine --;

        let mine : Sprite = this.owner.getScene().add.sprite("mine", "primary");
        mine.visible = true;
        mine.addAI(MineAI);
        mine.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
        mine.scale.set(0.1, 0.1);
        (<MineAI>mine._ai).shooter = this.owner;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mine_place", loop: false, holdReference: true});

        mine.setAIActive(true,{});

        mine.rotation = this.owner.rotation;
        mine.position = new Vec2(0, 0).add(this.owner.position);
        mine.isCollidable = false;
    }
    public repair(): void {
        if(GameStateManager.get().numRepairs <= 0) return;
        GameStateManager.get().numRepairs --;
        GameStateManager.get().health = Math.min(GameStateManager.get().maxHealth, GameStateManager.get().health + DamageAmounts.REPAIR_DAMAGE);
    }
    public make_invincible(): void {
        this.invincibleTimer = Math.max(10, this.invincibleTimer);
    }
}
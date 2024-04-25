import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import EnemyActor from "../../Actors/EnemyActor";
import PlayerActor from "../../Actors/PlayerActor";
import { CollisionManager } from "../../CollisionManager";
import { ItemEvent } from "../../Events";
import { DamageAmounts, Speeds } from "../../GameConstants";
import { GameStateManager } from "../../GameStateManager";
import Item from "../../GameSystems/ItemSystem/Item";
import CannonBallAI from "../CannonBall";
import ShipAI from "../ShipAI";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
enum CANNON_SHIP_ENUMS {
    SIGHT_RANGE = 50000,
    FIRE_RANGE = 30000,
    LEASH_RANGE = 45000,
    ACCEPTABLE_ANGLE_MOVE = 0.1 * Math.PI,
    ACCEPTABLE_ANGLE_FIRE = 0.02 * Math.PI
}
export default class CannonShipAI extends ShipAI {

    private player: PlayerActor;
    private fireCooldown: number;
    private inFireMode: boolean;
    public initializeAI(owner: EnemyActor, opts: Record<string, any>): void {
        super.initializeAI(owner, opts);
        this.MAX_SPEED = Speeds.CANNONSHIP_SPEED;
        this.player = opts.player;
        this.fireCooldown = 0;
        this.receiver.subscribe("cannonHit");
        this.receiver.subscribe("torpedoHit");
        this.receiver.subscribe("mineHit");
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        if(!this.isDead) {
            this.collision = this.owner.isColliding;
            const playerPos = this.player.position;

            if(playerPos.distanceSqTo(this.owner.position) < CANNON_SHIP_ENUMS.SIGHT_RANGE){
                if(playerPos.distanceSqTo(this.owner.position) < CANNON_SHIP_ENUMS.LEASH_RANGE) {
                    this.inFireMode = false;
                }
                if(playerPos.distanceSqTo(this.owner.position) < CANNON_SHIP_ENUMS.FIRE_RANGE || this.inFireMode) {
                    this.inFireMode = true;
                    this.maneuver(false);
                } else {
                    this.maneuver(true);
                }
            } else {
                this.turnDirection = 0;
            }
            this.fireCooldown -= deltaT;
            super.update(deltaT);
        }
        
    }
    public maneuver(chasePlayer: boolean) : void {
        const playerPos = this.player.position;
        const angleCCWToPlayer = this.owner.rotation - this.owner.position.angleToCCW(playerPos);
        const vecTo = this.owner.position.vecTo(playerPos);
        const angleTo = Math.atan2(vecTo.y,vecTo.x) + Math.PI/2;
        let angleDiff: number;
        let acceptable_angle: number;
        if(chasePlayer) {
            angleDiff = angleTo + this.owner.rotation;
            acceptable_angle = CANNON_SHIP_ENUMS.ACCEPTABLE_ANGLE_MOVE;
        } else {
            angleDiff = angleTo + this.owner.rotation - Math.PI/2
            acceptable_angle = CANNON_SHIP_ENUMS.ACCEPTABLE_ANGLE_FIRE;
        }
        if (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI;
        }
        if (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI;
        }
        if(angleDiff > 0) {
            this.turnDirection = 1;
        } else {
            this.turnDirection = -1;
        }
        if(angleDiff > acceptable_angle || angleDiff < -acceptable_angle) {
            this.forwardAxis = 0;
        } else {
            this.turnDirection = 0;
            if(chasePlayer) {
                this.forwardAxis = 1;
            } else if(this.fireCooldown <= 0) {
                this.fire_cannon();
            }
        }
    }
    public fire_cannon() : void{
        this.fireCooldown = 3;
        let cannonBall : Sprite = this.owner.getScene().add.sprite("cannonball", "primary");
        cannonBall.scale.set(0.15, 0.15);
        cannonBall.addAI(CannonBallAI);
        cannonBall.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
        (<CannonBallAI>cannonBall._ai).shooter = this.owner;

        cannonBall.setAIActive(true, {left: false, startingVelocity : this.owner.getLastVelocity()});

        cannonBall.rotation = this.owner.rotation;
        cannonBall.position = new Vec2(0, 0).add(this.owner.position);

        cannonBall.isCollidable = false;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "fire2", loop: false, holdReference: true});
    }
    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "cannonHit":
                if(event.data.get("node") == this.owner) {
                    (<EnemyActor>this.owner).health -= DamageAmounts.CANNON_DAMAGE;
                    this.checkDeath();
                }
                break;
            case "torpedoHit":
                if(event.data.get("node") == this.owner) {
                    (<EnemyActor>this.owner).health -= DamageAmounts.TORPEDO_DAMAGE;
                    this.checkDeath();
                }
                break;
            case "mineHit":
                if(event.data.get("node") == this.owner) {
                    (<EnemyActor>this.owner).health -= DamageAmounts.MINE_DAMAGE;
                    this.checkDeath();
                }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
    public checkDeath(): void {
        if((<EnemyActor>this.owner).health <= 0) {
            this.isDead = true;
            CollisionManager.get().remove(this.owner);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "explode1", loop: false, holdReference: true});
        }
    }

}
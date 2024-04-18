import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import EnemyActor from "../../Actors/EnemyActor";
import PlayerActor from "../../Actors/PlayerActor";
import { ItemEvent } from "../../Events";
import { DamageAmounts } from "../../GameConstants";
import { GameStateManager } from "../../GameStateManager";
import Item from "../../GameSystems/ItemSystem/Item";
import ShipAI from "../ShipAI";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
enum RAM_ENUMS {
    SIGHT_RANGE = 40000,
    ACCEPTABLE_ANGLE = 0.1 * Math.PI,
    COLLISION_RANGE = 400
}
export default class RamAI extends ShipAI {

    private player: PlayerActor;
    public initializeAI(owner: EnemyActor, opts: Record<string, any>): void {
        super.initializeAI(owner, opts);
        this.player = opts.player;
        this.receiver.subscribe("cannonHit");
        this.receiver.subscribe("torpedoHit");

    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        this.collision = this.owner.isColliding;
        const playerPos = this.player.position;
        const angleCCWToPlayer = this.owner.rotation - this.owner.position.angleToCCW(playerPos);
        const vecTo = this.owner.position.vecTo(playerPos);
        const angleTo = Math.atan2(vecTo.y,vecTo.x) + Math.PI/2;
        let angleDiff = angleTo + this.owner.rotation;
        if (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI;
        }
        if (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI;
        }
        if(playerPos.distanceSqTo(this.owner.position) < RAM_ENUMS.SIGHT_RANGE){
            if(angleDiff > 0) {
                this.turnDirection = 1;
            } else {
                this.turnDirection = -1;
            }
            if(angleDiff > RAM_ENUMS.ACCEPTABLE_ANGLE) {
                this.forwardAxis = 0;
            } else if(angleDiff < -RAM_ENUMS.ACCEPTABLE_ANGLE){
                this.forwardAxis = 0;
            } else {
                this.turnDirection = 0;
                this.forwardAxis = 1;
            }
        } else {
            this.forwardAxis = 0;
            this.turnDirection = 0;
        }
        super.update(deltaT);
        if(this.owner.position.distanceSqTo(playerPos) < RAM_ENUMS.COLLISION_RANGE) {
            this.emitter.fireEvent("ramCollision");
        }

    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "cannonHit":
                if(event.data.get("node") == this.owner) {
                    (<EnemyActor>this.owner).health -= DamageAmounts.CANNON_DAMAGE;
                    if((<EnemyActor>this.owner).health <= 0) {
                        this.isDead = true;
                    }
                }
                break;
            case "torpedoHit":
                if(event.data.get("node") == this.owner) {
                    (<EnemyActor>this.owner).health -= DamageAmounts.TORPEDO_DAMAGE;
                    if((<EnemyActor>this.owner).health <= 0) {
                        this.isDead = true;
                    }
                }
                break;
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

}
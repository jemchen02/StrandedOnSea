import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../../Wolfie2D/Debug/Debug";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import EnemyActor from "../../Actors/EnemyActor";
import NPCActor from "../../Actors/NPCActor";
import PlayerActor from "../../Actors/PlayerActor";
import { DamageAmounts } from "../../GameConstants";
import CannonBallAI from "../CannonBall";

enum TOWER_ENUMS {
    SIGHT_RANGE = 30000
}

export default class TowerAI extends StateMachineAI {
	private isDead: boolean = false;
    private fireCooldown: number;
    private player: PlayerActor;

	/**
	 * @param owner The owner of this AI - i.e. the player
	 * @param options The list of options for ai initialization
	 */
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
        this.player = options.player;
		// SOS_TODO These parameters need to change based on the hull of the ship
        // Better alternative: have this class request parameters from enums based on the ship type and propulsion type


		this.receiver = new Receiver();
		this.emitter = new Emitter();
        this.fireCooldown = 0;
	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "cannonHit":
                if(event.data.get("node") == this.owner) {
                    (<EnemyActor>this.owner).health -= DamageAmounts.CANNON_DAMAGE;
                    if((<EnemyActor>this.owner).health <= 0) {
                        this.isDead = true;
                    }
                }
                break;
        }
	}
    public fire_cannon() : void{
        this.fireCooldown = 3;
        let cannonBall : Graphic = this.owner.getScene().add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(10, 10)});
        cannonBall.visible = true;
        cannonBall.addAI(CannonBallAI);
        cannonBall.addPhysics(new AABB(Vec2.ZERO, new Vec2(1, 1)));
        (<CannonBallAI>cannonBall._ai).shooter = this.owner;

        cannonBall.setAIActive(true, {left: false, startingVelocity : new Vec2(0, 0)});

        cannonBall.rotation = this.owner.rotation;
        cannonBall.position = new Vec2(0, 0).add(this.owner.position);

        cannonBall.isCollidable = false;
    }
    facePlayer(): void {
        const playerPos = this.player.position;
        const vecTo = this.owner.position.vecTo(playerPos);
        this.owner.rotation = -Math.atan2(vecTo.y,vecTo.x);
    }
	update(deltaT: number): void {
		if(this.isDead) return;

        const playerPos = this.player.position;
        if(playerPos.distanceSqTo(this.owner.position) < TOWER_ENUMS.SIGHT_RANGE) {
            this.facePlayer();
            if(this.fireCooldown <= 0) {
                this.fire_cannon();
            }
        }
        this.fireCooldown -= deltaT;
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

        // SOS_TODO Add events for firing cannons on port side and starboard side

		// Animations
	}
} 
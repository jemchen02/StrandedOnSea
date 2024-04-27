import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyActor from "../../Actors/EnemyActor";
import PlayerActor from "../../Actors/PlayerActor";
import { CollisionManager } from "../../CollisionManager";
import { DamageAmounts } from "../../GameConstants";


export default class BlockadeAI extends StateMachineAI {
	private isDead: boolean = false;
    private player: PlayerActor;
    public health: number = 50;

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
        this.receiver.subscribe("cannonHit");
        this.receiver.subscribe("torpedoHit");
	}


	handleEvent(event: GameEvent): void {
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
        }
	}
	update(deltaT: number): void {
		if(this.isDead) return;
        if(this.owner.collisionShape.overlaps(this.player.collisionShape)) {
			//this.player.position = this.owner.position;
			this.player.position.add(this.player.position.vecTo(this.owner.position).scaled(-0.08));
		}
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

	}
    public checkDeath(): void {
        if((<EnemyActor>this.owner).health <= 0) {
            this.isDead = true;
            this.owner.isCollidable = false;
            CollisionManager.get().remove(this.owner);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "explode1", loop: false, holdReference: true});
        }
    }
} 
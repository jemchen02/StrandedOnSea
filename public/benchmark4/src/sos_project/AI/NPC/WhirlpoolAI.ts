import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../../Wolfie2D/Debug/Debug";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import PlayerActor from "../../Actors/PlayerActor";
import { CollisionManager } from "../../CollisionManager";
import CannonBallAI from "../CannonBall";

export default class WhirlpoolAI extends StateMachineAI {
	private isDead: boolean = false;
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

	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// Need to handle animations when damage is taken
	}
	update(deltaT: number): void {
		if(this.isDead) return;

        this.owner.rotation += deltaT;
		let otherColliders : GameNode[] = CollisionManager.get().GetHitsCircle(<Circle>this.owner.collisionShape);
		for (const collider of otherColliders) {
			const distanceToCollider = this.owner.position.distanceTo(collider.position);
			if (!collider.isStatic) {
				collider.position.add(collider.position.vecTo(this.owner.position).scaled(deltaT * 40  / distanceToCollider));
				if(distanceToCollider < 5) {
					this.emitter.fireEvent("whirlpoolKO", {"node": collider});
				}
			}	
		}

		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

        // SOS_TODO Add events for firing cannons on port side and starboard side

		// Animations
	}
} 
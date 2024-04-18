import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../../Wolfie2D/Debug/Debug";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import PlayerActor from "../../Actors/PlayerActor";
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
		const distanceToPlayer = this.player.position.distanceTo(this.owner.position);
		if(this.checkAABBtoCircleCollision(<AABB>this.player.collisionShape, <Circle>this.owner.collisionShape)) {
			//this.player.position = this.owner.position;
			this.player.position.add(this.player.position.vecTo(this.owner.position).scaled(deltaT * 20 / distanceToPlayer));
		}
		if(distanceToPlayer < 5) {
			this.emitter.fireEvent("whirlpoolKO");
		}

		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

        // SOS_TODO Add events for firing cannons on port side and starboard side

		// Animations
	}
	checkAABBtoCircleCollision(aabb: AABB, circle: Circle): boolean {
		// Your code goes here:
		const c_x = circle.center.x;
		const c_y = circle.center.y;
		const aabb_x_low = aabb.topLeft.x;
		const aabb_x_high = aabb.bottomRight.x;
		const aabb_y_low = aabb.topLeft.y;
		const aabb_y_high = aabb.bottomRight.y;
		const closest_x = Math.min(Math.max(c_x, aabb_x_low), aabb_x_high);
		const closest_y = Math.min(Math.max(c_y, aabb_y_low), aabb_y_high);
		const vec_closest = new Vec2(closest_x, closest_y);
		return circle.containsPoint(vec_closest);
	}
} 
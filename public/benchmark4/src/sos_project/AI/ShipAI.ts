import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { GameStateManager, MovementType } from "../GameStateManager";

import { Idle, Moving } from "./ShipStates/ShipState";
import { ShipStateType } from "./ShipStates/ShipState";

export default class ShipAI extends StateMachineAI {

	// Parameters that are either constants or used for ship control
	private direction: Vec2;
    protected forwardAxis: number = 0;
    protected turnDirection: number = 0;
    protected frictionConstant: number = 0.02;
    protected collision: boolean = false;
	private speed: number;
	private hasSail: boolean = false;

    // Parameters that may change based on the ship state
	private MIN_SPEED: number = -25;
	private MAX_SPEED: number = 65;
	private ACCELERATION: number = 1;
	private rotationSpeed: number;

    

	protected isDead: boolean = false;

	public get isMoving() {
		return this.forwardAxis != 0
	}
	
	public get isMovingForward() {
		return this.forwardAxis > 0
	}

	public get isMovingBackward() {
		return this.forwardAxis < 0
	}

	public get isTurningLeft() {
		return this.turnDirection < 0
	}

	public get isTurningRight() {
		return this.turnDirection > 0
	}

	public get checkSail() {
		return GameStateManager.get().hasSail() ? "SAIL_" : "";
	}

	/**
	 * This method initializes all variables inside of this AI class, and sets
	 * up anything we need it do.
	 * 
	 * You should subscribe to the correct event for player damage here using the Receiver.
	 * The AI will react to the event in handleEvent() - you just need to make sure
	 * it is subscribed to them.
	 * 
	 * @param owner The owner of this AI - i.e. the player
	 * @param options The list of options for ai initialization
	 */
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		// SOS_TODO These parameters need to change based on the hull of the ship
        // Better alternative: have this class request parameters from enums based on the ship type and propulsion type
		this.direction = new Vec2(0, 1);
		this.speed = 0;
		this.rotationSpeed = 1.5;

		this.receiver = new Receiver();
		this.emitter = new Emitter();

		this.addState(ShipStateType.IDLE, new Idle(this, this.owner as AnimatedSprite));
        this.addState(ShipStateType.MOVING, new Moving(this, this.owner as AnimatedSprite));
        this.initialize(ShipStateType.IDLE);

	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// Need to handle animations when damage is taken
	}

	update(deltaT: number): void {
		if(this.isDead) return;
		
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

        // Apply friction
        if (this.forwardAxis == 0) {        
            if(Math.abs(this.speed) > 10) {
                this.speed -= MathUtils.clamp(this.speed, -1, 1) * Math.max(Math.round(this.frictionConstant*this.speed), 1);
            }
            else{
                this.speed = 0;
            }
        }

		// Space controls - speed stays the same if nothing happens
		// Forward to speed up, backward to slow down
		if (this.collision) {
            // Remember to deal damage to the ship
            this.speed = 0
        }
        else{
            this.speed += this.ACCELERATION * this.forwardAxis;
	    	this.speed = MathUtils.clamp(this.speed, this.MIN_SPEED, this.MAX_SPEED);
        }

		// Rotate the ship
		this.direction.rotateCCW(this.turnDirection * this.rotationSpeed * deltaT);

		// Update the visual direction of the ship
		this.owner.rotation = -(Math.atan2(this.direction.y, this.direction.x) - Math.PI/2);
		
		// Move the ship
		this.owner.move(this.direction.scaled(-this.speed * deltaT));

		Debug.log("player_pos", "Player Position: " + this.owner.position.toString());

		super.update(deltaT);
        // SOS_TODO Add events for firing cannons on port side and starboard side

		// Animations
	}
} 
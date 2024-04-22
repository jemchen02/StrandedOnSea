import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import PlayerActor from "../Actors/PlayerActor";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";

export default class FloatingLootAI extends StateMachineAI {
    private isDead: boolean = false;
    private player: PlayerActor;
    private rarity: number;

    /**
	 * @param owner The owner of this AI - i.e. the player
	 * @param options The list of options for ai initialization
	 */
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
        this.player = options.player;
        this.rarity = options.rarity;
		this.receiver = new Receiver();
		this.emitter = new Emitter();
	}

    activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// Need to handle animations when damage is taken
	}
	update(deltaT: number): void {
        if (this.isDead) return;

        if ((<AABB>this.player.collisionShape).overlaps(<AABB> this.owner.collisionShape)){
            this.emitter.fireEvent("collectLoot", {'rarity': this.rarity})
            this.isDead = true
            this.owner.destroy()
        }

        while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}
    }

} 
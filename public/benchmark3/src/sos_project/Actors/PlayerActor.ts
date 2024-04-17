import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { BattlerEvent, ItemEvent } from "../Events";
import BasicBattler from "../GameSystems/BattleSystem/BasicBattler";
import Battler from "../GameSystems/BattleSystem/Battler";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import { TargetableEntity } from "../GameSystems/Targeting/TargetableEntity";
import { TargetingEntity } from "../GameSystems/Targeting/TargetingEntity";


export default class PlayerActor extends AnimatedSprite implements Battler {

    /** Override the type of the scene to be the HW4 scene */
    protected scene: Scene

    /** Give the player a battler compoonent */
    protected battler: Battler;
    protected targetable: TargetableEntity;


    constructor(sheet: Spritesheet) {
        super(sheet);
        this.battler = new BasicBattler(this);
        this.targetable = new BasicTargetable(this);

        this.receiver.subscribe(ItemEvent.LASERGUN_FIRED)
    }

    get battlerActive(): boolean {
        return this.battler.battlerActive;
    }
    set battlerActive(value: boolean) {
        this.battler.battlerActive = value;
        this.visible = value;
    }
    
    public getTargeting(): TargetingEntity[] { return this.targetable.getTargeting(); }
    public addTargeting(targeting: TargetingEntity): void { this.targetable.addTargeting(targeting); }
    public removeTargeting(targeting: TargetingEntity): void { this.targetable.removeTargeting(targeting); }

    public override setScene(scene: Scene): void { this.scene = scene; }
    public override getScene(): Scene { return this.scene; }

    get maxHealth(): number {
        return this.battler.maxHealth;
    }
    set maxHealth(value: number) {
        this.battler.maxHealth = value;
    }
    get health(): number {
        return this.battler.health;
    }
    set health(value: number) {
        this.battler.health = value;
        if (this.health <= 0) {
            this.emitter.fireEvent(BattlerEvent.BATTLER_KILLED, {id: this.id});
        }
    }
    get speed(): number {
        return this.battler.speed;
    }
    set speed(value: number) {
        this.battler.speed = value;
    }
}
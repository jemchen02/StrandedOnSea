import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite"
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import { BattlerEvent, HudEvent } from "../Events";
import HW4Scene from "../Scenes/SosScene";

import Battler from "../GameSystems/BattleSystem/Battler";
import BasicBattler from "../GameSystems/BattleSystem/BasicBattler";
import Timer from "../../Wolfie2D/Timing/Timer";


export default class EnemyActor extends AnimatedSprite{

    /** Override the type of the scene to be the HW4 scene */
    protected scene: HW4Scene

    // An invincible timer for our NPCs
    protected attackCooldown: Timer;

    // The key of the Navmesh to use to build paths for this NPCActor
    protected _navkey: string;

    // The NPCs battler object
    protected _battler: Battler;

    public constructor(sheet: Spritesheet) {
        super(sheet);
        this._navkey = "navkey";
        this._battler = new BasicBattler(this);
        this.attackCooldown = new Timer(1000);
    }

    public get battlerActive(): boolean { return this.battler.battlerActive; }
    public set battlerActive(value: boolean) { 
        this.battler.battlerActive = value; 
        this.visible = value;
        this.aiActive = value;
    }

    public get maxHealth(): number { return this.battler.maxHealth }
    public set maxHealth(maxHealth: number) { 
        this.battler.maxHealth = maxHealth; 
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {id: this.id, curhp: this.health, maxhp: this.maxHealth});
    }

    public get health(): number { return this.battler.health; }
    public set health(health: number) { 
        this.battler.health = health; 
        if (this.health <= 0 && this.battlerActive) {
            this.emitter.fireEvent(BattlerEvent.BATTLER_KILLED, {id: this.id});
        }
    }

    public get speed(): number { return this.battler.speed; }
    public set speed(speed: number) { this.battler.speed = speed; }

    public override setScene(scene: HW4Scene): void { this.scene = scene; }
    public override getScene(): HW4Scene { return this.scene; }

    public get navkey(): string { return this._navkey; }
    public set navkey(navkey: string) { this._navkey = navkey; }


    protected get battler(): Battler { return this._battler; }
}
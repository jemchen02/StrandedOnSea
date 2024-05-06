import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import { LevelRewards } from "../GameConstants";
import { GameStateManager } from "../GameStateManager";
import BattleScene from "./BattleScene";

export default class SalvageScene2 extends BattleScene {
    private timer: number;
    private timerLabel: Label;
    private checkpoint: number
    private interval: number;
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.timer = 60;
        this.checkpoint = this.timer;
        this.interval = 3;
    }

    private get timePassed(){
        return this.checkpoint-this.timer
    }

    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/shipwreck2/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/SalvageMap2.json");
        this.load.audio("shipwreck_theme", "sos_assets/music/black_midi_kondracki.mp4");
    }
    public startScene(): void {
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "shipwreck_theme", loop: true, holdReference: true});
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.timerLabel = <Label> this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 45*this.scaleFactor), text: "Collect as much loot possible within "+this.timer+" seconds!", fontSize: 30, textColor: Color.WHITE});
    }
    public override update(deltaT: number): void {
        super.update(deltaT)
        if (this.timer>0) {
            this.timer -= deltaT
            this.timerLabel.text = `Collect as much loot possible within ${Math.max(this.timer,0).toFixed(2)} seconds!`
        }
        if (this.timer <= 0 && !this.levelEnded) {
            this.winLevel()
        }
        if (this.timePassed >= this.interval){
            this.checkpoint = this.timer
            this.spawnLootBarrel()
        }
    }
    protected override winLevel(): void {
        GameStateManager.get().money += LevelRewards.SHIPWRECK2;
        super.winLevel(LevelRewards.SHIPWRECK2);
    }
    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "shipwreck_theme"});
    }
}
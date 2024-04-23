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

export default class HostileScene extends BattleScene {
    private enemiesLeftLabel: Label;
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
    }
    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/battle1/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/BattleMap1.json");
        this.load.audio("hostile_theme", "sos_assets/music/summoning_ancient_evil_leg_day.mp4");
    }
    public startScene(): void {
        super.startScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "sos_theme"});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hostile_theme", loop: true, holdReference: true});
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 45*this.scaleFactor), text: "Defeat All Enemies", fontSize: 30, textColor: Color.WHITE});
        this.enemiesLeftLabel = <Label>this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 65*this.scaleFactor), text: `Enemies left: ${this.battlerCount}`, fontSize: 30, textColor: Color.WHITE});
    }
    public override update(deltaT: number): void {
        super.update(deltaT);
        this.enemiesLeftLabel.setText(`Enemies left: ${this.battlerCount}`);
        if(this.battlerCount == 0 && !this.levelEnded) {
            this.winLevel();
        }
    }
    protected override winLevel(): void {
        GameStateManager.get().money += LevelRewards.HOSTILE1;
        super.winLevel(LevelRewards.HOSTILE1);
    }
    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "hostile_theme"});
    }
}
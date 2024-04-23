import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import { LevelRewards } from "../GameConstants";
import { GameStateManager } from "../GameStateManager";
import BattleScene from "./BattleScene";

export default class ShipwreckScene extends BattleScene {
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
    }
    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/shipwreck1/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/BattleMap1.json");
        this.load.audio("shipwreck_theme", "sos_assets/music/black_midi_kondracki.mp4");
    }
    public startScene(): void {
        super.startScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "sos_theme"});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "shipwreck_theme", loop: true, holdReference: true});
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 45*this.scaleFactor), text: "Collect loot before time runs out!", fontSize: 30, textColor: Color.WHITE});
    }
    protected override winLevel(): void {
        GameStateManager.get().money += LevelRewards.SHIPWRECK1;
        super.winLevel(LevelRewards.SHIPWRECK1);
    }
    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "shipwreck_theme"});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "sos_theme", loop: true, holdReference: true});
    }
}
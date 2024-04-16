import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import { LevelRewards } from "../GameConstants";
import { GameStateManager } from "../GameStateManager";
import BattleScene from "./BattleScene";

export default class ObstacleScene2 extends BattleScene {
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
    }
    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/obstacle2/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/BattleMap1.json");
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260, 25), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260, 45), text: "Avoid obstacles", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260, 65), text: "Reach destination", fontSize: 30, textColor: Color.WHITE});
    }
    protected override endLevel(): void {
        GameStateManager.get().money += LevelRewards.OBSTACLE2;
        super.endLevel();
    }
}
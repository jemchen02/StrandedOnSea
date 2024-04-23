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

export default class WhirlpoolScene extends BattleScene {
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
    }
    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/whirlpool1/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/WhirlpoolMap1.json");
        this.load.audio("whirlpool_theme", "sos_assets/music/oh_bright_dawn_may_public_domain.mp4");
    }
    public startScene(): void {
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "whirlpool_theme", loop: true, holdReference: true});
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 45*this.scaleFactor), text: "Don't get sucked in by whirlpool!", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 65*this.scaleFactor), text: "Reach destination", fontSize: 30, textColor: Color.WHITE});
    }
    public override update(deltaT: number): void {
        super.update(deltaT);
        if(this.player.position.y > 620 && !this.levelEnded) {
            this.winLevel();
        }
    }
    protected override winLevel(): void {
        GameStateManager.get().money += LevelRewards.WHIRLPOOL1;
        super.winLevel(LevelRewards.WHIRLPOOL1);
    }
    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "whirlpool_theme"});
    }
}
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import FloatingLootAI from "../AI/FloatingLootAI";
import { LevelRewards } from "../GameConstants";
import { GameStateManager } from "../GameStateManager";
import BattleScene from "./BattleScene";

export default class ShipwreckScene extends BattleScene {
    private timer: number;
    private timerLabel: Label;
    private checkpoint: number
    private interval: number;
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.timer = 60;
        this.checkpoint = this.timer
        this.interval = 4
    }

    private get timePassed(){
        return this.checkpoint-this.timer
    }

    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/shipwreck1/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/BattleMap1.json");
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objective:", fontSize: 30, textColor: Color.WHITE});
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
        GameStateManager.get().money += LevelRewards.SHIPWRECK1;
        super.winLevel(LevelRewards.SHIPWRECK1);
    }
}
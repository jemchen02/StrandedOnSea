import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import { LevelData, LevelRewards } from "../GameConstants";
import { GameStateManager } from "../GameStateManager";
import BattleScene from "./BattleScene";

export default class ObstacleScene extends BattleScene {
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
    }
    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/obstacle1/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/ObstacleMap.json");
        this.load.audio("obstacle_theme", "sos_assets/music/black_midi_kahos.mp4");
    }
    public startScene(): void {
        super.startScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "sos_theme"});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "obstacle_theme", loop: true, holdReference: true});
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 45*this.scaleFactor), text: "Avoid mines", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 65*this.scaleFactor), text: "Head north", fontSize: 30, textColor: Color.WHITE});
    }
    protected override winLevel(): void {
        GameStateManager.get().money += LevelRewards.OBSTACLE1;
        super.winLevel(LevelRewards.OBSTACLE1);
    }

    levelActive : boolean
    wavePos : number;

    public override updateScene(deltaT : number) : void{
        super.updateScene(deltaT);

        if(this.player.position.y < 50 && this.levelActive){
            this.levelActive = false;
            this.winLevel();
        }

        if(this.player.position.y > this.wavePos && this.levelActive){
            this.levelActive = false;
            this.loseLevel();
        }

        this.wavePos -= (64 * deltaT);
        this.wave.position.set(256, this.wavePos);
    }

    wave : Graphic;

    protected override initializeNPCs(): void {

        this.player.position.set(256, 2048 - 100);

        super.initializeNPCs();

        for(let i = 0; i < LevelData.NUM_OBSTACLE_MINES; i++){
            this.spawnMine(Math.random() * 512, Math.random() * 2048);
        }

        this.wavePos = 2048 + 200;
        this.levelActive = true;

        this.wave = this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(1000, 10)});
        this.wave.addPhysics();
        this.wave.position.set(256, this.wavePos);
    }
    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "obstacle_theme"});
    }
}
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import PlayerAI from "../AI/Player/PlayerAI";
import { DamageAmounts, DamageTimes, LevelData, LevelRewards } from "../GameConstants";
import { GameStateManager } from "../GameStateManager";
import { ShipDamageManager } from "../ShipDamageManager";
import BattleScene from "./BattleScene";

export default class ObstacleScene2 extends BattleScene {
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
    }
    public override loadScene(): void {
        super.loadScene();
        this.load.object("enemies", "hw4_assets/data/enemies/obstacle1/enemies.json");
        this.load.tilemap("level", "hw4_assets/tilemaps/ObstacleMap2.json");
        this.load.audio("obstacle_theme", "sos_assets/music/black_midi_kahos.mp4");
    }
    public startScene(): void {
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "obstacle_theme", loop: true, holdReference: true});
    }
    protected override initializeHUD(): void {
        super.initializeHUD();
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 25*this.scaleFactor), text: "Objectives:", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 45*this.scaleFactor), text: "Avoid mines", fontSize: 30, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, "staticHUD", {position: new Vec2(260*this.scaleFactor, 65*this.scaleFactor), text: "Head north", fontSize: 30, textColor: Color.WHITE});
    }
    protected override winLevel(): void {
        GameStateManager.get().money += LevelRewards.OBSTACLE2;
        super.winLevel(LevelRewards.OBSTACLE2);
    }

    waveIndex : number;
    wavePos : number[];
    waves : AnimatedSprite[];

    levelActive : boolean

    public override updateScene(deltaT : number) : void{
        super.updateScene(deltaT);

        if(this.player.position.y < 50 && this.levelActive){
            this.levelActive = false;
            this.winLevel();
        }

        //if(this.player.position.y > this.wavePos && this.levelActive){
            //this.levelActive = false;
            //this.loseLevel();
        //}

        for(let i = 0; i < 10; i++){
            this.wavePos[i] -= (70 * deltaT);
            this.waves[i].position.set(256, this.wavePos[i]);

            if(this.player.position.y > this.wavePos[i]){
                if(this.waveIndex == i){
                    ShipDamageManager.get().registerHit(DamageAmounts.WAVE_DAMAGE, DamageTimes.WAVE_TIME);
                    this.emitter.fireEvent("player_hit");
                    (<PlayerAI>this.player._ai).justTookDamage();
                    this.waveIndex++;
                }
            }
        }
    }

    //wave : Graphic;

    protected override initializeNPCs(): void {

        this.player.position.set(256, 2048 - 100);

        super.initializeNPCs();

        for(let i = 0; i < LevelData.NUM_ADV_OBSTACLE_MINES; i++){
            this.spawnMine(Math.random() * 512, Math.random() * 2048);
        }

        this.wavePos = [];
        this.waves = [];
        this.waveIndex = 0;

        for(let i = 0; i < 10; i++){
            this.wavePos.push(2048 + 200 + (i * 200));

            let wave = this.add.animatedSprite(AnimatedSprite, "wave", "primary");
            wave.scale = new Vec2(62, 3);
            wave.position.set(256, 2048 + 200 + (i * 200));
            this.waves.push(wave)
            wave.animation.play("IDLE", true)
        }

        this.levelActive = true;
    }
    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "obstacle_theme"});
    }
}
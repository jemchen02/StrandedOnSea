import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MapScene from "./MapScene";
import HostileScene from "./HostileScene";
import HostileScene2 from "./HostileScene2";
import ObstacleScene from "./ObstacleScene";
import ObstacleScene2 from "./ObstacleScene2";
import ShipwreckScene from "./ShipwreckScene";
import ShipwreckScene2 from "./ShipwreckScene2";
import WhirlpoolScene from "./WhirlpoolScene";
import WhirlpoolScene2 from "./WhirlpoolScene2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";
import ObstacleScene3 from "./ObstacleScene3";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private controlLayer: Layer;
    private helpLayer: Layer;
    private selectLayer: Layer;
    private background: Layer;
    private menuSubscriptions: string[];

    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("gameTitle", "hw4_assets/sprites/gameTitle.png");
        this.load.image("controlsImage", "hw4_assets/sprites/controls.png");
        this.load.image("helpImage", "hw4_assets/sprites/help.png");
        this.load.image("menuBackgroundImage", "hw4_assets/sprites/menuBackground.png");
        this.load.spritesheet("menuBackground", "sos_assets/spritesheets/menu_background.json")
    }

    public startScene(){
        AudioManager.setVolume(AudioChannelType.MUSIC, 0.05);

        const center = this.viewport.getCenter();
        this.menuSubscriptions = [];

        this.background = this.addUILayer("background");

        const background = this.add.animatedSprite(AnimatedSprite, "menuBackground", "background");
        background.position.set(center.x, center.y);
        background.scale.set(8, 8);
        background.animation.play("IDLE");

        this.mainMenu = this.addUILayer("mainMenu");


        const gameTitle = this.add.sprite("gameTitle", "mainMenu");
        gameTitle.position.set(center.x + 35, center.y - 170);
        gameTitle.scale.set(1.2, 1.2);

        this.createButton("mainMenu", new Vec2(center.x, center.y - 200), "Start Game", "play", new Vec2(300, 75));

        this.createButton("mainMenu", new Vec2(center.x, center.y - 50), "Select Level", "select", new Vec2(300, 75));

        this.createButton("mainMenu", new Vec2(center.x, center.y + 100), "Controls", "controls", new Vec2(300, 75));

        this.createButton("mainMenu", new Vec2(center.x, center.y + 250), "Help", "help", new Vec2(300, 75));


        this.controlLayer = this.addUILayer("controls");

        const controlImage = this.add.sprite("controlsImage", "controls");
        controlImage.position.set(center.x, center.y);
        controlImage.scale.set(1.2, 1.2);

        this.createButton("controls", new Vec2(center.x + 400, center.y - 270), "X", "exitControls", new Vec2(50, 50));

        this.controlLayer.disable();

        this.helpLayer = this.addUILayer("help");

        const helpImage = this.add.sprite("helpImage", "help");
        helpImage.position.set(center.x, center.y);
        helpImage.scale.set(1, 1);

        this.createButton("help", new Vec2(center.x + 400, center.y - 290), "X", "exitHelp", new Vec2(50, 50));

        this.helpLayer.disable();

        this.selectLayer = this.addUILayer("select");
        const selectBackground = this.add.sprite("menuBackgroundImage", "select");
        selectBackground.position.set(center.x, center.y - 20);
        selectBackground.scale.set(.8, 1.2);
        this.add.uiElement(UIElementType.LABEL, "select", {position: new Vec2(center.x, center.y - 400), text: 'Select Level (Testing Only)', fontSize: 40, textColor: Color.WHITE});
        this.createButton("select", new Vec2(center.x - 150, center.y - 300), "Hostile 1", "hostile1", new Vec2(200, 75));
        this.createButton("select", new Vec2(center.x + 150, center.y - 300), "Hostile 2", "hostile2", new Vec2(200, 75));
        this.createButton("select", new Vec2(center.x - 175, center.y - 150), "Obstacle 1", "obstacle1", new Vec2(150, 75));
        this.createButton("select", new Vec2(center.x, center.y - 150), "Obstacle 2", "obstacle2", new Vec2(150, 75));
        this.createButton("select", new Vec2(center.x + 175, center.y - 150), "Obstacle 3", "obstacle3", new Vec2(150, 75));
        this.createButton("select", new Vec2(center.x - 150, center.y), "Shipwreck 1", "shipwreck1", new Vec2(200, 75));
        this.createButton("select", new Vec2(center.x + 150, center.y), "Shipwreck 2", "shipwreck2", new Vec2(200, 75));
        this.createButton("select", new Vec2(center.x - 150, center.y + 150), "Whirlpool 1", "whirlpool1", new Vec2(200, 75));
        this.createButton("select", new Vec2(center.x + 150, center.y + 150), "Whirlpool 2", "whirlpool2", new Vec2(200, 75));
        this.createButton("select", new Vec2(center.x, center.y + 300), "Back", "exitSelect", new Vec2(200, 75));
        
        
        this.selectLayer.disable();

        // Subscribe to the button events
        for(let menuEvent of this.menuSubscriptions) {
            this.receiver.subscribe(menuEvent);
        }
    }
    private createButton(layer: string, position: Vec2, text: string, clickEvent: string, size: Vec2) {
        const newButton = this.add.uiElement(UIElementType.BUTTON, layer, {position, text});
        newButton.size.set(size.x, size.y);
        newButton.borderWidth = 2;
        newButton.borderColor = Color.WHITE;
        newButton.backgroundColor = Color.fromStringHex("0900FF");
        newButton.onClickEventId = clickEvent;
        this.menuSubscriptions.push(clickEvent);
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MapScene);
                break;
            }
            case "controls": {
                this.mainMenu.disable();
                this.controlLayer.enable();
                break;
            }
            case "exitControls": {
                this.mainMenu.enable();
                this.controlLayer.disable();
                break;
            }
            case "help": {
                this.mainMenu.disable();
                this.helpLayer.enable();
                break;
            }
            case "exitHelp": {
                this.mainMenu.enable();
                this.helpLayer.disable();
                break;
            }
            case "select": {
                this.mainMenu.disable();
                this.selectLayer.enable();
                break;
            }
            case "exitSelect": {
                this.mainMenu.enable();
                this.selectLayer.disable();
                break;
            }
            case "hostile1": {
                this.sceneManager.changeToScene(HostileScene);
                break;
            }
            case "hostile2": {
                this.sceneManager.changeToScene(HostileScene2);
                break;
            }
            case "obstacle1": {
                this.sceneManager.changeToScene(ObstacleScene);
                break;
            }
            case "obstacle2": {
                this.sceneManager.changeToScene(ObstacleScene2);
                break;
            }
            case "obstacle3": {
                this.sceneManager.changeToScene(ObstacleScene3);
                break;
            }
            case "shipwreck1": {
                this.sceneManager.changeToScene(ShipwreckScene);
                break;
            }
            case "shipwreck2": {
                this.sceneManager.changeToScene(ShipwreckScene2);
                break;
            }
            case "whirlpool1": {
                this.sceneManager.changeToScene(WhirlpoolScene);
                break;
            }
            case "whirlpool2": {
                this.sceneManager.changeToScene(WhirlpoolScene2);
                break;
            }
        }
    }
}
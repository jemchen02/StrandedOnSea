import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainHW4Scene from "./MainHW4Scene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private controlLayer: Layer;
    private helpLayer: Layer;
    private background: Layer;

    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("gameTitle", "hw4_assets/sprites/gameTitle.png");
        this.load.image("controlsImage", "hw4_assets/sprites/controls.png");
        this.load.image("helpImage", "hw4_assets/sprites/help.png");
    }

    public startScene(){
        const center = this.viewport.getCenter();

        this.background = this.addUILayer("background");

        const background = this.add.sprite("backgroundBlue", "background");
        background.position.set(center.x, center.y);
        background.scale.set(1.1, 1.4);

        this.mainMenu = this.addUILayer("mainMenu");


        const gameTitle = this.add.sprite("gameTitle", "mainMenu");
        gameTitle.position.set(center.x, center.y - 200);
        gameTitle.scale.set(0.8, 0.8);


        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Start Game"});
        play.size.set(300, 75);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(300, 75);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "controls";

        const help = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Help"});
        help.size.set(300, 75);
        help.borderWidth = 2;
        help.borderColor = Color.WHITE;
        help.backgroundColor = Color.TRANSPARENT;
        help.onClickEventId = "help";

        const enter_code = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 200), text: "Enter Code"});
        enter_code.size.set(300, 75);
        enter_code.borderWidth = 2;
        enter_code.borderColor = Color.WHITE;
        enter_code.backgroundColor = Color.TRANSPARENT;
        enter_code.onClickEventId = "help";

        this.controlLayer = this.addUILayer("controls");

        const controlImage = this.add.sprite("controlsImage", "controls");
        controlImage.position.set(center.x, center.y);
        controlImage.scale.set(1.2, 1.2);

        const exitControls = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x + 400, center.y - 270), text: "X"});
        exitControls.size.set(50, 50);
        exitControls.borderWidth = 2;
        exitControls.borderColor = Color.WHITE;
        exitControls.backgroundColor = Color.TRANSPARENT;
        exitControls.onClickEventId = "exitControls";

        this.controlLayer.disable();

        this.helpLayer = this.addUILayer("help");

        const helpImage = this.add.sprite("helpImage", "help");
        helpImage.position.set(center.x, center.y);
        helpImage.scale.set(1, 1);

        const exitHelp = this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x + 400, center.y - 290), text: "X"});
        exitHelp.size.set(50, 50);
        exitHelp.borderWidth = 2;
        exitHelp.borderColor = Color.WHITE;
        exitHelp.backgroundColor = Color.TRANSPARENT;
        exitHelp.onClickEventId = "exitHelp";

        this.helpLayer.disable();

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("exitControls");
        this.receiver.subscribe("help");
        this.receiver.subscribe("exitHelp");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MainHW4Scene);
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
        }
    }
}
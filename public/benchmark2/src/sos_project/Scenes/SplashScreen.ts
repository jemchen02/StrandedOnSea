import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainMenu from "./MainMenu";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class SplashScreen extends Scene {
    // Layers, for multiple main menu screens
    private menu: Layer;

    public loadScene(){
        this.load.image("splashScreen", "hw4_assets/sprites/splashScreen.png");
    }

    public startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.menu = this.addUILayer("menu");

        const background = this.add.sprite("splashScreen", "menu");
        background.position.set(center.x, center.y);
        background.scale.set(4, 4);


        const play = this.add.uiElement(UIElementType.BUTTON, "menu", {position: new Vec2(center.x, center.y + 200), text: "Play"});
        play.size.set(300, 75);
        play.borderWidth = 2;
        play.borderColor = Color.TRANSPARENT;
        play.backgroundColor = Color.fromStringHex("00AC4F");
        play.onClickEventId = "play";

        // Subscribe to the button events
        this.receiver.subscribe("play");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
        }
    }
}
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainHW4Scene from "./MainHW4Scene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class MapScene extends Scene {
    // Layers, for multiple main menu screens
    private backgroundLayer: Layer;

    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("coinStorage", "hw4_assets/sprites/coinStorage.png");
    }

    public startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.backgroundLayer = this.addUILayer("background");

        const background = this.add.sprite("backgroundBlue", "background");
        background.position.set(center.x, center.y);
        background.scale.set(1.1, 1.4);

        const coinStorage = this.add.sprite("coinStorage", "background");
        coinStorage.position.set(center.x + 360, center.y - 400);
        coinStorage.scale.set(.7, .5);

        // Subscribe to the button events
        this.receiver.subscribe("ready");
    }
    public createButton(layer: string, position: Vec2, text: string, clickEvent: string, length: number) {
        const newButton = this.add.uiElement(UIElementType.BUTTON, layer, {position, text});
        newButton.size.set(length, 50);
        newButton.borderWidth = 3;
        newButton.borderColor = Color.YELLOW;
        newButton.backgroundColor = Color.fromStringHex("#005491");
        newButton.onClickEventId = clickEvent;
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "ready": {
                this.sceneManager.changeToScene(MainHW4Scene);
                break;
            }
        }
    }
}
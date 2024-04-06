import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";

export default class CoinHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* Event handling stuff */
    private receiver: Receiver;

    private staticLayer: string;

    private coinCount: Label;


    public constructor(scene: Scene, coinTabSprite: string, staticLayer: string, updatingHUDLayer: string, scaleX: number, scaleY: number) {

        this.scene = scene;
        this.staticLayer = staticLayer;
        const coinTab = this.scene.add.sprite(coinTabSprite, staticLayer);
        const x = 460*scaleX;
        const y = 40*scaleY;
        coinTab.position.set(x, y);
        coinTab.scale.set(.4*scaleX, .3*scaleY);
        this.coinCount = <Label>this.scene.add.uiElement(UIElementType.LABEL, updatingHUDLayer, {position: new Vec2(x + 5*scaleX, y - 5*scaleY), text: "800", fontSize: 30, textColor: Color.BLACK});
    }

    public update(deltaT: number): void {
        
    }

}
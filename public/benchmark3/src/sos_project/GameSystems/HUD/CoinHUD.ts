import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import { GameStateManager } from "../../GameStateManager";
export default class CoinHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* Event handling stuff */
    private receiver: Receiver;

    private staticLayer: string;

    private countLabel: Label;

    private coinCount: number;


    public constructor(scene: Scene, coinTabSprite: string, staticLayer: string, updatingHUDLayer: string, scaleX: number, scaleY: number) {

        this.scene = scene;
        this.staticLayer = staticLayer;
        this.coinCount = GameStateManager.get().money;
        const coinTab = this.scene.add.sprite(coinTabSprite, staticLayer);
        const x = 460*scaleX;
        const y = 40*scaleY;
        coinTab.position.set(x, y);
        coinTab.scale.set(.4*scaleX, .3*scaleY);
        this.countLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, updatingHUDLayer, {position: new Vec2(x + 5*scaleX, y - 5*scaleY), text: `${this.coinCount}`, fontSize: 30, textColor: Color.BLACK});
    }

    public update(deltaT: number): void {
        const actualCount = GameStateManager.get().money;
        const countDifference = this.coinCount - actualCount;
        if (countDifference > 500) {
            this.coinCount -= 100;
        } else if(countDifference > 30) {
            this.coinCount -= 20;
        } else if(countDifference > 0) {
            this.coinCount -= 1;
        } else if(countDifference < -500) {
            this.coinCount += 100;
        } else if (countDifference < -30) {
            this.coinCount += 20;
        }
        else if (countDifference < 0) {
            this.coinCount += 1;
        }
        this.countLabel.setText(`${this.coinCount}`);
    }

}
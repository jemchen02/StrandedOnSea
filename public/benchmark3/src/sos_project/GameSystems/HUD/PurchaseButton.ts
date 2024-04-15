import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import { GameStateManager } from "../../GameStateManager";
interface PurchaseOptions {
    layer: string, 
    position: Vec2, 
    text: string, 
    clickEvent: string,
    length: number,
    cost: number
}
export default class PurchaseButton implements Updateable{

    /* The scene */
    private scene: Scene;
    private button: Button;
    private cost: number;

    public constructor(scene: Scene, options: PurchaseOptions) {

        this.scene = scene;
        this.cost = options.cost;
        this.button = <Button>this.scene.add.uiElement(UIElementType.BUTTON, options.layer, {position: options.position, text: options.text});
        this.button.size.set(options.length, 50);
        this.button.borderRadius = 10;
        this.button.borderWidth = 2;
        this.button.backgroundColor = Color.fromStringHex("#005491");
        if(this.cost >= 0){
            this.button.textColor = Color.BLACK;
            this.button.borderColor = Color.BLUE;
        } else {
            this.button.borderColor = Color.YELLOW;
        }
        this.button.onClickEventId = options.clickEvent;
    }
    update(deltaT: number): void {
        if(this.cost >= 0) {
            if(GameStateManager.get().money >= this.cost) {
                this.button.backgroundColor = Color.GREEN;
            } else {
                this.button.backgroundColor = Color.RED;
            }
        }
        
    }
}
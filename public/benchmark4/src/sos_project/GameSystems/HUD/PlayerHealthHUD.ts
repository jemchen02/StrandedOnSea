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

export default class PlayerHealthHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* Event handling stuff */
    private receiver: Receiver;

    private staticLayer: string;
    private updateLayer: string;

    private healthLabel: Label;

    private healthBar: Label;
    
    private scaleX: number;
    private scaleY: number;

    public constructor(scene: Scene, healthTab: string, staticLayer: string, updateLayer:string, scaleX: number, scaleY: number) {
        this.scene = scene;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        const healthBar = this.scene.add.sprite(healthTab, staticLayer);
        healthBar.position.set(256*scaleX, 500*scaleY);
        healthBar.scale.set(.2*scaleX, .2*scaleY);

        this.healthBar = <Label>this.scene.add.uiElement(UIElementType.LABEL, updateLayer, {position: new Vec2(255*scaleX, 493.5*scaleY), text: ""});
        this.healthBar.size = new Vec2(350, 35);
        this.healthBar.backgroundColor = Color.GREEN;

        this.healthLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, updateLayer, {position: new Vec2(256*scaleX, 495*scaleY), text: `${Math.round(GameStateManager.get().health)}/${GameStateManager.get().maxHealth}`, fontSize: 30, textColor: Color.BLACK});
    }

    public update(deltaT: number): void {
        const fraction = GameStateManager.get().health / GameStateManager.get().maxHealth;
        if(fraction > .75) {
            this.healthBar.setBackgroundColor(Color.GREEN);
        } else if(fraction > .5) {
            this.healthBar.setBackgroundColor(Color.YELLOW);
        } else if(fraction > 0.25) {
            this.healthBar.setBackgroundColor(Color.ORANGE);
        } else {
            this.healthBar.setBackgroundColor(Color.RED);
        }
        this.healthBar.size.set(fraction * 350, 35);
        this.healthBar.position.set(this.scaleX * (255 - ((1-fraction) * 350 / 4)), 493.5*this.scaleY)
        this.healthLabel.setText(`${Math.round(GameStateManager.get().health)}/${GameStateManager.get().maxHealth}`);
    }

}
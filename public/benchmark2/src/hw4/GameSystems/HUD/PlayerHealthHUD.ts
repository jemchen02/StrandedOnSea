import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";

export default class PlayerHealthHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* Event handling stuff */
    private receiver: Receiver;

    private staticLayer: string;


    public constructor(scene: Scene, healthTab: string, staticLayer: string) {

        this.scene = scene;
        this.staticLayer = staticLayer;
        const healthBar = this.scene.add.sprite(healthTab, staticLayer);
        healthBar.position.set(256, 500);
        healthBar.scale.set(.2, .2);
    }

    public update(deltaT: number): void {
        
    }

}
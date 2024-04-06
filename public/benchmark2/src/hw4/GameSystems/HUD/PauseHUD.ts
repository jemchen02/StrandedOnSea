import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";

export default class PauseHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    private staticLayer: string;



    public constructor(scene: Scene, pauseSprite: string, staticLayer: string) {

        this.scene = scene;
        this.staticLayer = staticLayer;

        const pauseIcon = this.scene.add.sprite(pauseSprite, staticLayer);
        pauseIcon.position.set(30, 30);
        pauseIcon.scale.set(.3, .3);
    }
}
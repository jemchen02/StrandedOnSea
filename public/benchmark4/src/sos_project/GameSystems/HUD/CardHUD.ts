import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
export default class CardHUD {
    public constructor(scene: Scene, options: Record<string, any>) {
        const position = options.position;
        const layer = options.layer;
        const card = options.card;
        
        const image = scene.add.sprite(card.image, layer);
        image.position = position;
        image.scale.set(0.82, 0.82);

        
        const button = scene.add.uiElement(UIElementType.BUTTON, layer, {position, text: ""});
        button.size.set(310, 620);
        button.borderRadius = 2;
        button.borderColor = Color.TRANSPARENT;
        button.backgroundColor = Color.TRANSPARENT;
        button.onClickEventId = card.onclick;
    }

}
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
export default class CardHUD {
    public constructor(scene: Scene, options: Record<string, any>) {
        const start = options.start;
        const layer = options.layer;
        const card = options.card;

        scene.add.uiElement(UIElementType.LABEL, layer, {position: start, text: card.name, fontSize: 50, textColor: Color.BLACK});
        scene.add.uiElement(UIElementType.LABEL, layer, {position: new Vec2(start.x, start.y + 80), text: `Type: ${card.type}`, fontSize: 30, textColor: Color.BLACK});
        
        //const icon = scene.add.sprite(card.image, layer);
        //icon.position.set(start.x, start.y + 200);

        scene.add.uiElement(UIElementType.LABEL, layer, {position: new Vec2(start.x, start.y + 480), text: card.description, fontSize: 16, textColor: Color.BLACK});
        scene.add.uiElement(UIElementType.LABEL, layer, {position: new Vec2(start.x, start.y + 570), text: `Cost: ${card.cost}`, fontSize: 25, textColor: Color.BLACK});

        
        const button = scene.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(start.x, start.y + 280), text: ""});
        button.size.set(310, 680);
        button.borderRadius = 2;
        button.borderWidth = 0;
        button.backgroundColor = Color.TRANSPARENT;
        button.onClickEventId = card.onclick;
    }

}
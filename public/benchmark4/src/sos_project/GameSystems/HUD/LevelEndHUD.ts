import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
export default class LevelEndHUD {
    public constructor(scene: Scene, backgroundSprite: string, layer: string, levelWon: boolean, rewards: number, scaleX: number, scaleY: number) {

        const background = scene.add.sprite(backgroundSprite, layer);
        background.scale.set(.4*scaleX, .4*scaleY);
        background.position.set(250* scaleX, 250*scaleY);
        scene.add.uiElement(UIElementType.LABEL, layer, {position: new Vec2(250*scaleX, 200*scaleY), text: `Level ${levelWon ? "Complete!" : "Failed"}`, fontSize: 65, textColor: levelWon? Color.fromStringHex("#0f5900") : Color.RED});
        if(levelWon) {
            scene.add.uiElement(UIElementType.LABEL, layer, {position: new Vec2(250*scaleX, 250*scaleY), text: `Reward: ${rewards}`, fontSize: 45, textColor: Color.fromStringHex("#0f5900")});
        }
        const button = <Button>scene.add.uiElement(UIElementType.BUTTON, layer, {position: new Vec2(250 * scaleX,300 * scaleY), text: "Back to Map"});
        button.size.set(200, 60);
        button.borderRadius = 30;
        button.backgroundColor = Color.fromStringHex("#94fdff");
        button.textColor = Color.BLACK;
        button.onClickEventId = "back";
    }
}
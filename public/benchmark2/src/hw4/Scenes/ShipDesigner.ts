import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MapScene from "./MapScene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class ShipDesigner extends Scene {
    // Layers, for multiple main menu screens
    private labelLayer: Layer;
    private backgroundLayer: Layer;
    private buttonLayer: Layer;

    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("gameLogo", "hw4_assets/sprites/gameLogo.png");
        this.load.image("coinStorage", "hw4_assets/sprites/coinStorage.png");
    }

    public startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.backgroundLayer = this.addUILayer("background");

        const background = this.add.sprite("backgroundBlue", "background");
        background.position.set(center.x, center.y);
        background.scale.set(1.1, 1.4);

        const shipImage = this.add.sprite("gameLogo", "background");
        shipImage.position.set(center.x - 280, center.y - 260);
        shipImage.scale.set(.7, .7);

        const coinStorage = this.add.sprite("coinStorage", "background");
        coinStorage.position.set(center.x + 360, center.y - 400);
        coinStorage.scale.set(.7, .5);

        this.buttonLayer = this.addUILayer("buttons");
        this.labelLayer = this.addUILayer("labels");
        this.add.uiElement(UIElementType.LABEL, "labels", {position: new Vec2(center.x + 380, center.y - 410), text: "800", fontSize: 30, textColor: Color.BLACK});

        this.createButton("buttons", new Vec2(center.x, center.y + 400), "Ready", "ready", 150);

        this.createButton("buttons", new Vec2(center.x + 50, center.y - 300), "Wood", "buyWood", 150);
        this.createLabels("labels", new Vec2(center.x + 50, center.y - 240), "Owned: Yes", "Cost: Free", "weak, fast", true);
        this.createButton("buttons", new Vec2(center.x + 220, center.y - 300), "Fiberglass", "buyFiber", 150);
        this.createLabels("labels", new Vec2(center.x + 220, center.y - 240), "Owned: No", "Cost: 500", "medium", true);
        this.createButton("buttons", new Vec2(center.x + 390, center.y - 300), "Metal", "buyMetal", 150);
        this.createLabels("labels", new Vec2(center.x + 390, center.y - 240), "Owned: No", "Cost: 1000", "hardened, slow", true);

        this.createButton("buttons", new Vec2(center.x + 135, center.y - 50), "Cannon", "buyCannon", 150);
        this.createLabels("labels", new Vec2(center.x + 135, center.y + 10), "Owned: 0", "Cost: 5", "Low damage", true);
        this.createButton("buttons", new Vec2(center.x + 305, center.y - 50), "Torpedo", "buyTorpedo", 150);
        this.createLabels("labels", new Vec2(center.x + 305, center.y + 10), "Owned: 0", "Cost: 50", "High damage", true);

        this.createButton("buttons", new Vec2(center.x + 50, center.y + 200), "Oars", "buyOars", 150);
        this.createLabels("labels", new Vec2(center.x + 50, center.y + 260), "Owned: Yes", "Cost: Free", "Slow", true);
        this.createButton("buttons", new Vec2(center.x + 220, center.y + 200), "Sail", "buySail", 150);
        this.createLabels("labels", new Vec2(center.x + 220, center.y + 260), "Owned: No", "Cost: 300", "Medium", true);
        this.createButton("buttons", new Vec2(center.x + 390, center.y + 200), "Motor", "buyMotor", 150);
        this.createLabels("labels", new Vec2(center.x + 390, center.y + 260), "Owned: No", "Cost: 600", "Fast", true);

        this.createButton("buttons", new Vec2(center.x - 400, center.y), "Repair", "buyRepair", 200);
        this.createLabels("labels", new Vec2(center.x - 450, center.y + 50), "Owned: 0", "Cost: 50", "Heals ship", false);
        this.createButton("buttons", new Vec2(center.x - 400, center.y + 100), "Pump", "buyPump", 200);
        this.createLabels("labels", new Vec2(center.x - 450, center.y + 150), "Owned: No", "Cost: 1000", "Reduces DPS taken", false);
        this.createButton("buttons", new Vec2(center.x - 400, center.y + 200), "Crow's Nest", "buyCrow", 200);
        this.createLabels("labels", new Vec2(center.x - 450, center.y + 250), "Owned: No", "Cost: 800", "See further", false);
        this.createButton("buttons", new Vec2(center.x - 400, center.y + 300), "Radar", "buyRadar", 200);
        this.createLabels("labels", new Vec2(center.x - 450, center.y + 350), "Owned: No", "Cost: 2000", "Reveals map", false);

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
    public createLabels(layer: string, position: Vec2, owned: string, cost: string, use: string, vertical: boolean) {
        this.add.uiElement(UIElementType.LABEL, layer, {position, text: owned, fontSize: 18, textColor: Color.WHITE});
        let costPos = new Vec2(position.x + 100, position.y);
        let usePos = new Vec2(position.x + 260, position.y);
        if (vertical) {
            costPos = new Vec2(position.x, position.y + 45);
            usePos = new Vec2(position.x, position.y + 90);
        }
        this.add.uiElement(UIElementType.LABEL, layer, {position: costPos, text: cost, fontSize: 18, textColor: Color.WHITE});
        this.add.uiElement(UIElementType.LABEL, layer, {position: usePos, text: use, fontSize: 18, textColor: Color.WHITE});
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "ready": {
                this.sceneManager.changeToScene(MapScene);
                break;
            }
        }
    }
}
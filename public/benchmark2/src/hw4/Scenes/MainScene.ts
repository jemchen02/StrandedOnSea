import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainHW4Scene from "./MainHW4Scene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class MainScene extends Scene {
    // Layers, for multiple main menu screens
    private backgroundLayer: Layer;
    private hudLayer: Layer;
    private mapLayer: Layer;
    private mapOverlay: Layer;
    private levelLayer: Layer;
    private shipLayer: Layer;
    
    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("coinStorage", "hw4_assets/sprites/coinStorage.png");
        this.load.image("gameLogo", "hw4_assets/sprites/gameLogo.png");
        this.load.image("inventoryTab", "hw4_assets/sprites/inventoryTab.png");
        this.load.image("pause", "hw4_assets/sprites/pause.png");
        this.load.image("healthTab", "hw4_assets/sprites/healthTab.png");

        this.load.image("playerIcon", "hw4_assets/map/playerIcon.png");
        this.load.image("hidden", "hw4_assets/map/hidden.png");
        this.load.image("storm", "hw4_assets/map/storm.png");
        this.load.image("hostile", "hw4_assets/map/hostile.png");
        this.load.image("shipwreck", "hw4_assets/map/shipwreck.png");
        this.load.image("whirlpool", "hw4_assets/map/whirlpool.png");
        this.load.image("land", "hw4_assets/map/land.png");
    }

    public startScene(){
        this.initBackground();
        this.initMap();
        this.initHUD();
        this.initShip();
        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("ready");
    }
    private initBackground() {
        const center = this.viewport.getCenter();

        this.backgroundLayer = this.addUILayer("background");

        const background = this.add.sprite("backgroundBlue", "background");
        background.position.set(center.x, center.y);
        background.scale.set(1.1, 1.4);
    }
    private initMap() {
        const center = this.viewport.getCenter();

        const mapInit = [[4, 1, 3, 2, 1], [1, 3, 2, 1, 0], [1, 1, 2, 3, 2], [4, 1, 2, 2, 2], [0, 3, 1, 1, 4]];
        const n = mapInit.length;
        const m = mapInit[0].length;

        const overlayInit = [];
        for(let i = 0; i < n; i++) {
            overlayInit[i] = [];
            for(let j = 0; j < m; j++) {
                if(i == 0 && j == 0) {
                    overlayInit[i][j] = 1;
                } else if ((i == 0 && j == 1) || (i == 1 && j == 0)) {
                    overlayInit[i][j] = 0;
                } else if (mapInit[i][j] == 0) {
                    overlayInit[i][j] = 0;
                } else {
                    overlayInit[i][j] = 3;
                }
            }
        }

        this.mapLayer = this.addUILayer("map");
        this.mapLayer.disable();
        this.mapOverlay = this.addUILayer("overlay");
        this.mapOverlay.disable();

        for(let i = 0; i < n; i++) {
            let y = center.y + 120 * (n - 1) / 2 - 120 * i;
            for(let j = 0; j < m; j++) {
                let x = center.x - 120 * (m - 1) / 2 + 120 * j;
                this.createMapIcon(x, y, mapInit[i][j]);
                this.createOverlayIcon(x, y, overlayInit[i][j]);
            }
        }
    }
    private initHUD() {
        const center = this.viewport.getCenter();
        this.hudLayer = this.addUILayer("hud");
        this.hudLayer.disable();

        const coinStorage = this.add.sprite("coinStorage", "hud");
        coinStorage.position.set(center.x + 360, center.y - 400);
        coinStorage.scale.set(.7, .5);
        this.add.uiElement(UIElementType.LABEL, "hud", {position: new Vec2(center.x + 380, center.y - 410), text: "800", fontSize: 30, textColor: Color.BLACK});

        const pauseButton = this.add.sprite("pause", "hud");
        pauseButton.position.set(center.x - 450, center.y - 450);
        pauseButton.scale.set(.6, .6);

        const inventoryTab = this.add.sprite("inventoryTab", "hud");
        inventoryTab.position.set(center.x - 425, center.y);
        inventoryTab.scale.set(.6, .6);

        const healthTab = this.add.sprite("healthTab", "hud");
        healthTab.position.set(center.x, center.y + 460);
        healthTab.scale.set(.4, .4);
    }
    private initShip() {
        const center = this.viewport.getCenter();

        this.shipLayer = this.addUILayer("ship");

        const shipImage = this.add.sprite("gameLogo", "ship");
        shipImage.position.set(center.x - 280, center.y - 260);
        shipImage.scale.set(.7, .7);

        const coinStorage = this.add.sprite("coinStorage", "ship");
        coinStorage.position.set(center.x + 360, center.y - 400);
        coinStorage.scale.set(.7, .5);

        this.add.uiElement(UIElementType.LABEL, "ship", {position: new Vec2(center.x + 380, center.y - 410), text: "800", fontSize: 30, textColor: Color.BLACK});

        this.createButton("ship", new Vec2(center.x, center.y + 400), "Ready", "ready", 150, "design");

        this.createButton("ship", new Vec2(center.x + 50, center.y - 300), "Wood", "buyWood", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 50, center.y - 240), "Owned: Yes", "Cost: Free", "weak, fast", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y - 300), "Fiberglass", "buyFiber", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 220, center.y - 240), "Owned: No", "Cost: 500", "medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y - 300), "Metal", "buyMetal", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 390, center.y - 240), "Owned: No", "Cost: 1000", "hardened, slow", true);

        this.createButton("ship", new Vec2(center.x + 135, center.y - 50), "Cannon", "buyCannon", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 135, center.y + 10), "Owned: 0", "Cost: 5", "Low damage", true);
        this.createButton("ship", new Vec2(center.x + 305, center.y - 50), "Torpedo", "buyTorpedo", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 305, center.y + 10), "Owned: 0", "Cost: 50", "High damage", true);

        this.createButton("ship", new Vec2(center.x + 50, center.y + 200), "Oars", "buyOars", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 50, center.y + 260), "Owned: Yes", "Cost: Free", "Slow", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y + 200), "Sail", "buySail", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 220, center.y + 260), "Owned: No", "Cost: 300", "Medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y + 200), "Motor", "buyMotor", 150, "design");
        this.createLabels("ship", new Vec2(center.x + 390, center.y + 260), "Owned: No", "Cost: 600", "Fast", true);

        this.createButton("ship", new Vec2(center.x - 400, center.y), "Repair", "buyRepair", 200, "design");
        this.createLabels("ship", new Vec2(center.x - 450, center.y + 50), "Owned: 0", "Cost: 50", "Heals ship", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 100), "Pump", "buyPump", 200, "design");
        this.createLabels("ship", new Vec2(center.x - 450, center.y + 150), "Owned: No", "Cost: 1000", "Reduces DPS taken", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 200), "Crow's Nest", "buyCrow", 200, "design");
        this.createLabels("ship", new Vec2(center.x - 450, center.y + 250), "Owned: No", "Cost: 800", "See further", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 300), "Radar", "buyRadar", 200, "design");
        this.createLabels("ship", new Vec2(center.x - 450, center.y + 350), "Owned: No", "Cost: 2000", "Reveals map", false);
    }
    private createButton(layer: string, position: Vec2, text: string, clickEvent: string, length: number, bType: string) {
        const newButton = this.add.uiElement(UIElementType.BUTTON, layer, {position, text});
        if (bType == "design") {
            newButton.size.set(length, 50);
            newButton.borderWidth = 3;
            newButton.borderColor = Color.YELLOW;
            newButton.backgroundColor = Color.fromStringHex("#005491");
        } else {
            newButton.size.set(length, 100);
            newButton.borderColor = Color.WHITE;
            newButton.backgroundColor = Color.TRANSPARENT;
        }
        if(clickEvent) {
            newButton.onClickEventId = clickEvent;
        }
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
    private createMapIcon(x: number, y: number, iconType: number) {
        switch(iconType) {
            case 0:
                break;
            case 1:
                this.createButton("map", new Vec2(x, y), "", "play", 100, "mapButton");
                const hostile = this.add.sprite("hostile", "map");
                hostile.position.set(x, y);
                break;
            case 2:
                this.createButton("map", new Vec2(x, y), "", "play", 100, "mapButton");
                const shipwreck = this.add.sprite("shipwreck", "map");
                shipwreck.position.set(x, y);
                break;
            case 3:
                this.createButton("map", new Vec2(x, y), "", "play", 100, "mapButton");
                const whirlpool = this.add.sprite("whirlpool", "map");
                whirlpool.position.set(x, y);
                break;
            case 4:
                this.createButton("map", new Vec2(x, y), "", "play", 100, "mapButton");
                const land = this.add.sprite("land", "map");
                land.position.set(x, y);
                break;
        }
    }
    private createOverlayIcon(x: number, y: number, iconType: number) {
        switch(iconType) {
            case 0:
                break;
            case 1:
                const playerIcon = this.add.sprite("playerIcon", "map");
                playerIcon.position.set(x, y);
                break;
            case 2:
                const storm = this.add.sprite("storm", "map");
                storm.position.set(x, y);
                break;
            case 3:
                const hidden = this.add.sprite("hidden", "map");
                hidden.position.set(x, y);
                break;
        }
    }
    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                //uncomment this to use MainHW4Scene
                //this.sceneManager.changeToScene(MainHW4Scene);
                this.mapLayer.disable();
                break;
            }
            case "ready": {
                this.shipLayer.disable();
                this.mapLayer.enable();
                this.mapOverlay.enable();
                this.hudLayer.enable();
            }
        }
    }
}
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import BattleScene from "./BattleScene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import PlayerHealthHUD from "../GameSystems/HUD/PlayerHealthHUD";
import CoinHUD from "../GameSystems/HUD/CoinHUD";
import { GameStateManager } from "../GameStateManager";
import { OverlayStatus, SOSLevel } from "../SOSLevel";
import { Costs } from "../GameConstants";

export default class MapScene extends Scene {
    // Layers, for multiple main menu screens
    private backgroundLayer: Layer;
    private staticHUD: Layer;
    private updateHUD: Layer;
    private mapLayer: Layer;
    private mapOverlay: Layer;
    private shipLayer: Layer;
    
    private healthHUD: PlayerHealthHUD;
    private coinHUD: CoinHUD;

    private hudLabels: Map<String, Label>;
    private mapSubscriptions: string[];
    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("coinTab", "hw4_assets/sprites/coinStorage.png");
        this.load.image("gameLogo", "hw4_assets/sprites/gameLogo.png");
        this.load.image("inventoryTab", "hw4_assets/sprites/inventoryTab.png");
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
        this.mapSubscriptions = [];
        this.initBackground();
        this.initMap();
        this.initHUD();
        this.initShip();
        // Subscribe to the button events
        for (let subevent of this.mapSubscriptions) {
            this.receiver.subscribe(subevent);
        }
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

        const mapInit : SOSLevel[][] = GameStateManager.get().gameMap;
        let n = mapInit.length;
        let m = mapInit[0].length;
        const overlayInit : OverlayStatus[][] = GameStateManager.get().mapOverlays;


        this.mapLayer = this.addUILayer("map");
        this.mapLayer.disable();
        this.mapOverlay = this.addUILayer("overlay");
        this.mapOverlay.disable();

        for(let i = 0; i < n; i++) {
            let y = center.y + 120 * (n - 1) / 2 - 120 * i;
            for(let j = 0; j < m; j++) {
                let x = center.x - 120 * (m - 1) / 2 + 120 * j;

                let iconType : number = GameStateManager.get().gameMap[i][j].iconType;
                this.createMapIcon(x, y, iconType);

                let overlay : OverlayStatus = GameStateManager.get().mapOverlays[i][j];
                this.createOverlayIcon(x, y, overlay, i, j);
            }
        }
    }
    private initHUD() {
        this.staticHUD = this.addUILayer("staticHUD");
        this.updateHUD = this.addUILayer("updateHUD");
        this.hudLabels = new Map<String, Label>;
        this.healthHUD = new PlayerHealthHUD(this, "healthTab", "staticHUD", "updateHUD", 2, 2);
        this.coinHUD = new CoinHUD(this, "coinTab", "staticHUD", "updateHUD", 2, 2);
    }
    private initShip() {
        const center = this.viewport.getCenter();

        this.shipLayer = this.addUILayer("ship");

        const shipImage = this.add.sprite("gameLogo", "ship");
        shipImage.position.set(center.x - 280, center.y - 260);
        shipImage.scale.set(.7, .7);

        this.createButton("ship", new Vec2(center.x, center.y + 400), "Ready", "ready", 150, "design");

        this.createButton("ship", new Vec2(center.x + 50, center.y - 300), "Wood", "buyWood", 150, "design");
        this.createLabels("ship", "Wood", new Vec2(center.x + 50, center.y - 240), "Owned: Yes", Costs.WOOD_COST, "weak, fast", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y - 300), "Fiberglass", "buyFiber", 150, "design");
        this.createLabels("ship", "Fiberglass", new Vec2(center.x + 220, center.y - 240), "Owned: No", Costs.FIBER_COST, "medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y - 300), "Metal", "buyMetal", 150, "design");
        this.createLabels("ship", "Metal", new Vec2(center.x + 390, center.y - 240), "Owned: No", Costs.METAL_COST, "hardened, slow", true);

        this.createButton("ship", new Vec2(center.x + 135, center.y - 50), "Cannon", "buyCannon", 150, "design");
        this.createLabels("ship", "Cannon", new Vec2(center.x + 135, center.y + 10), "Owned: 0", Costs.CANNON_COST, "Low damage", true);
        this.createButton("ship", new Vec2(center.x + 305, center.y - 50), "Torpedo", "buyTorpedo", 150, "design");
        this.createLabels("ship", "Torpedo", new Vec2(center.x + 305, center.y + 10), "Owned: 0", Costs.TORPEDO_COST, "High damage", true);

        this.createButton("ship", new Vec2(center.x + 50, center.y + 200), "Oars", "buyOars", 150, "design");
        this.createLabels("ship", "Oars", new Vec2(center.x + 50, center.y + 260), "Owned: Yes", Costs.OAR_COST, "Slow", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y + 200), "Sail", "buySail", 150, "design");
        this.createLabels("ship", "Sail", new Vec2(center.x + 220, center.y + 260), "Owned: No", Costs.SAIL_COST, "Medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y + 200), "Motor", "buyMotor", 150, "design");
        this.createLabels("ship", "Motor", new Vec2(center.x + 390, center.y + 260), "Owned: No", Costs.MOTOR_COST, "Fast", true);

        this.createButton("ship", new Vec2(center.x - 400, center.y), "Repair", "buyRepair", 200, "design");
        this.createLabels("ship", "Repair", new Vec2(center.x - 450, center.y + 50), "Owned: 0", Costs.REPAIR_COST, "Heals ship", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 100), "Pump", "buyPump", 200, "design");
        this.createLabels("ship", "Pump", new Vec2(center.x - 450, center.y + 150), "Owned: No", Costs.PUMP_COST, "Reduces DPS taken", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 200), "Crow's Nest", "buyCrow", 200, "design");
        this.createLabels("ship", "Crow's Nest", new Vec2(center.x - 450, center.y + 250), "Owned: No", Costs.CROW_COST, "See further", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 300), "Radar", "buyRadar", 200, "design");
        this.createLabels("ship", "Radar", new Vec2(center.x - 450, center.y + 350), "Owned: No", Costs.RADAR_COST, "Reveals map", false);
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
        this.mapSubscriptions.push(clickEvent);
    }
    public createLabels(layer: string, item: string, position: Vec2, owned: string, cost: number, use: string, vertical: boolean) {
        const ownedLabel = <Label>this.add.uiElement(UIElementType.LABEL, layer, {position, text: owned, fontSize: 18, textColor: Color.fromStringHex("FFFCBC")});
        this.hudLabels.set(item, ownedLabel);
        let costPos = new Vec2(position.x + 100, position.y);
        let usePos = new Vec2(position.x + 260, position.y);
        if (vertical) {
            costPos = new Vec2(position.x, position.y + 45);
            usePos = new Vec2(position.x, position.y + 90);
        }
        this.add.uiElement(UIElementType.LABEL, layer, {position: costPos, text: `Cost: ${cost || 'Free'}`, fontSize: 18, textColor: Color.fromStringHex("FFFCBC")});
        this.add.uiElement(UIElementType.LABEL, layer, {position: usePos, text: use, fontSize: 18, textColor: Color.fromStringHex("FFFCBC")});
    }
    private createMapIcon(x: number, y: number, iconType: number) {
        switch(iconType) {
            case 0:
                break;
            case 1:
                this.createButton("map", new Vec2(x, y), "", "playBattle", 100, "mapButton");
                const hostile = this.add.sprite("hostile", "map");
                hostile.position.set(x, y);
                break;
            case 2:
                this.createButton("map", new Vec2(x, y), "", "playShipwreck", 100, "mapButton");
                const shipwreck = this.add.sprite("shipwreck", "map");
                shipwreck.position.set(x, y);
                break;
            case 3:
                this.createButton("map", new Vec2(x, y), "", "playWhirlpool", 100, "mapButton");
                const whirlpool = this.add.sprite("whirlpool", "map");
                whirlpool.position.set(x, y);
                break;
            case 4:
                this.createButton("map", new Vec2(x, y), "", "playLand", 100, "mapButton");
                const land = this.add.sprite("land", "map");
                land.position.set(x, y);
                break;
        }
    }
    private createOverlayIcon(x: number, y: number, overlay : OverlayStatus, i, j) {
        if(GameStateManager.get().playerLocation.x == i && GameStateManager.get().playerLocation.y == j){
            const playerIcon = this.add.sprite("playerIcon", "map");
            playerIcon.position.set(x, y);
        }
        else if(overlay.isStorm){
            const storm = this.add.sprite("storm", "map");
            storm.position.set(x, y);
        }
        else if(overlay.isFog){
            const hidden = this.add.sprite("hidden", "map");
            hidden.position.set(x, y);
        }
    }
    public updateScene(deltaT: number){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.coinHUD.update(deltaT);
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "playBattle": {
                this.sceneManager.changeToScene(BattleScene);
                //this.mapLayer.disable();
                break;
            }
            case "ready": {
                this.shipLayer.disable();
                this.mapLayer.enable();
                this.mapOverlay.enable();
                break;
            }
            case "buyWood": {
                if(GameStateManager.get().buyWood()) {
                    this.hudLabels.get("Wood").setText("Owned: Yes");
                }
                break;
            }
            case "buyFiber": {
                if(GameStateManager.get().buyFiber()) {
                    this.hudLabels.get("Fiberglass").setText("Owned: Yes");
                }
                break;
            }
            case "buyMetal": {
                if(GameStateManager.get().buyMetal()) {
                    this.hudLabels.get("Metal").setText("Owned: Yes");
                }
                break;
            }
            case "buyCannon": {
                if(GameStateManager.get().buyCannon()) {
                    this.hudLabels.get("Cannon").setText(`Owned: ${GameStateManager.get().numCannon}`);
                }
                break;
            }
            case "buyTorpedo": {
                if(GameStateManager.get().buyTorpedo()) {
                    this.hudLabels.get("Torpedo").setText(`Owned: ${GameStateManager.get().numTorpedo}`);
                }
                break;
            }
            case "buyRepair": {
                if(GameStateManager.get().buyRepair()) {
                    this.hudLabels.get("Repair").setText(`Owned: ${GameStateManager.get().numRepairs}`);
                }
                break;
            }
            case "buyOars": {
                if(GameStateManager.get().buyOar()) {
                    this.hudLabels.get("Oars").setText("Owned: Yes");
                }
                break;
            }
            case "buySail": {
                if(GameStateManager.get().buySail()) {
                    this.hudLabels.get("Sail").setText("Owned: Yes");
                }
                break;
            }
            case "buyMotor": {
                if(GameStateManager.get().buyMotor()) {
                    this.hudLabels.get("Motor").setText("Owned: Yes");
                }
                break;
            }
            case "buyPump": {
                if(GameStateManager.get().buyPump()) {
                    this.hudLabels.get("Pump").setText("Owned: Yes");
                }
                break;
            }
            case "buyCrow": {
                if(GameStateManager.get().buyCrow()) {
                    this.hudLabels.get("Crow's Nest").setText("Owned: Yes");
                }
                break;
            }
            case "buyRadar": {
                if(GameStateManager.get().buyRadar()) {
                    this.hudLabels.get("Radar").setText("Owned: Yes");
                }
                break;
            }
        }
    }
}
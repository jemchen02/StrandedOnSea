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
import { GameStateManager, MovementType, ShipType } from "../GameStateManager";
import { OverlayStatus, SOSLevel } from "../SOSLevel";
import { Costs } from "../GameConstants";
import HostileScene from "./HostileScene";
import WhirlpoolScene from "./WhirlpoolScene";
import ShipwreckScene from "./ShipwreckScene";
import ObstacleScene from "./ObstacleScene";
import PurchaseButton from "../GameSystems/HUD/PurchaseButton";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { ShipAnimationType } from "../AI/ShipStates/ShipState";

export default class MapScene extends Scene {
    // Layers, for multiple main menu screens
    private player_wood: AnimatedSprite;
    private player_fiber: AnimatedSprite;
    private player_metal: AnimatedSprite;
    private player_ships: AnimatedSprite[];
    private backgroundLayer: Layer;
    private staticHUD: Layer;
    private updateHUD: Layer;
    private mapLayer: Layer;
    private mapOverlay: Layer;
    private shipLayer: Layer;
    
    private healthHUD: PlayerHealthHUD;
    private coinHUD: CoinHUD;

    private hudLabels: Map<String, Label>;
    private shopButtons: Map<String, PurchaseButton>;
    private mapSubscriptions: string[];
    public loadScene(){
        this.load.spritesheet("player_wood", "sos_assets/spritesheets/player_wood.json");
        this.load.spritesheet("player_fiber", "sos_assets/spritesheets/player_fiberglass.json");
        this.load.spritesheet("player_metal", "sos_assets/spritesheets/player_metal.json");

        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("coinTab", "hw4_assets/sprites/coinStorage.png");
        this.load.image("water", "hw4_assets/sprites/water.png");
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
        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(new Vec2(512, 512));
        this.mapSubscriptions = [];
        this.shopButtons = new Map<String, PurchaseButton>;
        this.initBackground();
        this.initMap();
        this.initHUD();
        this.initShip();
        if(!GameStateManager.get().onLand()) {
            this.shipLayer.disable();
            this.mapLayer.enable();
            this.mapOverlay.enable();
        }
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
                this.createMapIcon(x, y, iconType, i, j);

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
    private setShip(shipType: ShipType) : void{
        for(let ship of this.player_ships) {
            ship.visible = false;
        }
        switch(shipType) {
            case ShipType.WOOD:
                this.player_wood.visible = true;
                break;
            case ShipType.FIBERGLASS:
                this.player_fiber.visible = true;
                break;
            case ShipType.METAL:
                this.player_metal.visible = true;
                break;
        }
    }
    private setAnimation(movement: MovementType) {
        const movementType = movement == MovementType.OAR? "" : "SAIL_";
        for(let ship of this.player_ships) {
            ship.animation.play(movementType + ShipAnimationType.MOVE_FORWARD);
        }
    }
    private initShip() : void{
        const center = this.viewport.getCenter();

        this.shipLayer = this.addUILayer("ship");

        const shipImage = this.add.sprite("water", "ship");
        shipImage.position.set(220, 220);
        shipImage.scale.set(4.5, 4.5);

        this.player_ships = [];

        this.player_wood = this.add.animatedSprite(AnimatedSprite, "player_wood", "ship");
        this.player_ships.push(this.player_wood);
        this.player_fiber = this.add.animatedSprite(AnimatedSprite, "player_fiber", "ship");
        this.player_ships.push(this.player_fiber);
        this.player_metal = this.add.animatedSprite(AnimatedSprite, "player_metal", "ship");
        this.player_ships.push(this.player_metal);

        for(let ship of this.player_ships) {
            ship.visible = false;
            ship.position.set(220, 220);
            ship.scale.set(6,6);
        }
        this.setShip(GameStateManager.get().shipType);
        this.setAnimation(GameStateManager.get().movementType);
        

        this.createButton("ship", new Vec2(center.x, center.y + 400), "Ready", "ready", 150, "design", -1, false);

        this.createButton("ship", new Vec2(center.x + 50, center.y - 300), "Wood", "buyWood", 150, "design", Costs.WOOD_COST, true);
        this.createLabels("ship", "Wood", new Vec2(center.x + 50, center.y - 240), "Owned: Yes", Costs.WOOD_COST, "weak, fast", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y - 300), "Fiberglass", "buyFiber", 150, "design", Costs.FIBER_COST, GameStateManager.get().ownedShips.includes(ShipType.FIBERGLASS));
        this.createLabels("ship", "Fiberglass", new Vec2(center.x + 220, center.y - 240), `Owned: ${GameStateManager.get().ownedShips.includes(ShipType.FIBERGLASS) ? "Yes" : "No"}`, Costs.FIBER_COST, "medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y - 300), "Metal", "buyMetal", 150, "design", Costs.METAL_COST, GameStateManager.get().ownedShips.includes(ShipType.METAL));
        this.createLabels("ship", "Metal", new Vec2(center.x + 390, center.y - 240), `Owned: ${GameStateManager.get().ownedShips.includes(ShipType.METAL) ? "Yes" : "No"}`, Costs.METAL_COST, "hardened, slow", true);

        this.createButton("ship", new Vec2(center.x + 135, center.y - 50), "Cannon", "buyCannon", 150, "design", Costs.CANNON_COST, false);
        this.createLabels("ship", "Cannon", new Vec2(center.x + 135, center.y + 10), `Owned: ${GameStateManager.get().numCannon}`, Costs.CANNON_COST, "Low damage", true);
        this.createButton("ship", new Vec2(center.x + 305, center.y - 50), "Torpedo", "buyTorpedo", 150, "design", Costs.TORPEDO_COST, false);
        this.createLabels("ship", "Torpedo", new Vec2(center.x + 305, center.y + 10), `Owned: ${GameStateManager.get().numTorpedo}`, Costs.TORPEDO_COST, "High damage", true);

        this.createButton("ship", new Vec2(center.x + 50, center.y + 200), "Oars", "buyOars", 150, "design", Costs.OAR_COST, true);
        this.createLabels("ship", "Oars", new Vec2(center.x + 50, center.y + 260), "Owned: Yes", Costs.OAR_COST, "Slow", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y + 200), "Sail", "buySail", 150, "design", Costs.SAIL_COST, GameStateManager.get().ownedMovements.includes(MovementType.SAIL));
        this.createLabels("ship", "Sail", new Vec2(center.x + 220, center.y + 260), `Owned: ${GameStateManager.get().ownedMovements.includes(MovementType.SAIL) ? "Yes" : "No"}`, Costs.SAIL_COST, "Medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y + 200), "Motor", "buyMotor", 150, "design", Costs.MOTOR_COST, GameStateManager.get().ownedMovements.includes(MovementType.MOTOR));
        this.createLabels("ship", "Motor", new Vec2(center.x + 390, center.y + 260), `Owned: ${GameStateManager.get().ownedMovements.includes(MovementType.MOTOR) ? "Yes" : "No"}`, Costs.MOTOR_COST, "Fast", true);

        this.createButton("ship", new Vec2(center.x - 400, center.y), "Repair", "buyRepair", 200, "design", Costs.REPAIR_COST, false);
        this.createLabels("ship", "Repair", new Vec2(center.x - 450, center.y + 50), `Owned: ${GameStateManager.get().numRepairs}`, Costs.REPAIR_COST, "Heals ship", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 100), "Pump", "buyPump", 200, "design", Costs.PUMP_COST, GameStateManager.get().hasPump);
        this.createLabels("ship", "Pump", new Vec2(center.x - 450, center.y + 150), `Owned: ${GameStateManager.get().hasPump ? "Yes" : "No"}`, Costs.PUMP_COST, "Reduces DPS taken", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 200), "Crow's Nest", "buyCrow", 200, "design", Costs.CROW_COST, GameStateManager.get().hasCrowsNest);
        this.createLabels("ship", "Crow's Nest", new Vec2(center.x - 450, center.y + 250), `Owned: ${GameStateManager.get().hasCrowsNest ? "Yes" : "No"}`, Costs.CROW_COST, "See further", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 300), "Radar", "buyRadar", 200, "design", Costs.RADAR_COST, GameStateManager.get().hasRadar);
        this.createLabels("ship", "Radar", new Vec2(center.x - 450, center.y + 350), `Owned: ${GameStateManager.get().hasRadar ? "Yes" : "No"}`, Costs.RADAR_COST, "Reveals map", false);
    }
    private createButton(layer: string, position: Vec2, text: string, clickEvent: string, length: number, bType: string, cost: number, owned: boolean) {
        if (bType == "design") {
            const newButton = new PurchaseButton(this, {layer, position, text, clickEvent, length, cost, owned});
            this.shopButtons.set(text, newButton);
        } else {
            const newButton = this.add.uiElement(UIElementType.BUTTON, layer, {position, text});
            newButton.size.set(length, 100);
            newButton.borderColor = Color.WHITE;
            newButton.backgroundColor = Color.TRANSPARENT;
            if(clickEvent) {
                newButton.onClickEventId = clickEvent;
            }
        }
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
    private createMapIcon(x: number, y: number, iconType: number, i: number, j: number) {

        let coordString = "{" + i + "," + j + "}";

        switch(iconType) {
            case 0:
                break;
            case 1:
                this.createButton("map", new Vec2(x, y), "", coordString + "playBattle", 100, "mapButton", 0, false);
                const hostile = this.add.sprite("hostile", "map");
                hostile.position.set(x, y);
                break;
            case 2:
                this.createButton("map", new Vec2(x, y), "", coordString + "playShipwreck", 100, "mapButton", 0, false);
                const shipwreck = this.add.sprite("shipwreck", "map");
                shipwreck.position.set(x, y);
                break;
            case 3:
                this.createButton("map", new Vec2(x, y), "", coordString + "playWhirlpool", 100, "mapButton", 0, false);
                const whirlpool = this.add.sprite("whirlpool", "map");
                whirlpool.position.set(x, y);
                break;
            case 4:
                this.createButton("map", new Vec2(x, y), "", coordString + "playLand", 100, "mapButton", 0, false);
                const land = this.add.sprite("land", "map");
                land.position.set(x, y);
                break;
        }
    }
    private createOverlayIcon(x: number, y: number, overlay : OverlayStatus, i : number, j : number) {
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
        for(let [name, button] of this.shopButtons) {
            button.update(deltaT);
        }
    }

    public handleEvent(event: GameEvent): void {

        let encodedEvent : string = event.type;
        let eventName : string = event.type;

        let openingIndex : number= encodedEvent.indexOf('{');
        let closingIndex : number= encodedEvent.indexOf('}');

        if(openingIndex != -1 && closingIndex != -1){
            eventName = encodedEvent.slice(closingIndex + 1);
            let coords : string = encodedEvent.slice(openingIndex, closingIndex + 1);

            const regex = /{(\d+),(\d+)}/;
            const match = coords.match(regex);
            let mapX : number = parseInt(match[1]);
            let mapY : number = parseInt(match[2]);

            if(!GameStateManager.get().movePlayer(new Vec2(mapX, mapY))) return; //invalid move
        }

        switch(eventName) {
            case "playBattle": {
                this.sceneManager.changeToScene(HostileScene);
                break;
            }
            case "playShipwreck": {
                this.sceneManager.changeToScene(ShipwreckScene);
                break;
            }
            case "playWhirlpool": {
                this.sceneManager.changeToScene(WhirlpoolScene);
                break;
            }
            case "playObstacle": {
                this.sceneManager.changeToScene(ObstacleScene);
                break;
            }
            case "playLand": {
                this.sceneManager.changeToScene(MapScene);
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
                    this.setShip(ShipType.WOOD);
                }
                break;
            }
            case "buyFiber": {
                if(GameStateManager.get().buyFiber()) {
                    this.hudLabels.get("Fiberglass").setText("Owned: Yes");
                    this.shopButtons.get("Fiberglass").purchase();
                    this.setShip(ShipType.FIBERGLASS);
                }
                break;
            }
            case "buyMetal": {
                if(GameStateManager.get().buyMetal()) {
                    this.hudLabels.get("Metal").setText("Owned: Yes");
                    this.shopButtons.get("Metal").purchase();
                    this.setShip(ShipType.METAL);
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
                    this.setAnimation(MovementType.OAR);
                }
                break;
            }
            case "buySail": {
                if(GameStateManager.get().buySail()) {
                    this.hudLabels.get("Sail").setText("Owned: Yes");
                    this.shopButtons.get("Sail").purchase();
                    this.setAnimation(MovementType.SAIL);
                }
                break;
            }
            case "buyMotor": {
                if(GameStateManager.get().buyMotor()) {
                    this.hudLabels.get("Motor").setText("Owned: Yes");
                    this.shopButtons.get("Motor").purchase();
                    this.setAnimation(MovementType.MOTOR);
                }
                break;
            }
            case "buyPump": {
                if(GameStateManager.get().buyPump()) {
                    this.hudLabels.get("Pump").setText("Owned: Yes");
                    this.shopButtons.get("Pump").purchase();
                }
                break;
            }
            case "buyCrow": {
                if(GameStateManager.get().buyCrow()) {
                    this.hudLabels.get("Crow's Nest").setText("Owned: Yes");
                    this.shopButtons.get("Crow's Nest").purchase();
                }
                break;
            }
            case "buyRadar": {
                if(GameStateManager.get().buyRadar()) {
                    this.hudLabels.get("Radar").setText("Owned: Yes");
                    this.shopButtons.get("Radar").purchase();
                }
                break;
            }
        }
    }
}
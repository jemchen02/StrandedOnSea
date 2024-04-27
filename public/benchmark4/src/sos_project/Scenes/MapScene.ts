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
import HostileScene2 from "./HostileScene2";
import ShipwreckScene2 from "./ShipwreckScene2";
import WhirlpoolScene2 from "./WhirlpoolScene2";
import ObstacleScene2 from "./ObstacleScene2";
import CardHUD from "../GameSystems/HUD/CardHUD";
import { CardManager } from "../CardManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";

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
        this.load.image("obstacle_icon", "hw4_assets/map/obstacle.png");
        this.load.image("land", "hw4_assets/map/land.png");

        this.load.image("fiberglass_card", "sos_assets/cards/FiberglassCard.png");
        this.load.image("crow_card", "sos_assets/cards/CrowCard.png");
        this.load.image("metal_card", "sos_assets/cards/MetalCard.png");
        this.load.image("mine_card", "sos_assets/cards/MineCard.png");
        this.load.image("motor_card", "sos_assets/cards/MotorCard.png");
        this.load.image("pump_card", "sos_assets/cards/PumpCard.png");
        this.load.image("radar_card", "sos_assets/cards/RadarCard.png");
        this.load.image("repair_card", "sos_assets/cards/RepairCard.png");
        this.load.image("sail_card", "sos_assets/cards/SailCard.png");
        this.load.image("torpedo_card", "sos_assets/cards/TorpedoCard.png");

        this.load.audio("sos_theme", "sos_assets/music/1023_illuminakicks.mp4");
    }

    public startScene(){
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "sos_theme", loop: true, holdReference: true});
        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(new Vec2(512, 512));
        this.mapSubscriptions = [];
        this.shopButtons = new Map<String, PurchaseButton>;
        this.initBackground();
        this.initMap();
        this.initHUD();
        this.initShip();
        if(!GameStateManager.get().prevWon) {
            this.shipLayer.disable();
            this.mapLayer.enable();
            this.mapOverlay.enable();
        }
        // Subscribe to the button events
        for (let subevent of this.mapSubscriptions) {
            this.receiver.subscribe(subevent);
        }
    }
    public unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "sos_theme"});
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

        this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x, 120), text: "Choose a Level", fontSize: 60, textColor: Color.WHITE});

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

    private initShip() : void{
        const center = this.viewport.getCenter();

        this.shipLayer = this.addUILayer("ship");

        const cards = CardManager.get().pickThree(GameStateManager.get().money);
        if(cards) {
            for(let i = 0; i < cards.length; i++) {
                new CardHUD(this, {position: new Vec2(170 + 340 * i, 500), layer: "ship", card: cards[i]});
                this.mapSubscriptions.push(cards[i].onclick);
            }
        }

        this.createButton("ship", new Vec2(center.x, center.y + 400), "Buy None", "ready", 150, "design", -1, false, false);
    }
    private createButton(layer: string, position: Vec2, text: string, clickEvent: string, length: number, bType: string, cost: number, owned: boolean, isHard: boolean) {
        if (bType == "design") {
            const newButton = new PurchaseButton(this, {layer, position, text, clickEvent, length, cost, owned});
            this.shopButtons.set(text, newButton);
        } else {
            const newButton = this.add.uiElement(UIElementType.BUTTON, layer, {position, text});
            newButton.size.set(length, 100);
            newButton.borderColor = isHard ? Color.RED : Color.WHITE;
            newButton.backgroundColor = Color.TRANSPARENT;
            if(clickEvent) {
                newButton.onClickEventId = clickEvent;
            }
        }
        this.mapSubscriptions.push(clickEvent);
    }
    private createMapIcon(x: number, y: number, iconType: number, i: number, j: number) {

        let coordString = "{" + i + "," + j + "}";

        switch(iconType) {
            case 0:
                break;
            case 1:
                this.createButton("map", new Vec2(x, y), "", coordString + `${i + j < 4 ? "playHostile" : "playHostile2"}`, 100, "mapButton", 0, false, i + j >= 4);
                const hostile = this.add.sprite("hostile", "map");
                hostile.position.set(x, y);
                break;
            case 2:
                this.createButton("map", new Vec2(x, y), "", coordString + `${i + j < 4 ? "playShipwreck" : "playShipwreck2"}`, 100, "mapButton", 0, false, i + j >= 4);
                const shipwreck = this.add.sprite("shipwreck", "map");
                shipwreck.position.set(x, y);
                break;
            case 3:
                this.createButton("map", new Vec2(x, y), "", coordString + `${i + j < 4 ? "playWhirlpool" : "playWhirlpool2"}`, 100, "mapButton", 0, false, i + j >= 4);
                const whirlpool = this.add.sprite("whirlpool", "map");
                whirlpool.position.set(x, y);
                break;
            case 4:
                this.createButton("map", new Vec2(x, y), "", coordString + "playLand", 100, "mapButton", 0, false, false);
                const land = this.add.sprite("land", "map");
                land.position.set(x, y);
                break;
            case 5:
                this.createButton("map", new Vec2(x, y), "", coordString + `${i + j < 4 ? "playObstacle" : "playObstacle2"}`, 100, "mapButton", 0, false, i + j >= 4);
                const obstacle = this.add.sprite("obstacle_icon", "map");
                obstacle.position.set(x, y);
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
        this.healthHUD.update(deltaT);
        for(let [name, button] of this.shopButtons) {
            button.update(deltaT);
        }
    }
    private returnToMap(): void {
        this.shipLayer.disable();
        this.mapLayer.enable();
        this.mapOverlay.enable();
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
            case "playHostile": {
                this.sceneManager.changeToScene(HostileScene);
                break;
            }
            case "playHostile2": {
                this.sceneManager.changeToScene(HostileScene2);
                break;
            }
            case "playShipwreck": {
                this.sceneManager.changeToScene(ShipwreckScene);
                break;
            }
            case "playShipwreck2": {
                this.sceneManager.changeToScene(ShipwreckScene);
                break;
            }
            case "playWhirlpool": {
                this.sceneManager.changeToScene(WhirlpoolScene);
                break;
            }
            case "playWhirlpool2": {
                this.sceneManager.changeToScene(WhirlpoolScene2);
                break;
            }
            case "playObstacle": {
                this.sceneManager.changeToScene(ObstacleScene);
                break;
            }
            case "playObstacle2": {
                this.sceneManager.changeToScene(ObstacleScene);
                break;
            }
            case "playLand": {
                this.sceneManager.changeToScene(MapScene);
                break;
            }
            case "ready": {
                this.returnToMap();
                break;
            }
            case "buyFiber": {
                GameStateManager.get().buyFiber();
                CardManager.get().remove("Fiberglass");
                this.returnToMap();
                break;
            }
            case "buyMetal": {
                GameStateManager.get().buyMetal();
                CardManager.get().remove("Metal");
                this.returnToMap();
                break;
            }
            case "buyMine": {
                GameStateManager.get().buyMine();
                this.returnToMap();
                break;
            }
            case "buyTorpedo": {
                GameStateManager.get().buyTorpedo();
                this.returnToMap();
                break;
            }
            case "buyRepair": {
                GameStateManager.get().buyRepair();
                this.returnToMap();
                break;
            }
            case "buySail": {
                GameStateManager.get().buySail();
                CardManager.get().remove("Sail");
                this.returnToMap();
                break;
            }
            case "buyMotor": {
                GameStateManager.get().buyMotor();
                CardManager.get().remove("Motor");
                this.returnToMap();
                break;
            }
            case "buyPump": {
                GameStateManager.get().buyPump();
                CardManager.get().remove("Pump");
                this.returnToMap();
                break;
            }
            case "buyCrow": {
                GameStateManager.get().buyCrow();
                CardManager.get().remove("Crow's Nest");
                this.returnToMap();
                break;
            }
            case "buyRadar": {
                GameStateManager.get().buyRadar();
                CardManager.get().remove("Radar");
                this.returnToMap();
                break;
            }
        }
    }
}
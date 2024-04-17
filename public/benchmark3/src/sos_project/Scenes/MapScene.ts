import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import PlayerHealthHUD from "../GameSystems/HUD/PlayerHealthHUD";
import CoinHUD from "../GameSystems/HUD/CoinHUD";
import { GameStateManager, MovementType, ShipType } from "../GameStateManager";
import { OverlayStatus, SOSLevel } from "../SOSLevel";
import HostileScene from "./HostileScene";
import WhirlpoolScene from "./WhirlpoolScene";
import ShipwreckScene from "./ShipwreckScene";
import ObstacleScene from "./ObstacleScene";
import ShipDesigner from "./ShipDesigner";

export default class MapScene extends Scene {
    // Layers, for multiple main menu screens

    private backgroundLayer: Layer;
    private staticHUD: Layer;
    private updateHUD: Layer;
    private mapLayer: Layer;
    private mapOverlay: Layer;
    
    private healthHUD: PlayerHealthHUD;
    private coinHUD: CoinHUD;

    private mapSubscriptions: string[];
    public loadScene(){
        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("coinTab", "hw4_assets/sprites/coinStorage.png");
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
        this.initBackground();
        this.initMap();
        this.initHUD();
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
        this.mapOverlay = this.addUILayer("overlay");

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
        this.healthHUD = new PlayerHealthHUD(this, "healthTab", "staticHUD", "updateHUD", 2, 2);
        this.coinHUD = new CoinHUD(this, "coinTab", "staticHUD", "updateHUD", 2, 2);
    }

    private createButton(layer: string, position: Vec2, text: string, clickEvent: string, length: number) {
        const newButton = this.add.uiElement(UIElementType.BUTTON, layer, {position, text});
        newButton.size.set(length, 100);
        newButton.borderColor = Color.WHITE;
        newButton.backgroundColor = Color.TRANSPARENT;
        if(clickEvent) {
            newButton.onClickEventId = clickEvent;
            this.mapSubscriptions.push(clickEvent);
        }
    }
    private createMapIcon(x: number, y: number, iconType: number, i: number, j: number) {

        let coordString = "{" + i + "," + j + "}";

        switch(iconType) {
            case 0:
                break;
            case 1:
                this.createButton("map", new Vec2(x, y), "", coordString + "playBattle", 100);
                const hostile = this.add.sprite("hostile", "map");
                hostile.position.set(x, y);
                break;
            case 2:
                this.createButton("map", new Vec2(x, y), "", coordString + "playShipwreck", 100);
                const shipwreck = this.add.sprite("shipwreck", "map");
                shipwreck.position.set(x, y);
                break;
            case 3:
                this.createButton("map", new Vec2(x, y), "", coordString + "playWhirlpool", 100);
                const whirlpool = this.add.sprite("whirlpool", "map");
                whirlpool.position.set(x, y);
                break;
            case 4:
                this.createButton("map", new Vec2(x, y), "", coordString + "playLand", 100);
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
                this.sceneManager.changeToScene(ShipDesigner);
                break;
            }
        }
    }
}
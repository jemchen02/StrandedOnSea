import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import CoinHUD from "../GameSystems/HUD/CoinHUD";
import PurchaseButton from "../GameSystems/HUD/PurchaseButton";
import { GameStateManager, MovementType, ShipType } from "../GameStateManager";
import { ShipAnimationType } from "../AI/ShipStates/ShipState";
import { Costs } from "../GameConstants";
import MapScene from "./MapScene";

export default class ShipDesigner extends Scene {
    private player_wood: AnimatedSprite;
    private player_fiber: AnimatedSprite;
    private player_metal: AnimatedSprite;
    private player_ships: AnimatedSprite[];

    private shipLayer: Layer;
    private backgroundLayer: Layer;

    private coinHUD: CoinHUD;

    private hudLabels: Map<String, Label>;
    private shopButtons: PurchaseButton[];
    private mapSubscriptions: string[];
    public loadScene(){
        this.load.spritesheet("player_wood", "sos_assets/spritesheets/player_wood.json");
        this.load.spritesheet("player_fiber", "sos_assets/spritesheets/player_fiberglass.json");
        this.load.spritesheet("player_metal", "sos_assets/spritesheets/player_metal.json");

        this.load.image("backgroundBlue", "hw4_assets/sprites/backgroundBlue.png");
        this.load.image("coinTab", "hw4_assets/sprites/coinStorage.png");
        this.load.image("water", "hw4_assets/sprites/water.png");
    }
    public startScene(){
        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(new Vec2(512, 512));
        this.mapSubscriptions = [];
        this.shopButtons = [];
        this.initBackground();
        this.initShip();
        this.initCoinHUD();
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
        
        this.hudLabels = new Map<String, Label>;

        this.createButton("ship", new Vec2(center.x, center.y + 400), "Ready", "ready", 150, -1);

        this.createButton("ship", new Vec2(center.x + 50, center.y - 300), "Wood", "buyWood", 150, Costs.WOOD_COST);
        this.createLabels("ship", "Wood", new Vec2(center.x + 50, center.y - 240), "Owned: Yes", Costs.WOOD_COST, "weak, fast", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y - 300), "Fiberglass", "buyFiber", 150, Costs.FIBER_COST);
        this.createLabels("ship", "Fiberglass", new Vec2(center.x + 220, center.y - 240), "Owned: No", Costs.FIBER_COST, "medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y - 300), "Metal", "buyMetal", 150, Costs.METAL_COST);
        this.createLabels("ship", "Metal", new Vec2(center.x + 390, center.y - 240), "Owned: No", Costs.METAL_COST, "hardened, slow", true);

        this.createButton("ship", new Vec2(center.x + 135, center.y - 50), "Cannon", "buyCannon", 150, Costs.CANNON_COST);
        this.createLabels("ship", "Cannon", new Vec2(center.x + 135, center.y + 10), "Owned: 0", Costs.CANNON_COST, "Low damage", true);
        this.createButton("ship", new Vec2(center.x + 305, center.y - 50), "Torpedo", "buyTorpedo", 150, Costs.TORPEDO_COST);
        this.createLabels("ship", "Torpedo", new Vec2(center.x + 305, center.y + 10), "Owned: 0", Costs.TORPEDO_COST, "High damage", true);

        this.createButton("ship", new Vec2(center.x + 50, center.y + 200), "Oars", "buyOars", 150, Costs.OAR_COST);
        this.createLabels("ship", "Oars", new Vec2(center.x + 50, center.y + 260), "Owned: Yes", Costs.OAR_COST, "Slow", true);
        this.createButton("ship", new Vec2(center.x + 220, center.y + 200), "Sail", "buySail", 150, Costs.SAIL_COST);
        this.createLabels("ship", "Sail", new Vec2(center.x + 220, center.y + 260), "Owned: No", Costs.SAIL_COST, "Medium", true);
        this.createButton("ship", new Vec2(center.x + 390, center.y + 200), "Motor", "buyMotor", 150, Costs.MOTOR_COST);
        this.createLabels("ship", "Motor", new Vec2(center.x + 390, center.y + 260), "Owned: No", Costs.MOTOR_COST, "Fast", true);

        this.createButton("ship", new Vec2(center.x - 400, center.y), "Repair", "buyRepair", 200, Costs.REPAIR_COST);
        this.createLabels("ship", "Repair", new Vec2(center.x - 450, center.y + 50), "Owned: 0", Costs.REPAIR_COST, "Heals ship", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 100), "Pump", "buyPump", 200, Costs.PUMP_COST);
        this.createLabels("ship", "Pump", new Vec2(center.x - 450, center.y + 150), "Owned: No", Costs.PUMP_COST, "Reduces DPS taken", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 200), "Crow's Nest", "buyCrow", 200, Costs.CROW_COST);
        this.createLabels("ship", "Crow's Nest", new Vec2(center.x - 450, center.y + 250), "Owned: No", Costs.CROW_COST, "See further", false);
        this.createButton("ship", new Vec2(center.x - 400, center.y + 300), "Radar", "buyRadar", 200, Costs.RADAR_COST);
        this.createLabels("ship", "Radar", new Vec2(center.x - 450, center.y + 350), "Owned: No", Costs.RADAR_COST, "Reveals map", false);
    }
    private initCoinHUD() {
        this.coinHUD = new CoinHUD(this, "coinTab", "background", "ship", 2, 2);
    }
    private createButton(layer: string, position: Vec2, text: string, clickEvent: string, length: number, cost: number) {
        const newButton = new PurchaseButton(this, {layer, position, text, clickEvent, length, cost});
        this.shopButtons.push(newButton);
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
    public updateScene(deltaT: number){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.coinHUD.update(deltaT);
        for(let button of this.shopButtons) {
            button.update(deltaT);
        }
    }

    public handleEvent(event: GameEvent): void {

        let encodedEvent : string = event.type;
        let eventName : string = event.type;

        switch(eventName) {
            case "ready": {
                this.sceneManager.changeToScene(MapScene);
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
                    this.setShip(ShipType.FIBERGLASS);
                }
                break;
            }
            case "buyMetal": {
                if(GameStateManager.get().buyMetal()) {
                    this.hudLabels.get("Metal").setText("Owned: Yes");
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
                    this.setAnimation(MovementType.SAIL);
                }
                break;
            }
            case "buyMotor": {
                if(GameStateManager.get().buyMotor()) {
                    this.hudLabels.get("Motor").setText("Owned: Yes");
                    this.setAnimation(MovementType.MOTOR);
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
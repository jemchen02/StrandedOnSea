import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import { GameStateManager } from "../../GameStateManager";

interface HUDOptions {
    start: Vec2;
    padding: number;
    slotLayer: string,
    itemLayer: string,
    staticLayer: string,
    mineSprite: string,
    torpedoSprite: string,
    repairSprite: string,
    scaleX: number,
    scaleY: number
}

/**
 * Manages the player inventory that is displayed in the UI. Fun fact, I actually managed to port this
 * class from my old CSE-380 project from last semester.
 * @author PeteyLumpkins
 */
export default class InventoryHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* Event handling stuff */
    private receiver: Receiver;

    /* Options for settign the size, padding, and starting position of the UI slots */
    private size: number;
    private start: Vec2;
    private padding: number;

    /* Inventory UI Layers */
    private slotSprite: string;
    private itemLayer: string;
    private slotLayer: string;
    private staticLayer: string;

    /* UI Components for the inventory */
    private itemSlots: Array<Sprite>;
    private itemSlotNums: Array<Label>;


    public constructor(scene: Scene, slotSprite: string, options: HUDOptions) {

        this.scene = scene;
        this.slotSprite = slotSprite;

        // Set the size and padding for the item slots
        this.size = 3;
        this.padding = options.padding;
        this.start = options.start;
        // Init the layers for the items
        this.slotLayer = options.slotLayer;
        this.itemLayer = options.itemLayer;
        this.staticLayer = options.staticLayer;

        // Set up the scales for scaling to the viewport
        const scaleX = options.scaleX;
        const scaleY = options.scaleY;
        // Load the item slot sprites
        this.itemSlots = new Array<Sprite>();
        this.itemSlots[0] = this.scene.add.sprite(options.mineSprite, this.slotLayer);
        this.itemSlots[0].scale.set(0.4 * scaleX, 0.4 * scaleY);
        this.itemSlots[1] = this.scene.add.sprite(options.torpedoSprite, this.slotLayer);
        this.itemSlots[1].scale.set(0.4 * scaleX, 0.4 * scaleY);
        this.itemSlots[2] = this.scene.add.sprite(options.repairSprite, this.slotLayer);
        this.itemSlots[2].scale.set(0.4 * scaleX, 0.4 * scaleY);
        // Set the positions of the item slot sprites
        let width = this.itemSlots[0].size.x * scaleX;
        let height = this.itemSlots[0].size.y * scaleY;
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i].position.set(this.start.x * scaleX, (this.start.y + i*(40 + this.padding)) * scaleY);
        }
        // Set the slot numbers in the user interface
        this.itemSlotNums = new Array<Label>();
        this.itemSlotNums[0] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2((this.start.x + 25) * scaleX, (this.start.y + 10 )* scaleY), text: `${GameStateManager.get().numMine}`, fontSize: 24, textColor:Color.BLACK});
        this.itemSlotNums[1] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2((this.start.x + 25) * scaleX, (this.start.y + 1*(40 + this.padding) + 10) * scaleY), text: `${GameStateManager.get().numTorpedo}`, fontSize: 24, textColor:Color.BLACK});
        this.itemSlotNums[2] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2((this.start.x + 25) * scaleX, (this.start.y + 2*(40 + this.padding) + 10) * scaleY), text: `${GameStateManager.get().numRepairs}`, fontSize: 24, textColor:Color.BLACK});

        const inventoryTab = this.scene.add.sprite("inventoryTab", this.staticLayer);
        inventoryTab.position.set(50 * scaleX, 250 * scaleY);
        inventoryTab.scale.set(.3 * scaleX, .3 * scaleY);
        inventoryTab.alpha = 0.6;
    }

    public update(deltaT: number): void {
        (<Label>this.itemSlotNums[0]).text = `${GameStateManager.get().numMine}`;
        (<Label>this.itemSlotNums[1]).text = `${GameStateManager.get().numTorpedo}`;
        (<Label>this.itemSlotNums[2]).text = `${GameStateManager.get().numRepairs}`;
    }

}
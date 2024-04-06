import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Item from "../ItemSystem/Item";
import Inventory from "../ItemSystem/Inventory";

interface HUDOptions {
    start: Vec2;
    padding: number;
    slotLayer: string,
    itemLayer: string,
    staticLayer: string
}

/**
 * Manages the player inventory that is displayed in the UI. Fun fact, I actually managed to port this
 * class from my old CSE-380 project from last semester.
 * @author PeteyLumpkins
 */
export default class InventoryHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* The inventory */
    private inventory: Inventory

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


    public constructor(scene: Scene, inventory: Inventory, slotSprite: string, options: HUDOptions) {

        this.scene = scene;
        this.inventory = inventory;
        this.slotSprite = slotSprite;

        // Set the size and padding for the item slots
        this.size = this.inventory.capacity;
        this.padding = options.padding;
        this.start = options.start;
        // Init the layers for the items
        this.slotLayer = options.slotLayer;
        this.itemLayer = options.itemLayer;
        this.staticLayer = options.staticLayer;

        // Set up the scales for scaling to the viewport
        
        // Load the item slot sprites
        this.itemSlots = new Array<Sprite>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i] = this.scene.add.sprite(this.slotSprite, this.slotLayer);
            this.itemSlots[i].scale.set(0.4, 0.4);
        }
        // Set the positions of the item slot sprites
        let width = this.itemSlots[0].size.x;
        let height = this.itemSlots[0].size.y;
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i].position.set(this.start.x, this.start.y + i*(40 + this.padding));
        }
        // Set the slot numbers in the user interface
        this.itemSlotNums = new Array<Label>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlotNums[i] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x + 25, this.start.y + i*(40 + this.padding) + 10), text: `${i + 1}`, fontSize: 24, textColor:Color.BLACK});
        }
        const inventoryTab = this.scene.add.sprite("inventoryTab", this.staticLayer);
        inventoryTab.position.set(50, 250);
        inventoryTab.scale.set(.3, .3);
    }

    public update(deltaT: number): void {
        
        let index = 0;
        for (let item of this.inventory.items()) {
            item.position.copy(this.itemSlots[index].position);
            item.visible = true;
            index += 1;
        }
    }

}
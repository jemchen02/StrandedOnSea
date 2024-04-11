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
    cannonSprite: string,
    torpedoSprite: string,
    repairSprite: string
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
        
        // Load the item slot sprites
        this.itemSlots = new Array<Sprite>();
        for (let i = 0; i < this.size; i += 1) {
            //this.itemSlots[i] = this.scene.add.sprite(this.slotSprite, this.slotLayer);
            //this.itemSlots[i].scale.set(0.4, 0.4);
        }
        this.itemSlots[0] = this.scene.add.sprite(options.cannonSprite, this.slotLayer);
        this.itemSlots[0].scale.set(0.4, 0.4);
        this.itemSlots[1] = this.scene.add.sprite(options.torpedoSprite, this.slotLayer);
        this.itemSlots[1].scale.set(0.4, 0.4);
        this.itemSlots[2] = this.scene.add.sprite(options.repairSprite, this.slotLayer);
        this.itemSlots[2].scale.set(0.4, 0.4);
        // Set the positions of the item slot sprites
        let width = this.itemSlots[0].size.x;
        let height = this.itemSlots[0].size.y;
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i].position.set(this.start.x, this.start.y + i*(40 + this.padding));
        }
        // Set the slot numbers in the user interface
        this.itemSlotNums = new Array<Label>();
        this.itemSlotNums[0] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x + 25, this.start.y), text: `${GameStateManager.get().numCannon}`, fontSize: 24, textColor:Color.BLACK});
        this.itemSlotNums[1] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x + 25, this.start.y + 1*(40 + this.padding) + 10), text: `${GameStateManager.get().numTorpedo}`, fontSize: 24, textColor:Color.BLACK});
        this.itemSlotNums[2] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x + 25, this.start.y + 2*(40 + this.padding) + 10), text: `${GameStateManager.get().numRepairs}`, fontSize: 24, textColor:Color.BLACK});

        const inventoryTab = this.scene.add.sprite("inventoryTab", this.staticLayer);
        inventoryTab.position.set(50, 250);
        inventoryTab.scale.set(.3, .3);
    }

    public update(deltaT: number): void {
        (<Label>this.itemSlotNums[0]).text = `${GameStateManager.get().numCannon}`;
        (<Label>this.itemSlotNums[1]).text = `${GameStateManager.get().numTorpedo}`;
        (<Label>this.itemSlotNums[2]).text = `${GameStateManager.get().numRepairs}`;
    }

}
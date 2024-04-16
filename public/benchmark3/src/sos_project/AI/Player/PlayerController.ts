import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

/**
 * Strings used in the key binding for the player
 */
export enum PlayerInput {
    MOVE_FORWARD = "MOVE_UP",
    MOVE_BACKWARD = "MOVE_DOWN",
    TURN_LEFT = "MOVE_LEFT",
    TURN_RIGHT = "MOVE_RIGHT",
    ATTACKING = "ATTACKING",
    FIRE_STARBOARD = "PICKUP_ITEM",
    FIRE_PORT = "DROP_ITEM",
    PASS_LEVEL = "SKIP_LEVEL"
}

/**
 * The PlayerController class handles processing the input recieved from the user and exposes  
 * a set of methods to make dealing with the user input a bit simpler.
 */
export default class PlayerController {

    /** The GameNode that owns the AI */
    protected owner: AnimatedSprite;

    constructor(owner: AnimatedSprite) {
        this.owner = owner;
    }

    public get acceleration(): number {
        return (Input.isPressed(PlayerInput.MOVE_FORWARD) ? 1 : 0) + (Input.isPressed(PlayerInput.MOVE_BACKWARD) ? -1 : 0);
    }

    public get rotation(): number {
        return (Input.isPressed(PlayerInput.TURN_LEFT) ? -1 : 0) + (Input.isPressed(PlayerInput.TURN_RIGHT) ? 1 : 0)
    }

    /** 
     * Gets the direction the player should be facing based on the position of the
     * mouse around the player
     * @return a Vec2 representing the direction the player should face.
     */
    public get aim(): Vec2 { 
        return this.owner.position.dirTo(Input.getGlobalMousePosition());
    }

    public get fireTorpedo(): boolean {
        return Input.isMouseJustPressed()
    }

    public get firePort(): boolean {
        return Input.isJustPressed(PlayerInput.FIRE_PORT);
    }

    public get fireStarBoard(): boolean {
        return Input.isJustPressed(PlayerInput.FIRE_STARBOARD);
    }

    /** 
     * Checks if the player is attempting to use a held item or not.
     * @return true if the player is attempting to use a held item; false otherwise
     */
    public get useItem(): boolean { return Input.isMouseJustPressed(); }

    /** 
     * Checks if the player is attempting to pick up an item or not.
     * @return true if the player is attempting to pick up an item; false otherwise.
     */
    public get pickingUp(): boolean { return Input.isJustPressed(PlayerInput.FIRE_STARBOARD); }

    /** 
     * Checks if the player is attempting to drop their held item or not.
     * @return true if the player is attempting to drop their held item; false otherwise.
     */
    public get dropping(): boolean { return Input.isJustPressed(PlayerInput.FIRE_PORT); }

    public get isColliding(): boolean { return this.owner.isColliding }
}
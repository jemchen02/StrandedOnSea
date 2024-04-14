import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

/**
 * An interface for a Battler
 */
export default interface Battler extends Unique {


    /** The maximum health of the battler */
    get maxHealth(): number;
    set maxHealth(value: number);

    /** The battlers current health */
    get health(): number;
    set health(value: number);

    /** The battlers current speed */
    get speed(): number;
    set speed(value: number);

    /** The battlers position */
    get position(): Vec2;
    set position(value: Vec2);

    /** Whether the battler is active or not */
    get battlerActive(): boolean;
    set battlerActive(value: boolean);

}
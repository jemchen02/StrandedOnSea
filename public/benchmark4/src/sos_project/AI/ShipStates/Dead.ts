import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { ShipStateType, ShipAnimationType } from "./ShipState";
import ShipState from "./ShipState";

export default class Dead extends ShipState {

    public override onEnter(options: Record<string, any>): void {
        this.owner.animation.play(this.parent.checkSail+ShipAnimationType.SINKING)
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public override update(deltaT: number): void {
        return;
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}
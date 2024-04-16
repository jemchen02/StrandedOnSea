import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { ShipStateType, ShipAnimationType } from "./ShipState";
import ShipState from "./ShipState";

export default class Idle extends ShipState {

    public override onEnter(options: Record<string, any>): void {
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
        this.owner.animation.playIfNotAlready(this.parent.checkSail+ShipAnimationType.IDLE);
        super.update(deltaT);
        if (this.parent.isMovingForwards) {
            this.finished(ShipStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}
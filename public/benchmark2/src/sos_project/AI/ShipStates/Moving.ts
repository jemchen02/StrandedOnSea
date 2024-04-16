import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { ShipAnimationType, ShipStateType } from "./ShipState";
import ShipState from "./ShipState";

export default class Moving extends ShipState {
    
    public override onEnter(options: Record<string, any>): void {
        
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
            }
        }
    }

    public override update(deltaT: number): void {
        this.owner.animation.playIfNotAlready(this.parent.checkSail + ShipAnimationType.MOVE_FORWARD, true);
        super.update(deltaT);
        if (!this.parent.isMovingForwards) {
            this.finished(ShipStateType.IDLE);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}
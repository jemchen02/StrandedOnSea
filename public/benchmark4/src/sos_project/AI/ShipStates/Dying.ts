import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { ShipStateType, ShipAnimationType } from "./ShipState";
import ShipState from "./ShipState";

export default class Dying extends ShipState {

    public override onEnter(options: Record<string, any>): void {
        this.owner.animation.play(this.parent.checkSail+ShipAnimationType.TAKE_DAMAGE)
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
        super.update(deltaT);
        if (!this.owner.animation.isPlaying(this.parent.checkSail+ShipAnimationType.TAKE_DAMAGE)) {
            this.finished(ShipStateType.IDLE);
        }
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}
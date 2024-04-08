import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerAnimationType, PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class Idle extends PlayerState {

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
        this.owner.animation.playIfNotAlready(this.parent.checkSail+PlayerAnimationType.IDLE);
        super.update(deltaT);
        if (this.parent.getSpeed != 0) {
            this.finished(PlayerStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}
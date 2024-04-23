import { Costs } from "./GameConstants";
import { Card } from "./SOSLevel";
const cardInit = [
    ["Fiberglass", "fiberglass_card", Costs.FIBER_COST, "buyFiber"],
    ["Metal", "metal_card", Costs.METAL_COST, "buyMetal"],
    ["Sail", "sail_card", Costs.SAIL_COST, "buySail"],
    ["Motor", "motor_card", Costs.MOTOR_COST, "buyMotor"],
    ["Pump", "pump_card", Costs.PUMP_COST, "buyPump"],
    ["Crow's Nest", "crow_card", Costs.CROW_COST, "buyCrow"],
    ["Radar", "radar_card", Costs.RADAR_COST, "buyRadar"],
    ["5 Mines", "mine_card", Costs.MINE_COST, "buyMine"],
    ["5 Torpedoes", "torpedo_card", Costs.TORPEDO_COST, "buyTorpedo"],
    ["2 Repairs", "repair_card", Costs.REPAIR_COST, "buyRepair"]
];
export class CardManager {
    private static instance: CardManager;
    public static get(): CardManager {
      if (CardManager.instance){
        return CardManager.instance;
      }

      else {
        CardManager.instance = new CardManager();
        return CardManager.instance;
      }
    }

    cards : Card[]

    constructor(){
      this.cards = cardInit.map((card) => new Card({name: card[0], image: card[1], cost: card[2], onclick: card[3]}));
    }

    public pickThree(money: number): Card[] {
        const cardChoices = this.cards.filter(card => card.cost <= money);
        const shuffled = cardChoices.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    public ResetCards() : void{
      this.cards = [];
    }
    public remove(name: String): void {
      this.cards = this.cards.filter(card => card.name != name);
    }
}
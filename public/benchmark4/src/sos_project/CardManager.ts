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
    ["Spiked Armor", "spike_card", Costs.SPIKE_COST, "buySpike"],
    ["Rapid Fire", "rapid_fire_card", Costs.RAPID_FIRE_COST, "buyRapidFire"],
    ["6 Mines", "mine_card", Costs.MINE_COST, "buyMine"],
    ["20 Mines", "mine_card_2", Costs.MINE_COST_2, "buyMine2"],
    ["5 Torpedoes", "torpedo_card", Costs.TORPEDO_COST, "buyTorpedo"],
    ["10 Torpedoes", "torpedo_card_2", Costs.TORPEDO_COST_2, "buyTorpedo2"],
    ["2 Repairs", "repair_card", Costs.REPAIR_COST, "buyRepair"],
    ["6 Repairs", "repair_card_2", Costs.REPAIR_COST_2, "buyRepair2"]
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
        let cardChoices = this.cards.filter(card => card.cost <= money);
        if(money >= 450) {
          cardChoices = cardChoices.filter(card => card.cost >= 400);
        }
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
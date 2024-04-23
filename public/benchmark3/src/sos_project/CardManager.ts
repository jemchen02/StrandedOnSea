import { Costs } from "./GameConstants";
import { Card } from "./SOSLevel";
const cardInit = [
    ["Fiberglass", "Material", "fiberglass_icon", "Sturdier ship ignores 15% of attacks.", Costs.FIBER_COST, "buyFiber"],
    ["Metal", "Material", "metal_icon", "Hardened ship ignores 25% of attacks.", Costs.METAL_COST, "buyMetal"],
    ["Sail", "Propulsion", "sail_icon", "Increases ship speed by 20%.", Costs.FIBER_COST, "buySail"],
    ["Motor", "Propulsion", "motor_icon", "Increases ship speed by 40%.", Costs.MOTOR_COST, "buyMotor"],
    ["Pump", "Enhacement", "pump_icon", "Heal 1 health every 5 seconds.", Costs.PUMP_COST, "buyPump"],
    ["Crow's Nest", "Enhacement", "crow_icon", "See one step further on map.", Costs.CROW_COST, "buyCrow"],
    ["Radar", "Enhacement", "radar_icon", "Reveals the entire map.", Costs.RADAR_COST, "buyRadar"],
    ["5 Mines", "Consumable", "mine_icon", "Stationary, massive damage on touch.", Costs.MINE_COST, "buyMine"],
    ["5 Torpedoes", "Consumable", "torpedo_icon", "Guided missile dealing large damage.", Costs.TORPEDO_COST, "buyTorpedo"],
    ["2 Repairs", "Consumable", "repair_icon", "Heals 30 hp instantly.", Costs.REPAIR_COST, "buyRepair"]
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
      this.cards = cardInit.map((card) => new Card({name: card[0], type: card[1], image: card[2], description: card[3], cost: card[4], onclick: card[5]}));
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
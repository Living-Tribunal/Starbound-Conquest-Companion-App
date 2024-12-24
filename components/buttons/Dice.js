
import D4Dice from "../dice/D4Dice.js";
import D6Dice from "../dice/D6Dice.js";
import D8Dice from "../dice/D8Dice.js";
import D10Dice from "../dice/D10Dice.js";
import D12Dice from "../dice/D12Dice.js";

 const shipDiceMapping = {
    Fighter: [<D4Dice />],
    Destroyer: [<D6Dice />],
    Carrier: [<D8Dice />, <D6Dice />],
    Cruiser: [<D8Dice />, <D10Dice />],
    Dreadnought: [<D8Dice />, <D10Dice />, <D12Dice />],
  }

export { shipDiceMapping };

import { Text } from "react-native";
import Dreadnought from "../ships/Dreadnought";

const SpecialOrders = {
    Fighter: [
    <Text>Roll 2d10. The result is the additional feet the ship can move that turn.</Text>,
    <Text>You can choose and number of ships with this maneuver to combine
    fire against a target that is within the weapon's range of each
    ship involved. When you do so, roll 1d20, if the attack hits,
    roll the damage dice for all the ships and add their totals
    together and compare against the target's soak value to deal
    damage as normal. If the attack misses, all ships miss.</Text>,
    <Text>Roll 1d20, on an 11 or higher, this ship cannon be targeted by
    Anti-Fighter Barrage this turn and attack rolls against it are
    made with disadvantage.</Text>

    ],
    Destroyer: [<Text>Words and such</Text>],
    Cruiser: [<Text>Words and such</Text>],
    Carrier: [<Text>Words and such</Text>],
    Dreadnought: [<Text>Words and such</Text>],
  };

export { SpecialOrders };
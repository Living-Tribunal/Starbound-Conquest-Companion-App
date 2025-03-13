import Dice from "../dice/D4Dice.js";

const shipDiceMapping = {
  Fighter: [
    <Dice text="Roll to Hit" number1={1} number2={20} />,
    <Dice text="Light Cannon" number1={1} number2={4} />,
  ],
  Destroyer: [
    <Dice text="Roll to Hit" number1={1} number2={20} />,
    <Dice text="Medium Cannon" number1={1} number2={6} />,
  ],
  Cruiser: [
    <Dice text="Roll to Hit" number1={1} number2={20} />,
    <Dice text="Heavy Cannon" number1={1} number2={8} />,
    <Dice text="Plasma Cannon" number1={1} number2={10} />,
  ],
  Carrier: [
    <Dice text="Roll to Hit" number1={1} number2={20} />,
    <Dice text="350mm Railgun" number1={1} number2={8} />,
    <Dice text="Missile Battery" number1={1} number2={6} />,
  ],
  Dreadnought: [
    <Dice text="Roll to Hit" number1={1} number2={20} />,
    <Dice text="Ion Particle Beam" number1={1} number2={12} />,
    <Dice text="Plasma Cannon" number1={1} number2={10} />,
    <Dice text="350mm Railgun" number1={1} number2={8} />,
  ],
};

export { shipDiceMapping };

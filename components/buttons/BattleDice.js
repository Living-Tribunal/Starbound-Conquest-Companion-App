import { Colors } from "@/constants/Colors";

export const shipBattleDiceMapping = {
  Fighter: [
    {
      id: "D20",
      text: "Roll to Hit",
      number1: 1,
      number2: 20,
      isUtility: true,
      tintColor: Colors.goldenrod,
      textStyle: { color: Colors.gold },
      borderColor: { borderColor: Colors.goldenrod },
    },
    {
      id: "Light Cannon",
      text: "Light Cannon",
      number1: 1,
      number2: 6,
    },
  ],
  Destroyer: [
    {
      id: "D20",
      text: "Roll to Hit",
      number1: 1,
      number2: 20,
      isUtility: true,
      tintColor: Colors.goldenrod,
      textStyle: { color: Colors.gold },
      borderColor: { borderColor: Colors.goldenrod },
    },
    {
      id: "Medium Cannon",
      text: "Medium Cannon",
      number1: 1,
      number2: 6,
    },
  ],
  Cruiser: [
    {
      id: "D20",
      text: "Roll to Hit",
      number1: 1,
      number2: 20,
      isUtility: true,
      tintColor: Colors.goldenrod,
      textStyle: { color: Colors.gold },
      borderColor: { borderColor: Colors.goldenrod },
    },
    {
      id: "Heavy Cannon",
      text: "Heavy Cannon",
      number1: 1,
      number2: 8,
    },
    {
      id: "Plasma Cannon",
      text: "Plasma Cannon",
      number1: 1,
      number2: 10,
    },
  ],
  Carrier: [
    {
      id: "D20",
      text: "Roll to Hit",
      number1: 1,
      number2: 20,
      isUtility: true,
      tintColor: Colors.goldenrod,
      textStyle: { color: Colors.gold },
      borderColor: { borderColor: Colors.goldenrod },
    },
    {
      id: "350mm Railgun",
      text: "350mm Railgun",
      number1: 1,
      number2: 8,
    },
    {
      id: "Missile Battery",
      text: "Missile Battery",
      number1: 1,
      number2: 6,
    },
  ],
  Dreadnought: [
    {
      id: "D20",
      text: "Roll to Hit",
      number1: 1,
      number2: 20,
      isUtility: true,
      tintColor: Colors.goldenrod,
      textStyle: { color: Colors.gold },
      borderColor: { borderColor: Colors.goldenrod },
    },
    {
      id: "Ion Particle Beam",
      text: "Ion Particle Beam",
      number1: 1,
      number2: 10,
      numberOfDice: 2,
    },
    {
      id: "Plasma Cannon",
      text: "Plasma Cannon",
      number1: 1,
      number2: 10,
    },
    {
      id: "350mm Railgun",
      text: "350mm Railgun",
      number1: 1,
      number2: 8,
    },
  ],
};

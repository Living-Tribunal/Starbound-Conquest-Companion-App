import BattleDice from "../dice/BattleGroundDice.js";
import { Colors } from "@/constants/Colors.js";
import { View, StyleSheet } from "react-native";

const shipBattleDiceMapping = {
  Fighter: [
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <BattleDice
          text="Roll to Hit"
          number1={1}
          id={"D20"}
          number2={20}
          tintColor={Colors.goldenrod}
          textStyle={{ color: Colors.gold }}
          borderColor={{ borderColor: Colors.goldenrod }}
        />
        <BattleDice
          text="Light Cannon"
          id={"Light Cannon"}
          number1={1}
          number2={6}
        />
      </View>
    </View>,
  ],
  Destroyer: [
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <BattleDice
          text="Roll to Hit"
          number1={1}
          id={"D20"}
          number2={20}
          tintColor={Colors.goldenrod}
          textStyle={{ color: Colors.gold }}
          borderColor={{ borderColor: Colors.goldenrod }}
        />
        <BattleDice
          text="Medium Cannon"
          id={"Medium Cannon"}
          number1={1}
          number2={6}
        />
      </View>
    </View>,
  ],
  Cruiser: [
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <BattleDice
          text="Roll to Hit"
          number1={1}
          id={"D20"}
          number2={20}
          tintColor={Colors.goldenrod}
          textStyle={{ color: Colors.gold }}
          borderColor={{ borderColor: Colors.goldenrod }}
        />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignContent: "center",
        }}
      >
        <BattleDice
          text="Heavy Cannon"
          id={"Heavy Cannon"}
          number1={1}
          number2={8}
        />
        <BattleDice
          text="Plasma Cannon"
          id={"Plasma Cannon"}
          number1={1}
          number2={10}
        />
      </View>
    </View>,
  ],
  Carrier: [
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <BattleDice
          text="Roll to Hit"
          number1={1}
          id={"D20"}
          number2={20}
          tintColor={Colors.goldenrod}
          textStyle={{ color: Colors.gold }}
          borderColor={{ borderColor: Colors.goldenrod }}
        />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignContent: "center",
        }}
      >
        <BattleDice
          text="350mm Railgun"
          id={"350mm Railgun"}
          number1={1}
          number2={8}
        />
        <BattleDice
          text="Missile Battery"
          id={"Missile Battery"}
          number1={1}
          number2={6}
        />
      </View>
    </View>,
  ],
  Dreadnought: [
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <BattleDice
          text="Roll to Hit"
          number1={1}
          number2={20}
          id={"D20"}
          tintColor={Colors.goldenrod}
          textStyle={{ color: Colors.gold }}
          borderColor={{ borderColor: Colors.goldenrod }}
        />
        <BattleDice
          text="Ion Particle Beam"
          id={"Ion Particle Beam"}
          number1={1}
          number2={12}
        />
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignContent: "center",
        }}
      >
        <BattleDice
          text="Plasma Cannon"
          id={"Plasma Cannon"}
          number1={1}
          number2={10}
        />
        <BattleDice
          text="350mm Railgun"
          id={"350mm Railgun"}
          number1={1}
          number2={8}
        />
      </View>
    </View>,
  ],
};

export { shipBattleDiceMapping };

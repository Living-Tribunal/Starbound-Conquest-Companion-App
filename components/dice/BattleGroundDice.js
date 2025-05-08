import React, { useEffect } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";

export default function BattleDice({
  text,
  number1,
  number2,
  tintColor,
  textStyle,
  borderColor,
  howManyDice,
  id,
}) {
  const [firstDice, setFirstDice] = React.useState(1);
  const {
    singleUserShip,
    hit,
    setHit,
    damageDone,
    setDamageDone,
    disabledButton,
    setDisabledButton,
    disabledButtonOnHit,
    setDisabledButtonOnHit,
    rolledD20,
    setRolledD20,
    weaponId,
    setWeaponId,
  } = useStarBoundContext();
  const threatLevel = singleUserShip?.threatLevel ?? null;
  const damageThreshold = singleUserShip?.damageThreshold ?? null;

  useEffect(() => {}, []);

  const rollDiceAnimation = () => {
    const interval = setInterval(() => {
      setFirstDice(
        Math.floor(Math.random() * (number2 - number1 + 1)) + number1
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final =
        Math.floor(Math.random() * (number2 - number1 + 1)) + number1;
      setFirstDice(final);

      if (id === "D20") {
        checkIfHit(final);
      } else {
        weaponDamageRoll(final);
      }
    }, 1000);
  };
  //console.log("In Dice:", JSON.stringify(singleUserShip.threatLevel, null, 2));
  //console.log(`First Dice ${id}: ${firstDice}`);

  const checkIfHit = (value) => {
    const newRolledValue = value;
    setFirstDice(newRolledValue);

    if (threatLevel === null) {
      console.log("No ship selected.");
      return null;
    }

    if (id === "D20") {
      setRolledD20(true);
      if (newRolledValue >= threatLevel) {
        console.log(
          `✅ Dice ${id} rolled ${newRolledValue} — HIT (≥ ${threatLevel})`
        );
        setHit("Hit");
        setDisabledButtonOnHit(false);
        setDisabledButton(false);
      } else {
        console.log(
          `❌ Dice ${id} rolled ${newRolledValue} — MISS (< ${threatLevel})`
        );
        setHit("Miss");
        setDisabledButtonOnHit(true);
        setDisabledButton(true);
      }
    } else {
      console.log(`🎲 Dice ${id} rolled ${newRolledValue} (no hit check)`);
    }
  };

  const weaponDamageRoll = (value) => {
    const newWeaponRolledValue = value;
    setFirstDice(newWeaponRolledValue);
    setWeaponId(id);
    console.log("weaponId:", id);
    //console.log(`🎲 Weapon Damage Roll ${newWeaponRolledValue}`);

    if (damageThreshold === null) {
      console.log("No ship selected.");
      return null;
    }
    if (id !== "D20") {
      const damageTakenValue = newWeaponRolledValue - damageThreshold;
      if (damageTakenValue < 0) {
        const damageTakenValueNegative = 0;
        setDamageDone(damageTakenValueNegative);
        console.log(
          `🎲 Damage Taken: ${damageTakenValueNegative} (negative damage)`
        );
      } else {
        console.log(`🎲 Damage Taken: ${damageTakenValue}`);
        setDamageDone(damageTakenValue);
      }
      setDisabledButton(true);
    }
  };

  const rollingBothDice = () => {
    rollDiceAnimation();
  };

  useEffect(() => {
    if (hit === "miss") {
      setDisabledButtonOnHit(true);
    } else {
      setDisabledButtonOnHit(false);
    }
  }, [hit]);

  useEffect(() => {
    if (singleUserShip === null) {
      setDisabledButton(true);
    } else {
      setDisabledButton(false);
    }
  }, [singleUserShip]);

  return (
    <View
      style={{
        flexDirection: "row",
        width: "45%",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <View style={styles.diceContainer}>
        <Text
          style={[
            disabledButton || (id !== "D20" && disabledButtonOnHit)
              ? styles.weaponDisabled
              : styles.weapon,
            !(disabledButton || (id !== "D20" && disabledButtonOnHit)) &&
              textStyle,
          ]}
        >
          {text}
        </Text>
        <TouchableOpacity
          disabled={
            disabledButton ||
            (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
          }
          onPress={rollingBothDice}
          style={[styles.button]}
        >
          <Text
            style={[
              disabledButton ||
              (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
                ? styles.disabledRollDiceBtnText
                : styles.rollDiceBtnText,
              !(
                disabledButton ||
                (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
              ) && textStyle,
            ]}
          >
            {howManyDice}D{number2}
          </Text>
          <Image
            style={[
              disabledButton ||
              (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
                ? styles.imageDisabled
                : styles.image,
              {
                tintColor:
                  disabledButton ||
                  (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
                    ? Colors.hudDarker
                    : tintColor,
              },
            ]}
            source={require("../../assets/images/inchud.png")}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[
          disabledButton ||
          (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
            ? styles.resultContainerDisabled
            : styles.resultContainer,
          !(
            disabledButton ||
            (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
          ) && borderColor,
        ]}
      >
        <Text
          style={[
            disabledButton ||
            (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
              ? styles.diceTextDisabled
              : styles.diceText,
            !(
              disabledButton ||
              (id !== "D20" && (!rolledD20 || disabledButtonOnHit))
            ) && textStyle,
          ]}
        >
          {firstDice}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diceContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  diceText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
  },
  diceTextDisabled: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.hudDarker,
    textAlign: "center",
  },
  rollDiceBtnText: {
    color: Colors.white,
    fontSize: 8,
    position: "absolute",
    marginTop: 13,
  },
  disabledRollDiceBtnText: {
    color: Colors.hudDarker,
    fontSize: 8,
    position: "absolute",
    marginTop: 13,
  },
  button: {
    alignItems: "center",
  },
  weapon: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
  },
  weaponDisabled: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.hudDarker,
    textAlign: "center",
  },
  resultContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    width: "30%",
    justifyContent: "center",
    marginHorizontal: 5,
    alignContent: "flex-end",
  },
  image: {
    width: 45,
    height: 45,
  },
  imageDisabled: {
    width: 45,
    height: 45,
    tintColor: Colors.hudDarker,
  },
  resultContainerDisabled: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    width: "30%",
    justifyContent: "center",
    marginHorizontal: 5,
    alignContent: "flex-end",
  },
});

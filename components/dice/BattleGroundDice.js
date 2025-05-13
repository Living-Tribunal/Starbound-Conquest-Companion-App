import React, { useEffect, useState } from "react";
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
  onRoll,
  id,
  numberOfDice,
  disabledButton: disabledProp = null,
  disabledButtonOnHit: disabledOnHitProp = null,
}) {
  const [firstDice, setFirstDice] = useState(0);
  const {
    singleUserShip,
    hit,
    setHit,
    setDamageDone,
    disabledButton: contextDisabledButton,
    setDisabledButton,
    disabledButtonOnHit: contextDisabledButtonOnHit,
    setDisabledButtonOnHit,
    rolledD20,
    setRolledD20,
    setWeaponId,
    setDiceValueToShare,
  } = useStarBoundContext();
  const threatLevel = singleUserShip?.threatLevel ?? null;
  const damageThreshold = singleUserShip?.damageThreshold ?? null;

  const disabledButton =
    disabledProp !== null ? disabledProp : contextDisabledButton;
  const disabledButtonOnHit =
    disabledOnHitProp !== null ? disabledOnHitProp : contextDisabledButtonOnHit;

  const rollMultipleDice = () => {
    const diceCount = numberOfDice || 1;

    const interval = setInterval(() => {
      const animatedResults = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * (number2 - number1 + 1)) + number1
      );
      setDiceResults(animatedResults);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalResults = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * (number2 - number1 + 1)) + number1
      );
      setDiceResults(finalResults);

      const total = finalResults.reduce((sum, val) => sum + val, 0);

      if (onRoll) {
        onRoll(total, id); // Or pass full array if you want
      }

      if (id === "D20") {
        checkIfHit(total); // Could also apply logic per die if needed
      } else {
        weaponDamageRoll(total);
      }
    }, 1000);
  };

  //console.log(`First Dice ${id}: ${firstDice}`);

  //console.log("In Dice:", JSON.stringify(diceValue, null, 2));

  const checkIfHit = (value) => {
    const newRolledValue = value;
    setFirstDice(newRolledValue);
    //setDiceValueToShare(newRolledValue);

    if (threatLevel === null) {
      //console.log("No ship selected.");
      return null;
    }

    if (id === "D20") {
      setRolledD20(true);
      if (newRolledValue >= threatLevel) {
        console.log(
          `✅ Dice ${id} rolled ${newRolledValue} — HIT (≥ ${threatLevel})`
        );
        setHit(true);
        setDisabledButtonOnHit(false);
        setDisabledButton(false);
      } else {
        console.log(
          `❌ Dice ${id} rolled ${newRolledValue} — MISS (< ${threatLevel})`
        );
        setHit(false);
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

    if (damageThreshold === null) {
      return null;
    }

    if (id !== "Ion Particle Beam") {
      const damageTakenValue = newWeaponRolledValue - damageThreshold;
      if (damageTakenValue < 0) {
        setDamageDone(0);
        console.log(`🎲 Damage Taken: 0 (negative damage)`);
      } else {
        setDamageDone(damageTakenValue);
        console.log(`🎲 Damage Taken: ${damageTakenValue}`);
      }
      setDisabledButton(true);
      setDisabledButtonOnHit(true);
    } else {
      //outside else to handle ion particle beam
      setDamageDone(newWeaponRolledValue);
      console.log(
        `⚡ Ion Beam direct damage: ${newWeaponRolledValue} (Bypasses soak)`
      );
      setDisabledButton(true);
      setDisabledButtonOnHit(true);
    }
  };

  const rollingBothDice = () => {
    rollDiceAnimation();
  };

  useEffect(() => {
    if (hit === false) {
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

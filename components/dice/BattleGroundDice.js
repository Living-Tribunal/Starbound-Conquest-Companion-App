import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useDiceContext } from "../Global/DiceContext";
export default function BattleDice({
  text,
  number1,
  number2,
  tintColor,
  textStyle,
  borderColor,
  id,
  numberOfDice,
  onRoll,
  disabledButton: disabledProp = null,
  disabledButtonOnHit: disabledOnHitProp = null,
}) {
  const [firstDice, setFirstDice] = useState(0);
  const [diceFaceModifier, setDiceFaceModifier] = useState(0);
  const [numberOfDiceModifier, setNumberOfDiceModifier] = useState(0);
  const { disableDiceModifiers } = useDiceContext();
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
  //console.log("selectedShip in BattleDice:", singleUserShip);

  const disabledButton =
    disabledProp !== null ? disabledProp : contextDisabledButton;
  const disabledButtonOnHit =
    disabledOnHitProp !== null ? disabledOnHitProp : contextDisabledButtonOnHit;

  useFocusEffect(
    useCallback(() => {
      setDiceFaceModifier(0);
      setNumberOfDiceModifier(0);
    }, [])
  );

  const rollDice = () => {
    const numDice = numberOfDice + numberOfDiceModifier;
    const diceSize = number2 + diceFaceModifier;
    let total = 0;
    let rolls = [];
    if (numberOfDice > 1) {
      let total = 0;
      for (let i = 0; i < numDice; i++) {
        const roll =
          Math.floor(Math.random() * (diceSize - number1 + 1)) + number1;
        rolls.push(roll);
        total += roll;
      }
      return total;
    } else {
      return (
        Math.floor(Math.random() * (number2 + diceFaceModifier - number1 + 1)) +
        number1
      );
    }
  };

  const rollDiceAnimation = () => {
    const interval = setInterval(() => {
      setFirstDice(
        Math.floor(Math.random() * (number2 - number1 + 1)) + number1
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final = rollDice();
      setFirstDice(final);

      if (onRoll) {
        onRoll(final, id);
      }

      if (id === "D20") {
        checkIfHit(final);
      } else {
        weaponDamageRoll(final);
      }
    }, 1000);
  };
  //console.log(`First Dice ${id}: ${firstDice}`);

  //console.log("In Dice:", JSON.stringify(diceValue, null, 2));

  const checkIfHit = (value) => {
    const newRolledValue = value;
    setFirstDice(newRolledValue);
    setDiceValueToShare(newRolledValue);

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
    //console.log(`🎲 Weapon Damage Roll ${newWeaponRolledValue}`);

    if (damageThreshold === null) {
      console.log("No ship selected.");
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

  const isDisabled = disabledButton || (id !== "D20" && hit === null);

  useEffect(() => {
    if (singleUserShip === null) {
      setDisabledButton(true);
    } else {
      setDisabledButton(false);
    }
  }, [singleUserShip]);

  const increaseNumberOfDiceFace = () => {
    if (disableDiceModifiers) {
      console.log("🔒 Modifier disabled");
      return;
    }
    setDiceFaceModifier((prev) => Math.min(prev + 2, 2));
    console.log(`Increased die face to D${number2 + diceFaceModifier + 2}`);
  };

  const decreaseNumberOfDiceFace = () => {
    if (disableDiceModifiers) {
      console.log("🔒 Modifier disabled");
      return;
    }
    setDiceFaceModifier((prev) => {
      if (prev - 2 >= 0) {
        return prev - 2;
      } else {
        console.log(`⚠️ Can't go below base die: D${number2}`);
        return prev;
      }
    });
  };

  const increaseNumberOfDice = () => {
    if (disableDiceModifiers) {
      console.log("🔒 Modifier disabled");
      return;
    }
    setNumberOfDiceModifier((prev) => prev + 1);
    console.log(
      `Increased number of dice to ${numberOfDice + numberOfDiceModifier}`
    );
  };

  const decreaseNumberOfDice = () => {
    if (disableDiceModifiers) {
      console.log("🔒 Modifier disabled");
      return;
    }
    setNumberOfDiceModifier((prev) => {
      const newTotal = numberOfDice + prev - 1;
      if (newTotal >= 1) {
        return prev - 1;
      } else {
        console.log(`⚠️ Can't roll fewer than 1 die`);
        return prev;
      }
    });
  };
  //console.log("disableDiceModifiers prop:", disableDiceModifiers);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: "50%",
      }}
    >
      {id !== "D20" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => decreaseNumberOfDiceFace()}
            onLongPress={() => decreaseNumberOfDice()}
            disabled={disableDiceModifiers}
            style={{
              justifyContent: "center",
              borderWidth: 1,
              borderColor: Colors.hud,
              borderRadius: 5,
              padding: 5,
              backgroundColor: Colors.hudDarker,
              alignSelf: "center",
              width: "35%",
            }}
          >
            <Text
              style={{
                color: Colors.hud,
                textAlign: "center",
                fontSize: 10,
              }}
            >
              -
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.diceContainer}>
        <Text
          style={[
            disabledButton || (id !== "D20" && hit === null)
              ? styles.weaponDisabled
              : styles.weapon,
            !(disabledButton || (id !== "D20" && hit === null)) && textStyle,
          ]}
        >
          {text}
        </Text>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={rollingBothDice}
          style={[styles.button]}
        >
          <Text
            style={[
              isDisabled
                ? styles.disabledRollDiceBtnText
                : styles.rollDiceBtnText,
              !isDisabled && textStyle,
            ]}
          >
            {numberOfDice + numberOfDiceModifier || 1}D
            {number2 + diceFaceModifier || 0}
          </Text>
          <Image
            style={[
              isDisabled ? styles.imageDisabled : styles.image,
              {
                tintColor: isDisabled ? Colors.hudDarker : tintColor,
              },
            ]}
            source={require("../../assets/images/inchud.png")}
          />
        </TouchableOpacity>
      </View>
      {id !== "D20" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => increaseNumberOfDiceFace()}
            onLongPress={() => increaseNumberOfDice()}
            disabled={disableDiceModifiers}
            style={{
              justifyContent: "center",
              borderWidth: 1,
              borderColor: Colors.hud,
              borderRadius: 5,
              padding: 5,
              backgroundColor: Colors.hudDarker,
              alignSelf: "center",
              width: "35%",
            }}
          >
            <Text
              style={{
                color: Colors.hud,
                textAlign: "center",
                fontSize: 10,
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={[
          isDisabled ? styles.resultContainerDisabled : styles.resultContainer,
          !isDisabled && borderColor,
        ]}
      >
        <Text
          style={[
            isDisabled ? styles.diceTextDisabled : styles.diceText,
            !isDisabled && textStyle,
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
    marginTop: 19,
  },
  disabledRollDiceBtnText: {
    color: Colors.hudDarker,
    fontSize: 8,
    position: "absolute",
    marginTop: 19,
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
    width: 55,
    height: 55,
  },
  imageDisabled: {
    width: 55,
    height: 55,
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

import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import Toast from "react-native-toast-message";

export default async function SpecialOrderBonuses({
  orderName,
  ship,
  localDiceRoll,
  user,
  setData,
  setLocalDiceRoll,
  firstDice,
}) {
  console.log("🛠️ specialOrderBonuses fired with:", {
    orderName,
    ship,
    localDiceRoll,
  });

  if (!ship || localDiceRoll === undefined) {
    return;
  }

  switch (orderName) {
    case "All Ahead Full":
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);

        if (localDiceRoll >= 11) {
          const bonus = ship.moveDistance;
          //console.log("Bonus applied:", bonus);
          //console.log("Local Dice Roll:", localDiceRoll);
          await updateDoc(shipRef, {
            [`bonuses.moveDistanceBonus`]: bonus,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });

          // Update local state properly
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    bonuses: {
                      ...(s.bonuses || {}),
                      moveDistanceBonus: bonus,
                    },
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );

          Toast.show({
            type: "success",
            text1: "All Ahead Full!",
            text2: "Movement speed x2.",
            position: "top",
          });
        } else {
          const bonus = ship.moveDistance / 2;
          console.log("Bonus applied:", bonus);
          await updateDoc(shipRef, {
            [`bonuses.moveDistanceBonus`]: bonus,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });
          console.log("Updating local state for ship:", ship);

          // Update local state properly
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    bonuses: {
                      ...(s.bonuses || {}),
                      moveDistanceBonus: bonus,
                    },
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "error",
            text1: "All Ahead Full!",
            text2: "Movement speed increased by half.",
            position: "top",
          });
        }
      } catch (error) {
        console.error("❌ Failed to update moveDistanceBonus:", error);
      }
      break;
    case "Reinforce Shields":
      if (ship.hp === ship.maxHP) {
        Toast.show({
          type: "error",
          text1: "Ship HP is already at max.",
          text2: `No bonus added`,
          position: "top",
        });
        return;
      }
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);

        if (localDiceRoll >= 11) {
          const newHP = Math.max(0, Math.min(Number(ship.hp + 1), ship.maxHP));

          updateDoc(shipRef, {
            hp: newHP,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });
          // Update local data
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    hp: newHP,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "success",
            text1: "Shields Reinforced!",
            text2: `+1 HP (now at ${newHP}/${ship.maxHP})`,
            position: "top",
          });
        } else {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "error",
            text1: "Shields Reinforcement Failed!",
            text2: `No bonus added`,
            position: "top",
          });
        }
      } catch (error) {
        console.error("❌ Failed to update shields in Firestore:", error);
      }
      break;
    case "Evasive Maneuvers":
      console.log("Evasive Maneuvers");
      break;
    case "Combine Fire":
      console.log("Combine Fire");
      break;
    case "Anti-Fighter Barrage":
      console.log("Anti-Fighter Barrage");
      break;
    case "Power Up Main Guns":
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
        if (localDiceRoll >= 11 && ship.type === "Destroyer") {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );

          Toast.show({
            type: "success",
            text1: "Power Up Main Guns!",
            position: "top",
          });
        } else {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "error",
            text1: "Power Up Main Guns Failed!",
            position: "top",
          });
        }
      } catch (error) {
        console.error("❌ Failed to update moveDistanceBonus:", error);
      }
      break;
    case "All Systems Fire":
      console.log("All Systems Fire Bonus");
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
        if (localDiceRoll >= 11) {
          console.log("All Systems Fire:", localDiceRoll);
          const weaponStatuses = ship.weaponStatus || {};
          const weaponStatusesUpdated = {};
          for (const weaponName in weaponStatuses) {
            weaponStatusesUpdated[`weaponStatus.${weaponName}`] = false;
          }
          await updateDoc(shipRef, {
            ...weaponStatusesUpdated,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
            hasRolledDToHit: false,
            hit: false,
            isToggled: false,
          });

          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    hit: false,
                    hasRolledDToHit: false,
                    isToggled: false,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );

          Toast.show({
            type: "success",
            text1: "All systems, ready to fire!",
            position: "top",
          });
        } else {
          await updateDoc(shipRef, {
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
            hasRolledDToHit: true,
            hit: true,
            isToggled: true,
          });
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    hasRolledDToHit: true,
                    hit: true,
                    isToggled: true,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "error",
            text1: "Unable to reintialize systems.",
            position: "top",
          });
        }
      } catch (error) {
        console.error("Failed to update hit in Firestore:", error);
      }

      break;
    case "Broadside":
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
        if (localDiceRoll >= 11) {
          updateDoc(shipRef, {
            "bonuses.broadSideBonus": 50,
            hasRolledDToHit: false,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
          });
          // Update local data
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    bonuses: {
                      ...(s.bonuses || {}),
                      broadSideBonus: 50,
                    },
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "success",
            text1: "Starbound Conquest",
            text2: "Plasma Cannons range increased by 50%.",
            position: "top",
          });
        } else {
          await updateDoc(shipRef, {
            "bonuses.broadSideBonus": 25,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
          });

          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    bonuses: {
                      ...(s.bonuses || {}),
                      broadSideBonus: 25,
                    },
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "error",
            text1: "Starbound Conquest",
            text2: "Plasma Cannons range increased by 25%.",
            position: "top",
          });
        }
      } catch (error) {
        console.error("Failed to update broadSideBonus in Firestore:", error);
      }
      break;
    case "Launch Fighters":
      if (Number(localDiceRoll) >= 19 && ship.type === "Carrier") {
        try {
          const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: true,
            maxCapacity: 20,
          });
          // Update local data
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    maxCapacity: 20,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );
          Toast.show({
            type: "success",
            text1: "Starbound Conquest",
            text2: "Launched Fighters!",
            position: "top",
          });
        } catch (e) {
          console.error("Failed to update launch fighters in Firestore:", e);
        }
      } else {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
        await updateDoc(shipRef, {
          [`specialOrdersAttempted.${orderName}`]: true,
        });
        setData((prevData) =>
          prevData.map((s) =>
            s.id === ship.id
              ? {
                  ...s,
                  specialOrdersAttempted: {
                    ...(s.specialOrdersAttempted || {}),
                    [orderName]: true,
                  },
                  shipActions: {
                    ...(s.shipActions || {}),
                    specialOrder: true,
                  },
                }
              : s
          )
        );
        Toast.show({
          type: "error",
          text1: "Starbound Conquest",
          text2: "Launch Fighters Failed!",
          position: "top",
        });
      }
      break;
    case "Charge Ion Beams":
      //console.log("Ion Beam check - ship.hit:", ship.hit);
      console.log("Starting Charge Ion Beams Bonus");
      if (localDiceRoll >= 2) {
        console.log("Bonus (Ion):", localDiceRoll);
        try {
          const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
          await updateDoc(shipRef, {
            "weaponStatus.Ion Particle Beam": false,
            "specialOrders.Charge Ion Beam": true,
            hit: false,
          });
          setLocalDiceRoll(firstDice);
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    hit: false,
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: true,
                    },
                  }
                : s
            )
          );

          Toast.show({
            type: "success",
            text1: "Ion Particle Beam Recharges!",
            position: "top",
          });
        } catch (error) {
          console.error("Failed to update hit in Firestore:", error);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Ion Particle Beam Recharge Failed!",
          position: "top",
        });
      }
      break;
    default:
      console.log("No special order selected");
  }
}

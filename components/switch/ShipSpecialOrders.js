import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import Toast from "react-native-toast-message";
import { updateShipIsToggled } from "../Functions/updateShipIsToggled";

export default async function SpecialOrderBonuses({
  orderName,
  ship,
  localDiceRoll,
  user,
  setData,
  setLocalDiceRoll,
  firstDice,
}) {
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
            "shipActions.move": false,
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
                      move: false,
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
            "shipActions.move": false,
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
                      move: false,
                    },
                  }
                : s
            )
          );
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              move: false,
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
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

          await updateDoc(shipRef, {
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
            [`specialOrders.${orderName}`]: false,
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
                      [orderName]: false,
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
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
            text1: "Starbound Conquest",
            text2: "Anti-Fighter Barrage Engaged!",
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
          Toast.show({
            type: "error",
            text1: "Starbound Conquest",
            text2: "Anti-Fighter Barrage Failed!",
            position: "top",
          });
        }
      } catch (error) {
        console.error(
          "Failed to update Anti-Fighter Barrage in Firestore:",
          error
        );
      }
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
            [`specialOrders.${orderName}`]: false,
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
                      [orderName]: false,
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
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
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
        if (localDiceRoll >= 11) {
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
            "shipActions.attack": false,
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
                      attack: false,
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
            [`specialOrders.${orderName}`]: false,
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
                      [orderName]: false,
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
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
          const weaponStatuses = ship.weaponStatus || {};
          const weaponStatusesUpdated = {};
          for (const weaponName in weaponStatuses) {
            weaponStatusesUpdated[`weaponStatus.${weaponName}`] = false;
          }
          await updateDoc(shipRef, {
            ...weaponStatusesUpdated,
            "bonuses.broadSideBonus": 30,
            hasRolledDToHit: false,
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
            "shipActions.move": false,
            hasRolledDToHit: false,
            hit: false,
            isToggled: false,
          });
          // Update local data
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    hit: false,
                    hasRolledDToHit: false,
                    isToggled: false,
                    bonuses: {
                      ...(s.bonuses || {}),
                      broadSideBonus: 30,
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
            text1: "Systems have been reinitialized.",
            position: "top",
          });
        } else {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: false,
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
          Toast.show({
            type: "error",
            text1: "Unable to reintialize systems!",
            position: "top",
          });
        }
      } catch (error) {
        console.error("Failed to update broadSideBonus in Firestore:", error);
      }
      break;
    case "Launch Fighters":
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
        //change this value to 11 when you're ready to launch fighters
        if (Number(localDiceRoll) >= 2 && ship.type === "Carrier") {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "shipActions.specialOrder": true,
            currentCapacity: 20,
          });
          // Update local data
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    currentCapacity: 20,
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
          Toast.show({
            type: "error",
            text1: "Starbound Conquest",
            text2: "Launch Fighters Failed!",
            position: "top",
          });
        }
      } catch (e) {
        console.error("Failed to update launch fighters in Firestore:", e);
      }
      break;
    case "Charge Ion Beams":
      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);

        if (localDiceRoll >= 5) {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: true,
            [`specialOrdersAttempted.${orderName}`]: true,
            "specialWeaponStatus.Ion Particle Beam": false,
            "specialWeaponStatusAttempted.Ion Particle Beam": false,
            "shipActions.specialOrder": false,
            hit: false,
          });

          setLocalDiceRoll(firstDice);
          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    hit: false,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: true,
                    },
                    "specialWeaponStatusAttempted.Ion Particle Beam": false,
                    "specialWeaponStatus.Ion Particle Beam": false,
                    specialOrdersAttempted: {
                      ...(s.specialOrdersAttempted || {}),
                      [orderName]: true,
                    },
                    shipActions: {
                      ...(s.shipActions || {}),
                      specialOrder: false,
                    },
                  }
                : s
            )
          );

          Toast.show({
            type: "success",
            text1: "Starbound Conquest",
            text2: "Ion Particle Beam Recharged!",
            position: "top",
          });
        } else {
          await updateDoc(shipRef, {
            [`specialOrders.${orderName}`]: false,
            [`specialOrdersAttempted.${orderName}`]: true,
            "specialWeaponStatusAttempted.Ion Particle Beam": true,
            "shipActions.specialOrder": true,
          });

          setData((prevData) =>
            prevData.map((s) =>
              s.id === ship.id
                ? {
                    ...s,
                    specialOrders: {
                      ...(s.specialOrders || {}),
                      [orderName]: false,
                    },
                    "specialWeaponStatus.Ion Particle Beam": false,
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
          const updatedShip = {
            ...ship,
            shipActions: {
              ...(ship.shipActions || {}),
              specialOrder: true,
            },
          };
          await updateShipIsToggled(user, updatedShip, setData);
          Toast.show({
            type: "error",
            text1: "Starbound Conquest",
            text2: "Unable to charge Ion Beam.",
            position: "top",
          });
        }
      } catch (err) {
        console.error("Failed to mark special order attempt:", err);
      }

      break;
    default:
      console.log("No special order selected");
  }
}

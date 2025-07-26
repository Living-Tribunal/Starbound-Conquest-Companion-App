import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";

export const updateShipIsToggled = async (user, selectedShip) => {
  if (!selectedShip || !user) return;
  try {
    const { move, attack, specialOrder } = selectedShip.shipActions || {};
    const actionsTaken = [move, attack, specialOrder].filter(Boolean).length;

    if (actionsTaken >= 2) {
      const shipRef = doc(
        FIREBASE_DB,
        "users",
        user.uid,
        "ships",
        selectedShip.id
      );
      await updateDoc(shipRef, {
        isToggled: true,
      });
      setData((prevData) =>
        prevData.map((s) =>
          s.id === selectedShip.id
            ? {
                ...s,
                isToggled: true,
              }
            : s
        )
      );
    }
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

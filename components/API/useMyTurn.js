import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useTurnContext } from "../Global/TurnContext";

export default function useMyTurn() {
  const { myTurn, setMyTurn } = useTurnContext();
  const [state, setState] = useState(null);

  const uid = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", uid);
    const unsubscribe = onSnapshot(gameRoomRef, (docSnap) => {
      if (!docSnap.exists()) {
        setMyTurn(false);
        setState(null);
        return;
      }
      const s = docSnap.data();
      setMyTurn(s.currentTurnUid === uid);
      setState({ id: docSnap.id, ...s });
    });
    return unsubscribe;
  }, [setMyTurn, uid]);

  return { myTurn, state };
}

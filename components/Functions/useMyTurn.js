import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useTurnContext } from "../Global/TurnContext";

export default function useMyTurn(gameRoomID) {
  const { myTurn, setMyTurn } = useTurnContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  const uid = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    if (!uid || !gameRoomID) {
      setState(null);
      setMyTurn(false);
      setLoading(false);
      return;
    }

    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", gameRoomID);
    const unsubscribe = onSnapshot(gameRoomRef, (docSnap) => {
      if (!docSnap.exists()) {
        setMyTurn(false);
        setState(null);
        return;
      }
      const s = docSnap.data();
      setMyTurn(s.currentTurnUid.uid === uid);
      setState({ id: docSnap.id, ...s });
    });
    setLoading(false);
    return unsubscribe;
  }, [setMyTurn, uid, gameRoomID]);

  return { myTurn, state, loading };
}

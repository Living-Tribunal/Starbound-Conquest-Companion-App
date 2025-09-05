import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useTurnContext } from "../Global/TurnContext";

export default function useMyTurn(playerGameRoomID) {
  const { myTurn, setMyTurn } = useTurnContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  const uid = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    if (!uid || !playerGameRoomID) {
      setState(null);
      setMyTurn(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", playerGameRoomID);
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
  }, [setMyTurn, uid, playerGameRoomID]);

  return { myTurn, state, loading };
}

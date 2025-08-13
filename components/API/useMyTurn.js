import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useTurnContext } from "../Global/TurnContext";

export default function useMyTurn(gameRoomID) {
  const { myTurn, setMyTurn } = useTurnContext();
  const [state, setState] = useState(null);

  const uid = FIREBASE_AUTH.currentUser?.uid;
  useEffect(() => {
    if (!gameRoomID || !uid) return;

    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", gameRoomID);
    const unsubscribe = onSnapshot(gameRoomRef, (docSnap) => {
      if (!docSnap.exists()) {
        setMyTurn(false);
        setState(null);
        return;
      }
      const s = docSnap.data();
      setMyTurn(s.currentTurnUid === uid);
      setState(s);
    });
    console.log("Game Room Ref:", gameRoomRef);

    return unsubscribe;
  }, [gameRoomID, uid]);

  return { myTurn, state };
}

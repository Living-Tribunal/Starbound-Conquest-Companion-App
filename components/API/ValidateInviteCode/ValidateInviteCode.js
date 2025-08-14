import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";

export async function validateInviteCode(inviteCode) {
  const code = inviteCode.trim();
  if (!code) return false;

  const snap = await getDoc(doc(FIREBASE_DB, "gameRooms", code));
  return snap.exists();
}

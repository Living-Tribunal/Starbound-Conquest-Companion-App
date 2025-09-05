import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";

export default async function fetchUser(userId) {
  if (!userId) return null;
  try {
    const docRef = doc(FIREBASE_DB, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const playerData = docSnap.data();
      return playerData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

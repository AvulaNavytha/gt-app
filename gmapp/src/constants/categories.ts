import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

let FOOD_CATEGORIES: readonly string[] = [];

(async () => {
  const collectionRef = collection(db, "FOOD_CATEGORIES");
  const querySnapshot = await getDocs(collectionRef);
  const firstDoc = querySnapshot.docs[0];
  const firstDocData = firstDoc.data();
  const dArray = firstDocData.foodcategories;

  FOOD_CATEGORIES = dArray as const;
})();

export { FOOD_CATEGORIES };

export const SCREENS = ["Screen 1", "Screen 2", "Screen 3"] as const;

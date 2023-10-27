import { firestore } from './firebaseConfig';
import { doc, onSnapshot } from '@firebase/firestore';

// export const fetchDefaultSetup = async () => {
//   try {
//     const docRef = doc(firestore, 'setup', 'defaultSetup');
//     const docSnapshot = await getDoc(docRef);
//     if (docSnapshot.exists()) {
//       return docSnapshot.data();
//     } else {
//       throw new Error('Document does not exist');
//     }
//   } catch (err) {
//     throw err;
//   }
// };

export const fetchDefaultSetup = () => {
  return new Promise<any>((resolve, reject) => {
    const docRef = doc(firestore, 'setup', 'defaultSetup');
    
    const unsubscribe = onSnapshot(docRef, docSnapshot => {
      if (docSnapshot.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }
      
      if (docSnapshot.exists()) {
        resolve(docSnapshot.data());
      } else {
        reject(new Error('Document does not exist'));
      }

      unsubscribe();  // Important: We stop listening after handling the initial snapshot.

    }, error => {
      console.error("Snapshot error:", error);
      reject(error);
      unsubscribe();  // Important: Stop listening if there's an error.
    });
  });
};


export {};
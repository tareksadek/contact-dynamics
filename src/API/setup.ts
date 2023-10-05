import { firestore } from './firebaseConfig';
import { doc, getDoc } from '@firebase/firestore';

export const fetchDefaultSetup = async () => {
  try {
    const docRef = doc(firestore, 'setup', 'defaultSetup');
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error('Document does not exist');
    }
  } catch (err) {
    throw err;
  }
};

export {};
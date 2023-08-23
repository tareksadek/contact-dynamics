import { firestore } from './firebaseConfig';

export const fetchDefaultSetup = async () => {
  try {
    const doc = await firestore.collection('setup').doc('defaultSetup').get();
    if (doc.exists) {
      return doc.data();
    } else {
      throw new Error('Document does not exist');
    }
  } catch (err) {
    throw err;
  }
};
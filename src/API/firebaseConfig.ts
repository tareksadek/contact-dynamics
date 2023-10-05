import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getStorage } from '@firebase/storage';
import { getFunctions } from '@firebase/functions';

import { 
  initializeFirestore, 
  persistentLocalCache,
  persistentSingleTabManager, 
  CACHE_SIZE_UNLIMITED 
} from '@firebase/firestore';
import { firebaseConfig } from '../setup/setup';

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const firestore = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentSingleTabManager({})
  })
});

export const storage = getStorage(firebaseApp);

export const functions = getFunctions(firebaseApp);

export default firebaseApp;

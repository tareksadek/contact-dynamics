import { Timestamp } from '@firebase/firestore-types';
import { firestore } from './firebaseConfig';
import { doc, setDoc, getDoc, collection, where, getDocs, query, deleteDoc, updateDoc, serverTimestamp, onSnapshot } from '@firebase/firestore';
import { UserType } from '../types/user';

export const createUserDocument = async (userId: string, userData: Partial<UserType>) => {
	try {
		const userRef = doc(firestore, 'users', userId);
		await setDoc(userRef, userData);
		return { success: true };
	} catch (error) {
		console.error("Error creating user document:", error);
		return { success: false, error: (error as Error).message };
	}
};

// export const getUserById = async (userId: string) => {
// 	try {
// 		const userRef = doc(firestore, 'users', userId);
// 		const userDoc = await getDoc(userRef);

// 		if (userDoc.exists()) {
// 			const user = userDoc.data()
// 			if (user.createdOn && typeof user.createdOn !== 'string') {
// 				const createdOnTimestamp = user.createdOn as unknown as Timestamp;
// 				user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
// 			}
// 			if (user.lastLogin && typeof user.lastLogin !== 'string') {
// 				const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
// 				user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
// 			}
// 			const userData = { ...user, id: userId };
// 			return { success: true, data: userData };
// 		} else {
// 			throw new Error('User document does not exist');
// 		}
// 	} catch (error) {
// 		console.error("Error fetching user document:", error);
// 		return { success: false, error: (error as Error).message };
// 	}
// };

export const getUserById = (userId: string) => {
  return new Promise<{ success: boolean, data?: any, error?: string }>((resolve, reject) => {
    const userRef = doc(firestore, 'users', userId);
    
    const unsubscribe = onSnapshot(userRef, userDoc => {
      if (userDoc.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }
      
      if (userDoc.exists()) {
        let user = userDoc.data() as any;
        if (user.createdOn && typeof user.createdOn !== 'string') {
          const createdOnTimestamp = user.createdOn as unknown as Timestamp;
          user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
        }
        if (user.lastLogin && typeof user.lastLogin !== 'string') {
          const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
          user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
        }
        const userData = { ...user, id: userId };
        resolve({ success: true, data: userData });
      } else {
        reject({ success: false, error: 'User document does not exist' });
      }

      unsubscribe();  // Important: We stop listening after handling the initial snapshot.

    }, error => {
      console.error("Snapshot error:", error);
      reject({ success: false, error: error.message });
      unsubscribe();  // Important: Stop listening if there's an error.
    });
  });
};


// export const getUserByProfileSuffix = async (profileSuffix: string) => {
// 	try {
// 		const db = firestore;
// 		const userRef = collection(db, "users");
// 		const q = query(userRef, where("profileUrlSuffix", "==", profileSuffix));
// 		const userSnapshot = await getDocs(q);

// 		if (!userSnapshot.empty) {
// 			const firstDoc = userSnapshot.docs[0];
// 			const user = firstDoc.data()
// 			if (user.createdOn && typeof user.createdOn !== 'string') {
// 				const createdOnTimestamp = user.createdOn as unknown as Timestamp;
// 				user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
// 			}
// 			if (user.lastLogin && typeof user.lastLogin !== 'string') {
// 				const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
// 				user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
// 			}
// 			const userData = { ...user, id: firstDoc.id };
// 			return { success: true, data: userData };
// 		} else {
// 			throw new Error('User with the given profile suffix does not exist');
// 		}
// 	} catch (error) {
// 		console.error("Error fetching user by profile suffix:", error);
// 		return { success: false, error: (error as Error).message };
// 	}
// };

export const getUserByProfileSuffix = (profileSuffix: string) => {
  return new Promise<{ success: boolean, data?: any, error?: string }>((resolve, reject) => {
    const db = firestore;
    const userRef = collection(db, "users");
    const q = query(userRef, where("profileUrlSuffix", "==", profileSuffix));

    const unsubscribe = onSnapshot(q, userSnapshot => {
      if (userSnapshot.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }

      if (!userSnapshot.empty) {
        const firstDoc = userSnapshot.docs[0];
        let user = firstDoc.data();
        if (user.createdOn && typeof user.createdOn !== 'string') {
          const createdOnTimestamp = user.createdOn as unknown as Timestamp;
          user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
        }
        if (user.lastLogin && typeof user.lastLogin !== 'string') {
          const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
          user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
        }
        const userData = { ...user, id: firstDoc.id };
        resolve({ success: true, data: userData });
      } else {
        reject({ success: false, error: 'User with the given profile suffix does not exist' });
      }

      unsubscribe();  // Stop listening after handling the initial snapshot.

    }, error => {
      console.error("Snapshot error:", error);
      reject({ success: false, error: error.message });
      unsubscribe();  // Important: Stop listening if there's an error.
    });
  });
};

const deleteSubcollection = async (parentRef: any, subcollectionName: string) => {
	const subcolRef = collection(parentRef, subcollectionName);
	const snapshot = await getDocs(subcolRef);

	if (!snapshot.empty) {
		for (const doc of snapshot.docs) {
			await deleteDoc(doc.ref);
		}
	}
};

const deleteProfilesAndSubcollections = async (userRef: any) => {
	const profilesColRef = collection(userRef, 'profiles');
	const profileSnapshot = await getDocs(profilesColRef);

	for (const profileDoc of profileSnapshot.docs) {
		// Delete subcollections of each profile
		await deleteSubcollection(profileDoc.ref, 'profileImage');
		await deleteSubcollection(profileDoc.ref, 'links');
		await deleteSubcollection(profileDoc.ref, 'visits');

		// Delete the profile document itself
		await deleteDoc(profileDoc.ref);
	}
}

export const deleteUserDocument = async (userId: string) => {
	const userRef = doc(firestore, 'users', userId);

	// Delete profiles and their subcollections
	await deleteProfilesAndSubcollections(userRef);

	// Delete the main user document
	await deleteDoc(userRef);

	return { success: true };
};

export const getAllUsers = async (): Promise<{ success: boolean; data: UserType[]; error?: string }> => {
  try {
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);

		const users: UserType[] = [];

		if (usersSnapshot.empty) {
			return { success: true, data: [] };
		} else {
			usersSnapshot.forEach(doc => {
				const user = doc.data() as UserType;
				// Convert Firestore Timestamp to JS Date
				if (user.createdOn && typeof user.createdOn !== 'string') {
					const createdOnTimestamp = user.createdOn as unknown as Timestamp;
					user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
				}
				if (user.lastLogin && typeof user.lastLogin !== 'string') {
					const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
					user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
				}
				
				if (!user.isAdmin) {
          users.push({ ...user, id: doc.id });
        }
			});
			
			return { success: true, data: users };
		}
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { success: false, data: [], error: (error as Error).message };
  }
};

export const updateActiveProfileId = async (userId: string, activeProfileId: string) => {
	try {
			const userRef = doc(firestore, 'users', userId);
			await updateDoc(userRef, {
					activeProfileId: activeProfileId
			});
			return { success: true };
	} catch (error) {
			console.error("Error updating active profile ID:", error);
			return { success: false, error: (error as Error).message };
	}
};

export const updateLastLogin = async (userId: string) => {
	try {
			const userRef = doc(firestore, 'users', userId);
			await updateDoc(userRef, {
					lastLogin: serverTimestamp()
			});
			return { success: true };
	} catch (error) {
			console.error("Error updating last login:", error);
			return { success: false, error: (error as Error).message };
	}
};

// export const redirectUserProfiles = async (userId: string, active: boolean, redirectUrl?: string) => {
//   try {
//     const userRef = doc(firestore, 'users', userId);

//     // Check if redirectUrl is available when trying to activate
//     if (active && !redirectUrl) {
//       throw new Error("A URL is required to activate redirection.");
//     }

//     await updateDoc(userRef, {
//       redirect: {
//         active,
//         url: redirectUrl || null
//       }
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Error redirecting profiles:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

export const redirectUserProfiles = async (userId: string, active: boolean, redirectUrl?: string) => {
  const userRef = doc(firestore, 'users', userId);

  // Check if redirectUrl is available when trying to activate
  if (active && !redirectUrl) {
    const errMsg = "A URL is required to activate redirection.";
    console.error(errMsg);
    return { success: false, error: errMsg };
  }

  // Start the write operation
  updateDoc(userRef, {
    redirect: {
      active,
      url: redirectUrl || null
    }
  }).catch(error => {
    console.error("Error redirecting profiles:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.metadata.hasPendingWrites) {
        console.log("Data is being written...");
      }

      if (doc.metadata.fromCache) {
        console.log("Data came from cache.");
        unsubscribe(); // Stop listening to changes.
        resolve({ success: true });
      }

      if (!doc.metadata.hasPendingWrites && !doc.metadata.fromCache) {
        console.log("Data came from the server.");
        unsubscribe(); // Stop listening to changes.
        resolve({ success: true });
      }
    }, (error) => {
      console.error("Snapshot error:", error);
      unsubscribe();
      reject({ success: false, error: error.message });
    });
  });
};

export { };

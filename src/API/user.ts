import { Timestamp } from '@firebase/firestore-types';
import { firestore } from './firebaseConfig';
import { doc, setDoc, getDoc, collection, where, getDocs, query, deleteDoc, updateDoc, serverTimestamp } from '@firebase/firestore';
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

export const getUserById = async (userId: string) => {
	try {
		const userRef = doc(firestore, 'users', userId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const user = userDoc.data()
			if (user.createdOn && typeof user.createdOn !== 'string') {
				const createdOnTimestamp = user.createdOn as unknown as Timestamp;
				user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
			}
			if (user.lastLogin && typeof user.lastLogin !== 'string') {
				const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
				user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
			}
			const userData = { ...user, id: userId };
			return { success: true, data: userData };
		} else {
			throw new Error('User document does not exist');
		}
	} catch (error) {
		console.error("Error fetching user document:", error);
		return { success: false, error: (error as Error).message };
	}
};

export const getUserByProfileSuffix = async (profileSuffix: string) => {
	try {
		const db = firestore;
		const userRef = collection(db, "users");
		const q = query(userRef, where("profileUrlSuffix", "==", profileSuffix));
		const userSnapshot = await getDocs(q);

		if (!userSnapshot.empty) {
			const firstDoc = userSnapshot.docs[0];
			const user = firstDoc.data()
			if (user.createdOn && typeof user.createdOn !== 'string') {
				const createdOnTimestamp = user.createdOn as unknown as Timestamp;
				user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
			}
			if (user.lastLogin && typeof user.lastLogin !== 'string') {
				const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
				user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
			}
			const userData = { ...user, id: firstDoc.id };
			return { success: true, data: userData };
		} else {
			throw new Error('User with the given profile suffix does not exist');
		}
	} catch (error) {
		console.error("Error fetching user by profile suffix:", error);
		return { success: false, error: (error as Error).message };
	}
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

export const redirectUserProfiles = async (userId: string, active: boolean, redirectUrl?: string) => {
  try {
    const userRef = doc(firestore, 'users', userId);

    // Check if redirectUrl is available when trying to activate
    if (active && !redirectUrl) {
      throw new Error("A URL is required to activate redirection.");
    }

    await updateDoc(userRef, {
      redirect: {
        active,
        url: redirectUrl || null
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error redirecting profiles:", error);
    return { success: false, error: (error as Error).message };
  }
};


export { };

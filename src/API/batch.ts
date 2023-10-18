import { Timestamp } from '@firebase/firestore-types';
import { firestore } from './firebaseConfig';
import { addDoc, getDocs, collection, doc, getDoc, updateDoc, query, deleteDoc, where } from '@firebase/firestore';
import { BatchData, InvitationData } from '../types/userInvitation';
import { createInvitations } from './invitations';

export const getBatchById = async (batchId: string) => {
	try {
		const batchRef = doc(firestore, 'batches', batchId);
		const batchDoc = await getDoc(batchRef);

		let batch: any = null; // Declare batch here

		if (batchDoc.exists()) {
			batch = batchDoc.data();
			batch.id = batchDoc.id;

			if (batch && batch.createdOn && typeof batch.createdOn !== 'string') {
				const timestamp = batch.createdOn as unknown as Timestamp;
				batch.createdOn = new Date(timestamp.seconds * 1000);
			}
		}

		return batch;
	} catch (error) {
		console.error("Error fetching batch by ID:", error);
		throw error;
	}
};

export const updateInvitation = async (batchId: string, invitationId: string, updatedData: any) => {
	try {
		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);
		await updateDoc(invitationRef, updatedData);
		return { success: true };
	} catch (error) {
		console.error("Error updating invitation:", error);
		return { success: false, error: (error as Error).message };
	}
};

export const createBatchWithInvitations = async (
	batchData: BatchData,
	numberOfInvitations: number
): Promise<BatchData | null> => {
	try {
		const batchRef = await addDoc(collection(firestore, 'batches'), batchData);

		const batch = await getBatchById(batchRef.id);
		if (batch) {
			batch.id = batchRef.id;
			await createInvitations(batch, numberOfInvitations, batchData.isTeams);
			return batch;
		}

		return null;
	} catch (error) {
		console.error("Error creating batch with invitations:", error);
		return null;
	}
};

export const updateBatchTitleData = async (
	batchId: string,
	newTitle: string
): Promise<{ success: boolean; error?: string }> => {
	try {
		const batchRef = doc(firestore, 'batches', batchId);
		await updateDoc(batchRef, { title: newTitle });
		return { success: true };
	} catch (error) {
		console.error("Error updating batch title:", error);
		return { success: false, error: (error as Error).message };
	}
};

export const getAllBatches = async (): Promise<BatchData[] | null> => {
	try {
		const batchesQuery = query(collection(firestore, 'batches'));
		const batchSnapshot = await getDocs(batchesQuery);

		const batches: BatchData[] = [];
		batchSnapshot.forEach(doc => {
			const batch = doc.data() as BatchData;
			// Convert Firestore Timestamp to JS Date
			if (batch && batch.createdOn && typeof batch.createdOn !== 'string') {
				const timestamp = batch.createdOn as unknown as Timestamp;
				batch.createdOn = new Date(timestamp.seconds * 1000);
			}
			batches.push({ ...batch, id: doc.id });
		});

		return batches;
	} catch (error) {
		console.error("Error fetching all batches:", error);
		return null;
	}
};

export const deleteBatchById = async (id: string): Promise<boolean> => {
  try {
    const batchDoc = doc(firestore, 'batches', id);
    await deleteDoc(batchDoc);
    return true;
  } catch (error) {
    console.error("Error deleting batch:", error);
    return false;
  }
};

export const checkInvitationsUsed = async (batchId: string): Promise<boolean> => {
  try {
    const batchDocRef = doc(firestore, 'batches', batchId);
    const invitationsRef = collection(batchDocRef, 'invitations');
    
    const queryRef = query(invitationsRef, where('used', '==', true), where('usedBy', '!=', null));
    const snapshot = await getDocs(queryRef);
    
    return !snapshot.empty;  // Returns true if there's at least one matching document
  } catch (error) {
    console.error("Error checking invitations:", error);
    return false;
  }
};

export { };

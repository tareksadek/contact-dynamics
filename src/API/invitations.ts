import { Timestamp } from '@firebase/firestore-types';
import { firestore } from './firebaseConfig';
import { getDoc, getDocs, collection, doc, updateDoc, query, addDoc, orderBy } from '@firebase/firestore';
import { InvitationData } from '../types/userInvitation';
import { getBatchById } from './batch';
import { BatchData } from '../types/userInvitation'; 

export const getInvitationFromBatchById = async (batchId: string, invitationId: string) => {
	try {
		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);
		const invitationDoc = await getDoc(invitationRef);

		if (invitationDoc.exists()) {
			const data = invitationDoc.data();
			return {
				id: invitationDoc.id,
				...data
			};
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error fetching invitation from batch by ID:", error);
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

export const getAllInvitationsByBatchId = async (batchId: string): Promise<InvitationData[] | null> => {
	try {
		const invitationsQuery = query(
			collection(firestore, 'batches', batchId, 'invitations'),
			orderBy('used', 'desc')
		);
		const invitationSnapshot = await getDocs(invitationsQuery);

		const invitations: InvitationData[] = [];
		invitationSnapshot.forEach(doc => {
				const invitation = doc.data() as InvitationData;

				if (invitation.expirationDate && typeof invitation.expirationDate !== 'string') {
					const timestamp = invitation.expirationDate as unknown as Timestamp;
					invitation.expirationDate = new Date(timestamp.seconds * 1000);
				}

				if (invitation.usedOn && typeof invitation.usedOn !== 'string') {
					const timestamp = invitation.usedOn as unknown as Timestamp;
					invitation.usedOn = new Date(timestamp.seconds * 1000);
				}

		    invitations.push({
		        ...invitation,
						id: doc.id,
		    });
		});

		invitations.sort((a, b) => {
			if (a.used && !b.used) return -1;
			if (!a.used && b.used) return 1;
			return 0;
		});
		return invitations;
	} catch (error) {
		console.error("Error fetching invitations by batch ID:", error);
		return null;
	}
};

export const resetInvitationData = async (
	batchId: string,
	invitationId: string
): Promise<{ success: boolean; error?: string }> => {
	try {
		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);

		await updateDoc(invitationRef, {
			used: false,
			usedOn: null,
			usedBy: null,
			connected: false
		});

		return { success: true };
	} catch (error) {
		console.error("Error resetting the invitation:", error);
		return { success: false, error: (error as Error).message };
	}
};

export const createInvitations = async (
  batch: BatchData | null,
  numberOfInvitations: number,
  shouldCreateMaster: boolean
): Promise<InvitationData[]> => {
  const createdInvitations: InvitationData[] = [];

	if (!batch || !batch.id) {
		throw new Error('Batch not found');
	}

  try {
    const invitationsCollection = collection(firestore, 'batches', batch.id, 'invitations');
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Set to one year from now

    // Determine if we've already created a master invitation
    let masterCreated = false;

    for (let i = 0; i < numberOfInvitations; i++) {
      const newInvitation: InvitationData = {
        used: false,
        usedOn: null,
        usedBy: null,
        connected: false,
        type: batch.isTeams ? 'teams' : 'default',
        isMaster: false,
        expirationDate: expirationDate // Store as ISO string for consistent format
      };

      // If a master invitation is requested and we haven't created one yet
      if (shouldCreateMaster && !masterCreated) {
        newInvitation.isMaster = true;
        masterCreated = true;
      }

			console.log(newInvitation);
			

      const docRef = await addDoc(invitationsCollection, newInvitation);
      
      const createdInvitation = {
        ...newInvitation,
        id: docRef.id
      };

      // Transform the date as required
      if (createdInvitation.expirationDate && typeof createdInvitation.expirationDate !== 'string') {
        const timestamp = createdInvitation.expirationDate as unknown as Timestamp;
        createdInvitation.expirationDate = new Date(timestamp.seconds * 1000);
      }

      createdInvitations.push(createdInvitation);
    }

    return createdInvitations;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to be caught in the calling function.
  }
};

export { };

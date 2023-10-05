import { Timestamp } from '@firebase/firestore-types';
import { firestore } from './firebaseConfig';
import { ContactType, CreateContactResponse } from '../types/contact'
import { doc, addDoc, collection, getDocs, updateDoc, deleteDoc, query, orderBy } from "@firebase/firestore";

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createContact = async (userId: string, profileId: string, contactData: ContactType): Promise<CreateContactResponse> => {
  try {
    const contactsCollectionRef = collection(firestore, `users/${userId}/profiles/${profileId}/contacts`);
    const contactDocRef = await addDoc(contactsCollectionRef, contactData);
    // Add the document ID to the contactData
    const contactWithId: ContactType = {
      ...contactData,
      id: contactDocRef.id
    };
    return { success: true, data: contactWithId };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: (error as Error).message };
  }
};

export const getAllProfileContacts = async (userId: string, profileId: string): Promise<APIResponse<ContactType[]>> => {
  try {
    const contactsCollectionRef = collection(firestore, `users/${userId}/profiles/${profileId}/contacts`);
    const contactsQuery = query(contactsCollectionRef, orderBy('firstName', 'asc'));
    const contactsSnapshot = await getDocs(contactsQuery);

    const contacts: ContactType[] = [];

    if (contactsSnapshot.empty) {
			return { success: true, data: [] };
		} else {
      contactsSnapshot.forEach(doc => {
				const contact = doc.data() as ContactType;
				// Convert Firestore Timestamp to JS Date
				if (contact.createdOn && typeof contact.createdOn !== 'string') {
					const createdOnTimestamp = contact.createdOn as unknown as Timestamp;
					contact.createdOn = new Date(createdOnTimestamp.seconds * 1000);
				}
				
        contacts.push({ ...contact, id: doc.id });
			});
    }

    return { success: true, data: contacts };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
};

export const editContactById = async (userId: string, profileId: string, contactId: string, updatedData: Partial<ContactType>): Promise<APIResponse<void>> => {
  try {
    const contactDocRef = doc(firestore, `users/${userId}/profiles/${profileId}/contacts/${contactId}`);
    await updateDoc(contactDocRef, updatedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const deleteContactById = async (userId: string, profileId: string, contactId: string): Promise<APIResponse<void>> => {
  try {
    const contactDocRef = doc(firestore, `users/${userId}/profiles/${profileId}/contacts/${contactId}`);
    await deleteDoc(contactDocRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
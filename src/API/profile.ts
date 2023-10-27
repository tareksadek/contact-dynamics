import { firestore, storage } from './firebaseConfig';
import { doc, setDoc, updateDoc, getDoc, collection, where, getDocs, query, addDoc, arrayUnion, deleteDoc, increment, onSnapshot } from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import isEqual from 'lodash/isEqual';
import { ProfileDataType, BasicInfoFormDataTypes, AboutFormDataTypes, ThemeSettingsType, ColorType, CreateProfileResponseType, ContactFormType } from '../types/profile';

export const uploadImageToStorage = async (userId: string, folderName: string, imageName: string, blobData: Blob) => {
  try {
    const imageRef = ref(storage, `users/${userId}/${folderName}/${imageName}`);
    await uploadBytes(imageRef, blobData); // using uploadBytes instead of uploadString
    const downloadURL = await getDownloadURL(imageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: (error as Error).message };
  }
};

// export const createProfile = async (userId: string, profileData: ProfileDataType): Promise<CreateProfileResponseType> => {
//   const userRef = doc(firestore, 'users', userId);
//   let coverImageResponse: { success: boolean, url?: string | null } = { success: false };
//   let profileImageResponse: { success: boolean, url?: string | null } = { success: false };

//   if (profileData.coverImageData.blob) {
//     // Upload cover image to storage
//     coverImageResponse = await uploadImageToStorage(userId, 'cover', 'coverImage.jpg', profileData.coverImageData.blob);
//     if (!coverImageResponse.success) return coverImageResponse;
//   }

//   if (profileData.profileImageData.blob) {
//     // Upload profile image to storage
//     profileImageResponse = await uploadImageToStorage(userId, 'profile', 'profileImage.jpg', profileData.profileImageData.blob);
//     if (!profileImageResponse.success) return profileImageResponse;
//   }

//   const combinedData = {
//     basicInfoData: profileData.basicInfoData || null,
//     aboutData: profileData.aboutData || null,
//     coverImageData: {
//       url: coverImageResponse.url || null,
//     } || null,
//     profileImageData: {
//       url: profileImageResponse.url || null,
//     },
//     themeSettings: profileData.themeSettings,
//     favoriteColors: profileData.favoriteColors.length > 0 ? profileData.favoriteColors : null,
//     createdOn: profileData.createdOn,
//   };

//   // Create the main profile document
//   const profilesCollectionRef = collection(userRef, 'profiles');
//   console.log("About to add new profile to profiles collection");

//   const newProfileRef = await addDoc(profilesCollectionRef, combinedData);

//   // Save compressed profile image data to profileImage subcollection under profile
//   const compressedImageData = { base64: profileData.profileImageData.base64 };
//   const profileImageCollectionRef = collection(newProfileRef, 'profileImage');
//   await addDoc(profileImageCollectionRef, compressedImageData);

//   // Save links to links subcollection under profile
//   const linksCollectionRef = collection(newProfileRef, 'links');
//   for (const link of [...profileData.links.social, ...profileData.links.custom]) {
//     await addDoc(linksCollectionRef, link);
//   }

//   // Calculate profileTitle
//   const userSnapshot = await getDoc(userRef);
//   const userData = userSnapshot.data();
//   const profilesCount = (userData?.profileList?.length || 0) + 1;
//   const profileTitle = (profilesCount === 1 && profileData.basicInfoData && !profileData.basicInfoData.title) 
//   ? 'default' 
//   : (profileData.basicInfoData?.title || `profile${profilesCount}`);

//   // Update the user document with activeProfileId and add the new profile to profiles array
//   try {
//     await updateDoc(userRef, {
//       activeProfileId: newProfileRef.id,
//       profileList: arrayUnion({
//         profileTitle: profileTitle,
//         profileId: newProfileRef.id
//       })
//     });
//     return { success: true, profile: { id: newProfileRef.id, title: profileTitle }};
//   } catch (error) {
//     console.error("Error saving profile:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

export const createProfile = async (userId: string, profileData: ProfileDataType): Promise<CreateProfileResponseType> => {
  const userRef = doc(firestore, 'users', userId);

  // 1. Create the main profile document first
  const profilesCollectionRef = collection(userRef, 'profiles');
  const newProfileRef = await addDoc(profilesCollectionRef, {}); // Create an empty document to get the ID
  const newProfileId = newProfileRef.id;

  let coverImageResponse: { success: boolean, url?: string | null } = { success: false };
  let profileImageResponse: { success: boolean, url?: string | null } = { success: false };

  if (profileData.coverImageData.blob) {
    coverImageResponse = await uploadImageToStorage(userId, 'cover', `${newProfileId}.jpg`, profileData.coverImageData.blob);
    if (!coverImageResponse.success) return coverImageResponse;
  }

  if (profileData.profileImageData.blob) {
    profileImageResponse = await uploadImageToStorage(userId, 'profile', `${newProfileId}.jpg`, profileData.profileImageData.blob);
    if (!profileImageResponse.success) return profileImageResponse;
  }

  const combinedData = {
    basicInfoData: profileData.basicInfoData || null,
    aboutData: profileData.aboutData || null,
    coverImageData: {
      url: coverImageResponse.url || null,
    },
    profileImageData: {
      url: profileImageResponse.url || null,
    },
    themeSettings: profileData.themeSettings,
    favoriteColors: profileData.favoriteColors.length > 0 ? profileData.favoriteColors : null,
    createdOn: profileData.createdOn,
  };

  // 3. Update the profile document with the image URLs and other data
  await setDoc(newProfileRef, combinedData, { merge: true });

  // Save compressed profile image data to profileImage subcollection under profile
  const compressedImageData = { base64: profileData.profileImageData.base64 };
  const profileImageCollectionRef = collection(newProfileRef, 'profileImage');
  await addDoc(profileImageCollectionRef, compressedImageData);

  // Save links to links subcollection under profile
  const linksCollectionRef = collection(newProfileRef, 'links');
  for (const link of [...profileData.links.social, ...profileData.links.custom]) {
    await addDoc(linksCollectionRef, link);
  }

  // Calculate profileTitle
  const userSnapshot = await getDoc(userRef);
  const userData = userSnapshot.data();
  const profilesCount = (userData?.profileList?.length || 0) + 1;
  const profileTitle = (profilesCount === 1 && profileData.basicInfoData && !profileData.basicInfoData.title)
    ? 'default'
    : (profileData.title || `profile${profilesCount}`);

  // Update the user document with activeProfileId and add the new profile to profiles array
  try {
    await updateDoc(userRef, {
      activeProfileId: newProfileRef.id,
      profileList: arrayUnion({
        profileTitle: profileTitle,
        profileId: newProfileRef.id
      })
    });
    return { success: true, profile: { id: newProfileRef.id, title: profileTitle } };
  } catch (error) {
    console.error("Error saving profile:", error);
    return { success: false, error: (error as Error).message };
  }
};

// export const fetchProfileById = async (userId: string, profileId: string) => {
//   try {
//     // Get reference to the profile in the subcollection
//     const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);
//     const profileSnapshot = await getDoc(profileRef);

//     if (!profileSnapshot.exists()) {
//       return { success: false, error: 'Profile not found.' };
//     }

//     let profileData: any = profileSnapshot.data();

//     // 1. Fetch the links subcollection and reconstruct it
//     const linksCollectionRef = collection(profileRef, 'links');
//     const linksSnapshot = await getDocs(linksCollectionRef);
//     let socialLinks: any[] = [];
//     let customLinks: any[] = [];

//     linksSnapshot.docs.forEach(doc => {
//       const linkData = doc.data();
//       linkData.id = doc.id;
//       if (linkData.isSocial) {
//         socialLinks.push(linkData);
//       } else if (linkData.isCustom) {
//         customLinks.push(linkData);
//       }
//     });

//     // Sort the socialLinks and customLinks arrays based on the position attribute
//     socialLinks = socialLinks.sort((a, b) => a.position - b.position);
//     customLinks = customLinks.sort((a, b) => a.position - b.position);

//     profileData.links = { social: socialLinks, custom: customLinks };

//     // 2. Fetch the profileImage subcollection and merge with profileImageData
//     const profileImageCollectionRef = collection(profileRef, 'profileImage');
//     const profileImageSnapshot = await getDocs(profileImageCollectionRef);

//     // Assuming there's only one doc under profileImage subcollection
//     if (!profileImageSnapshot.empty) {
//       const profileImageData = profileImageSnapshot.docs[0].data();
//       if (profileImageData.base64) {
//         profileData.profileImageData.base64 = profileImageData.base64;
//       }
//     }

//     return { success: true, data: profileData };
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

// export const updateProfileBasicInfo = async (userId: string, profileId: string, basicInfoData: BasicInfoFormDataTypes) => {
//   try {
//     const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);
//     await updateDoc(profileRef, { basicInfoData });
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating basic info:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

export const fetchProfileById = (userId: string, profileId: string) => {
  return new Promise<{ success: boolean, data?: any, error?: string }>((mainResolve, mainReject) => {
    const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

    const unsubscribeProfile = onSnapshot(profileRef, profileSnapshot => {
      if (profileSnapshot.exists()) {
        let profileData: any = profileSnapshot.data();

        // Handle links subcollection
        const linksCollectionRef = collection(profileRef, 'links');

        const unsubscribeLinks = onSnapshot(linksCollectionRef, linksSnapshot => {
          let socialLinks: any[] = [];
          let customLinks: any[] = [];

          linksSnapshot.docs.forEach(doc => {
            const linkData = doc.data();
            linkData.id = doc.id;
            if (linkData.isSocial) {
              socialLinks.push(linkData);
            } else if (linkData.isCustom) {
              customLinks.push(linkData);
            }
          });

          // Sort the links
          socialLinks.sort((a, b) => a.position - b.position);
          customLinks.sort((a, b) => a.position - b.position);
          profileData.links = { social: socialLinks, custom: customLinks };

          // Handle profileImage subcollection
          const profileImageCollectionRef = collection(profileRef, 'profileImage');

          const unsubscribeProfileImage = onSnapshot(profileImageCollectionRef, profileImageSnapshot => {
            if (!profileImageSnapshot.empty) {
              const profileImageData = profileImageSnapshot.docs[0].data();
              if (profileImageData.base64) {
                profileData.profileImageData.base64 = profileImageData.base64;
              }
            }

            mainResolve({ success: true, data: profileData });
            console.log(profileData);
            
            // Cleanup listeners
            unsubscribeProfileImage();
          }, error => {
            console.error("Error fetching profile image:", error);
            mainReject({ success: false, error: error.message });
          });

        }, error => {
          console.error("Error fetching links:", error);
          mainReject({ success: false, error: error.message });
        });

      } else {
        mainReject({ success: false, error: 'Profile not found.' });
      }

      // Cleanup the main profile listener.
      unsubscribeProfile();

    }, error => {
      console.error("Error fetching profile:", error);
      mainReject({ success: false, error: error.message });
    });
  });
};

export const updateProfileBasicInfo = (userId: string, profileId: string, basicInfoData: BasicInfoFormDataTypes) => {
  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
      const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

      const unsubscribe = onSnapshot(profileRef, (doc) => {
          if (doc.metadata.hasPendingWrites) {
              console.log("Data is being written...");
          }

          if (doc.metadata.fromCache) {
              console.log("Data came from cache.");
              unsubscribe(); 
              resolve({ success: true });
          } else {
              console.log("Data came from the server.");
          }

          if (!doc.metadata.hasPendingWrites && !doc.metadata.fromCache) {
              // Assuming that once data is not from cache and has no pending writes,
              // it's successfully updated on the server.
              unsubscribe(); // Important: Stop listening to changes.
              resolve({ success: true });
          }
      }, (error) => {
          // This is called if there's an error with the snapshot listener
          console.error("Snapshot error:", error);
          unsubscribe();
          reject({ success: false, error: error.message });
      });

      // Attempt to update the document
      updateDoc(profileRef, { basicInfoData }).catch(error => {
          console.error("Error updating basic info:", error);
          unsubscribe();  // Important: Stop listening to changes if there's an error.
          reject({ success: false, error: error.message });
      });
  });
};

// export const updateContactForm = async (userId: string, profileId: string, contactFormData: ContactFormType) => {
//   try {
//     const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);
//     await updateDoc(profileRef, { contactFormData });
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating contact form:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

// export const updateAboutInfo = async (userId: string, profileId: string, aboutData: AboutFormDataTypes) => {
//   try {
//     console.log('a');
    
//     const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);
//     console.log('b');
    
//     await updateDoc(profileRef, { aboutData });
//     console.log('c');
    
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating about info:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

// export const updateAboutInfo = (userId: string, profileId: string, aboutData: AboutFormDataTypes) => {
//   return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
//       const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

//       const unsubscribe = onSnapshot(profileRef, (doc) => {
//           if (doc.metadata.hasPendingWrites) {
//               console.log("Data is being written...");
//           }

//           if (doc.metadata.fromCache) {
//               console.log("Data came from cache.");
//               unsubscribe(); // Stop listening to changes.
//               resolve({ success: true });
//           } else {
//               console.log("Data came from the server.");
//           }

//           if (!doc.metadata.hasPendingWrites && !doc.metadata.fromCache) {
//               // Assuming that once data is not from cache and has no pending writes,
//               // it's successfully updated on the server.
//               unsubscribe(); // Important: Stop listening to changes.
//               resolve({ success: true });
//           }
//       }, (error) => {
//           // This is called if there's an error with the snapshot listener
//           console.error("Snapshot error:", error);
//           unsubscribe();
//           reject({ success: false, error: error.message });
//       });
//       console.log('bbbbbb');
      
//       // Attempt to update the document
//       updateDoc(profileRef, { aboutData }).catch(error => {
//           console.error("Error updating about info:", error);
//           unsubscribe();  // Important: Stop listening to changes if there's an error.
//           reject({ success: false, error: error.message });
//       });
//       console.log('zzzzzzzzzzzz');
      
//   });
// };

export const updateContactForm = async (userId: string, profileId: string, contactFormData: ContactFormType) => {
  const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

  // Start the write operation
  updateDoc(profileRef, { contactFormData }).catch(error => {
    console.error("Error updating contact form:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const unsubscribe = onSnapshot(profileRef, (doc) => {
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

export const updateAboutInfo = async (userId: string, profileId: string, aboutData: AboutFormDataTypes) => {
  const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

  // Start the write operation
  updateDoc(profileRef, { aboutData }).catch(error => {
      console.error("Error updating about info:", error);
      // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
      const unsubscribe = onSnapshot(profileRef, (doc) => {
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

// export const updateThemeSettings = async (userId: string, profileId: string, themeSettings: ThemeSettingsType, favoriteColors: ColorType[]) => {
//   try {
//     const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);
//     await updateDoc(
//       profileRef,
//       {
//         themeSettings,
//         favoriteColors
//       }
//     );
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating theme settings:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

export const updateThemeSettings = async (
  userId: string, 
  profileId: string, 
  themeSettings: ThemeSettingsType, 
  favoriteColors: ColorType[]
) => {
  const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

  // Start the write operation
  updateDoc(profileRef, { themeSettings, favoriteColors }).catch(error => {
    console.error("Error updating theme settings:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const unsubscribe = onSnapshot(profileRef, (doc) => {
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


export const updateCoverImage = async (
  userId: string,
  profileId: string,
  newCoverImageData: { url: string, blob: Blob, base64: string }
) => {
  try {
    const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

    let coverImageResponse: { success: boolean, url?: string | null } = { success: false };

    // Upload new cover image to storage
    if (newCoverImageData.blob) {
      coverImageResponse = await uploadImageToStorage(userId, 'cover', `${profileId}.jpg`, newCoverImageData.blob);
      if (!coverImageResponse.success) return coverImageResponse;
    }

    // Update the URLs in the profile document
    await updateDoc(profileRef, {
      coverImageData: {
        url: coverImageResponse.url || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating cover image:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateProfileImage = async (
  userId: string,
  profileId: string,
  newProfileImageData: { url: string, blob: Blob, base64: string },
) => {
  try {
    const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

    let profileImageResponse: { success: boolean, url?: string | null } = { success: false };

    // Upload new profile image to storage
    if (newProfileImageData.blob) {
      profileImageResponse = await uploadImageToStorage(userId, 'profile', `${profileId}.jpg`, newProfileImageData.blob);
      if (!profileImageResponse.success) return profileImageResponse;
    }

    // Update the URLs in the profile document
    await updateDoc(profileRef, {
      profileImageData: {
        url: profileImageResponse.url || null,
      }
    });

    // Update base64 data in profileImage subcollection under profile
    const profileImageCollectionRef = collection(profileRef, 'profileImage');
    const profileImageSnapshot = await getDocs(profileImageCollectionRef);

    if (!profileImageSnapshot.empty) {
      const profileImageDocRef = doc(profileImageCollectionRef, profileImageSnapshot.docs[0].id);
      await updateDoc(profileImageDocRef, { base64: newProfileImageData.base64 });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: (error as Error).message };
  }
};

// export const updateLinks = async (userId: string, profileId: string, newLinks: any) => {
//   const linksCollectionRef = collection(doc(firestore, 'users', userId, 'profiles', profileId), 'links');

//   // Fetch current links from Firestore
//   const currentLinksSnapshot = await getDocs(linksCollectionRef);
//   const currentLinks: any[] = [];
//   currentLinksSnapshot.forEach(doc => {
//     currentLinks.push({
//       id: doc.id,
//       ...doc.data()
//     });
//   });

//   // Determine links to be added, updated, or deleted
//   const newLinksFlat = [...newLinks.social, ...newLinks.custom];

//   for (const link of newLinksFlat) {
//     // If no id, it's a new link
//     if (!link.id) {
//       await addDoc(linksCollectionRef, link);
//     } else {
//       const currentLinkData = currentLinks.find(l => l.id === link.id);
//       if (currentLinkData) {
//         // Compare data and update if necessary
//         if (!isEqual(currentLinkData, link)) {
//           const linkRef = doc(linksCollectionRef, link.id);
//           await updateDoc(linkRef, link);
//         }
//       }
//     }
//   }

//   // Check for links to delete
//   for (const currentLink of currentLinks) {
//     if (!newLinksFlat.some(link => link.id === currentLink.id)) {
//       await deleteDoc(doc(linksCollectionRef, currentLink.id));
//     }
//   }

//   return { success: true };
// };

export const updateLinks = async (userId: string, profileId: string, newLinks: any) => {
  const linksCollectionRef = collection(doc(firestore, 'users', userId, 'profiles', profileId), 'links');

  // Fetch current links from Firestore
  const currentLinksSnapshot = await getDocs(linksCollectionRef);
  const currentLinks: any[] = [];
  currentLinksSnapshot.forEach(doc => {
    currentLinks.push({
      id: doc.id,
      ...doc.data()
    });
  });

  const tasks: Promise<any>[] = [];

  // Determine links to be added, updated, or deleted
  const newLinksFlat = [...newLinks.social, ...newLinks.custom];

  for (const link of newLinksFlat) {
    // If no id, it's a new link
    if (!link.id) {
      tasks.push(addDoc(linksCollectionRef, link));
    } else {
      const currentLinkData = currentLinks.find(l => l.id === link.id);
      if (currentLinkData) {
        // Compare data and update if necessary
        if (!isEqual(currentLinkData, link)) {
          const linkRef = doc(linksCollectionRef, link.id);
          tasks.push(updateDoc(linkRef, link));
        }
      }
    }
  }

  // Check for links to delete
  for (const currentLink of currentLinks) {
    if (!newLinksFlat.some(link => link.id === currentLink.id)) {
      tasks.push(deleteDoc(doc(linksCollectionRef, currentLink.id)));
    }
  }

  // Wait for all tasks to complete
  await Promise.all(tasks).catch(error => {
    console.error("Error updating links:", error);
    return { success: false, error: error.message };
  });

  return { success: true };
};


export const logProfileVisit = async (userId: string, profileId: string) => {
  try {
    const visitDetails = {
      visitedOn: new Date(),
      userId: userId, 
      profileId: profileId,
    };

    // Add the visit to the 'visits' collection. This will trigger the Cloud Function incrementVisitCounts.
    const visitsRef = collection(firestore, 'users', userId, 'profiles', profileId, 'visits');
    await addDoc(visitsRef, visitDetails);

    return { success: true };
  } catch (error) {
    console.error("Error logging visit:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const incrementLinkClickCount = async (userId: string, profileId: string, linkId: string) => {  
  try {
    const linkRef = doc(firestore, 'users', userId, 'profiles', profileId, 'links', linkId);
    
    await setDoc(linkRef, {
      clicked: increment(1)
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error incrementing link click count:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const incrementAddedToContacts = async (userId: string, profileId: string) => {
  try {
    const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

    await setDoc(profileRef, {
      addedToContacts: increment(1)
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error incrementing addedToContacts count:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const getVisitsForLast30Days = async (userId: string, profileId: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const visitsRef = collection(firestore, `users/${userId}/profiles/${profileId}/visits`);

  const q = query(visitsRef, 
    where('visitedOn', '>=', startDate),
    where('visitedOn', '<=', endDate)
  );

  const querySnapshot = await getDocs(q);
  
  const visitsData = querySnapshot.docs.map(doc => doc.data());
  
  return visitsData;
};

export { };

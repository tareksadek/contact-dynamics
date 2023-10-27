import { formatISO } from 'date-fns';
import * as actionTypes from './actionTypes';
import { setNotification } from './notificationCenter';
import {
  createProfile,
  fetchProfileById,
  updateProfileBasicInfo,
  updateAboutInfo,
  updateCoverImage,
  updateProfileImage,
  updateLinks,
  updateThemeSettings,
  updateContactForm,
} from '../../API/profile';
import { updateActiveProfileId } from '../../API/user';
import { ProfileDataType, BasicInfoFormDataTypes, AboutFormDataTypes, LinkType, ThemeSettingsType, ColorType, ContactFormType } from '../../types/profile';
import { deepMerge } from '../../utilities/utils';
import { startLoading, stopLoading } from './loadingCenter';
import { addProfileToUser, setActiveProfile } from './user';

interface SaveProfileRequestAction {
  type: typeof actionTypes.SAVE_PROFILE_REQUEST;
}

interface SaveProfileSuccessAction {
  type: typeof actionTypes.SAVE_PROFILE_SUCCESS;
  payload: ProfileDataType;
}

interface SaveProfileFailureAction {
  type: typeof actionTypes.SAVE_PROFILE_FAILURE;
  error: string;
}

interface FetchProfileRequestAction {
  type: typeof actionTypes.FETCH_PROFILE_REQUEST;
}

interface FetchProfileSuccessAction {
  type: typeof actionTypes.FETCH_PROFILE_SUCCESS;
  payload: ProfileDataType;
}

interface FetchProfileFailureAction {
  type: typeof actionTypes.FETCH_PROFILE_FAILURE;
  error: string;
}

interface UpdateBasicInfoRequestAction {
  type: typeof actionTypes.UPDATE_BASIC_INFO_REQUEST;
}

interface UpdateBasicInfoSuccessAction {
  type: typeof actionTypes.UPDATE_BASIC_INFO_SUCCESS;
  payload: BasicInfoFormDataTypes;
}

interface UpdateBasicInfoFailureAction {
  type: typeof actionTypes.UPDATE_BASIC_INFO_FAILURE;
  error: string;
}

interface UpdateAboutRequestAction {
  type: typeof actionTypes.UPDATE_ABOUT_REQUEST;
}

interface UpdateAboutSuccessAction {
  type: typeof actionTypes.UPDATE_ABOUT_SUCCESS;
  payload: AboutFormDataTypes;
}

interface UpdateAboutFailureAction {
  type: typeof actionTypes.UPDATE_ABOUT_FAILURE;
  error: string;
}

interface UpdateContactFormRequestAction {
  type: typeof actionTypes.UPDATE_CONTACT_FORM_REQUEST;
}

interface UpdateContactFormSuccessAction {
  type: typeof actionTypes.UPDATE_CONTACT_FORM_SUCCESS;
  payload: ContactFormType;
}

interface UpdateContactFormFailureAction {
  type: typeof actionTypes.UPDATE_CONTACT_FORM_FAILURE;
  error: string;
}

interface UpdateThemeRequestAction {
  type: typeof actionTypes.UPDATE_THEME_REQUEST;
}

interface UpdateThemeSuccessAction {
  type: typeof actionTypes.UPDATE_THEME_SUCCESS;
  payload: {
    themeSettings: ThemeSettingsType,
    favoriteColors: ColorType[]
  };
}

interface UpdateThemeFailureAction {
  type: typeof actionTypes.UPDATE_THEME_FAILURE;
  error: string;
}

interface UpdateCoverImageRequestAction {
  type: typeof actionTypes.UPDATE_COVER_IMAGE_REQUEST;
}

interface UpdateCoverImageSuccessAction {
  type: typeof actionTypes.UPDATE_COVER_IMAGE_SUCCESS;
  payload: { coverImageData: any; };
}

interface UpdateCoverImageFailureAction {
  type: typeof actionTypes.UPDATE_COVER_IMAGE_FAILURE;
  error: string;
}

interface UpdateProfileImageRequestAction {
  type: typeof actionTypes.UPDATE_PROFILE_IMAGE_REQUEST;
}

interface UpdateProfileImageSuccessAction {
  type: typeof actionTypes.UPDATE_PROFILE_IMAGE_SUCCESS;
  payload: { profileImageData: any };
}

interface UpdateProfileImageFailureAction {
  type: typeof actionTypes.UPDATE_PROFILE_IMAGE_FAILURE;
  error: string;
}

interface UpdateLinksRequestAction {
  type: typeof actionTypes.UPDATE_LINKS_REQUEST;
}

interface UpdateLinksSuccessAction {
  type: typeof actionTypes.UPDATE_LINKS_SUCCESS;
  payload: {
    social: LinkType[];
    custom: LinkType[];
  };
}

interface UpdateLinksFailureAction {
  type: typeof actionTypes.UPDATE_LINKS_FAILURE;
  error: string;
}


export type ProfileActionTypes = 
  | FetchProfileRequestAction
  | FetchProfileSuccessAction
  | FetchProfileFailureAction
  | SaveProfileRequestAction
  | SaveProfileSuccessAction
  | SaveProfileFailureAction
  | UpdateBasicInfoSuccessAction
  | UpdateAboutSuccessAction
  | UpdateContactFormSuccessAction
  | UpdateThemeSuccessAction
  | UpdateCoverImageSuccessAction
  | UpdateProfileImageSuccessAction
  | UpdateLinksRequestAction
  | UpdateLinksSuccessAction
  | UpdateLinksFailureAction;

export const saveProfileRequest = (): SaveProfileRequestAction => ({
  type: actionTypes.SAVE_PROFILE_REQUEST
});

export const saveProfileSuccess = (profileData: ProfileDataType): SaveProfileSuccessAction => ({
  type: actionTypes.SAVE_PROFILE_SUCCESS,
  payload: profileData
});

export const saveProfileFailure = (error: string): SaveProfileFailureAction => ({
  type: actionTypes.SAVE_PROFILE_FAILURE,
  error
});

export const fetchProfileRequest = (): FetchProfileRequestAction => ({
  type: actionTypes.FETCH_PROFILE_REQUEST
});

export const fetchProfileSuccess = (profileData: ProfileDataType): FetchProfileSuccessAction => ({
  type: actionTypes.FETCH_PROFILE_SUCCESS,
  payload: profileData
});

export const fetchProfileFailure = (error: string): FetchProfileFailureAction => ({
  type: actionTypes.FETCH_PROFILE_FAILURE,
  error
});

export const updateBasicInfoRequest = (): UpdateBasicInfoRequestAction => ({
  type: actionTypes.UPDATE_BASIC_INFO_REQUEST
});

export const updateBasicInfoSuccess = (basicInfoData: BasicInfoFormDataTypes): UpdateBasicInfoSuccessAction => ({
  type: actionTypes.UPDATE_BASIC_INFO_SUCCESS,
  payload: basicInfoData
});

export const updateBasicInfoFailure = (error: string): UpdateBasicInfoFailureAction => ({
  type: actionTypes.UPDATE_BASIC_INFO_FAILURE,
  error
});

export const updateAboutRequest = (): UpdateAboutRequestAction => ({
  type: actionTypes.UPDATE_ABOUT_REQUEST
});

export const updateAboutSuccess = (aboutData: AboutFormDataTypes): UpdateAboutSuccessAction => ({
  type: actionTypes.UPDATE_ABOUT_SUCCESS,
  payload: aboutData
});

export const updateAboutFailure = (error: string): UpdateAboutFailureAction => ({
  type: actionTypes.UPDATE_ABOUT_FAILURE,
  error
});

export const updateContactFormRequest = (): UpdateContactFormRequestAction => ({
  type: actionTypes.UPDATE_CONTACT_FORM_REQUEST
});

export const updateContactFormSuccess = (contactFormData: ContactFormType): UpdateContactFormSuccessAction => ({
  type: actionTypes.UPDATE_CONTACT_FORM_SUCCESS,
  payload: contactFormData
});

export const updateContactFormFailure = (error: string): UpdateContactFormFailureAction => ({
  type: actionTypes.UPDATE_CONTACT_FORM_FAILURE,
  error
});

export const updateThemeRequest = (): UpdateThemeRequestAction => ({
  type: actionTypes.UPDATE_THEME_REQUEST
});

export const updateThemeSuccess = (themeSettings: ThemeSettingsType, favoriteColors: ColorType[]): UpdateThemeSuccessAction => ({
  type: actionTypes.UPDATE_THEME_SUCCESS,
  payload: {
    themeSettings,
    favoriteColors
  }
});

export const updateThemeFailure = (error: string): UpdateThemeFailureAction => ({
  type: actionTypes.UPDATE_THEME_FAILURE,
  error
});

export const updateCoverImageRequest = (): UpdateCoverImageRequestAction => ({
  type: actionTypes.UPDATE_COVER_IMAGE_REQUEST
});

export const updateCoverImageSuccess = (imageData: { coverImageData: any; }): UpdateCoverImageSuccessAction => ({
  type: actionTypes.UPDATE_COVER_IMAGE_SUCCESS,
  payload: imageData
});

export const updateCoverImageFailure = (error: string): UpdateCoverImageFailureAction => ({
  type: actionTypes.UPDATE_COVER_IMAGE_FAILURE,
  error
});

export const updateProfileImageRequest = (): UpdateProfileImageRequestAction => ({
  type: actionTypes.UPDATE_PROFILE_IMAGE_REQUEST
});

export const updateProfileImageSuccess = (imageData: { profileImageData: any }): UpdateProfileImageSuccessAction => ({
  type: actionTypes.UPDATE_PROFILE_IMAGE_SUCCESS,
  payload: imageData
});

export const updateProfileImageFailure = (error: string): UpdateProfileImageFailureAction => ({
  type: actionTypes.UPDATE_PROFILE_IMAGE_FAILURE,
  error
});

export const updateLinksRequest = (): UpdateLinksRequestAction => ({
  type: actionTypes.UPDATE_LINKS_REQUEST
});

export const updateLinksSuccess = (socialLinks: LinkType[], customLinks: LinkType[]): UpdateLinksSuccessAction => ({
  type: actionTypes.UPDATE_LINKS_SUCCESS,
  payload: {
    social: socialLinks,
    custom: customLinks
  }
});

export const updateLinksFailure = (error: string): UpdateLinksFailureAction => ({
  type: actionTypes.UPDATE_LINKS_FAILURE,
  error
});

export const saveProfile = (userId: string, profileData: ProfileDataType) => async (dispatch: any, getState: any) => {
  dispatch(startLoading('Saving profile...'))
  dispatch(saveProfileRequest());
  
  try {
    // Directly passing userId and profileData to createProfile
    const response = await createProfile(userId, profileData); 
    const appSetup = getState().setup.setup;
      

    if ('profile' in response && response.success) {
      profileData.id = response.profile.id
      const mergedData = deepMerge({...profileData}, appSetup);
      console.log(mergedData);
      
      const sanitizedProfileData = {
        ...mergedData,
        coverImageData: { url: mergedData.coverImageData.url },
        profileImageData: { 
          url: mergedData.profileImageData.url, 
          base64: mergedData.profileImageData.base64
        },
        createdOn: formatISO(mergedData.createdOn),
      };
      
      dispatch(saveProfileSuccess(sanitizedProfileData));
      dispatch(addProfileToUser(response.profile.id, response.profile.title))
      dispatch(setActiveProfile(response.profile.id))
      dispatch(stopLoading())
      dispatch(setNotification({ message: 'Profile created successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
      // Note: If you want to include the new URLs or other data from the response in the store, 
      // you'd need to merge it with profileData before dispatching saveProfileSuccess.
    } else {
      dispatch(stopLoading())
      throw new Error('Failed to save profile');
    }
  } catch (err) {
    console.log(err);
    dispatch(stopLoading())
    dispatch(saveProfileFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to create profile', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const getProfileById = (userId: string, profileId: string) => async (dispatch: any, getState: any) => {
  dispatch(startLoading('loading profile data...'))
  dispatch(fetchProfileRequest());
  
  try {
    const response = await fetchProfileById(userId, profileId); 
    const appSetup = getState().setup.setup;
    console.log(response);
    
    if (response.success) {
      response.data.id = profileId
      if (response.data?.createdOn) {
        const jsDateCreatedOn = (response.data.createdOn as any).toDate();
        response.data.createdOn = formatISO(jsDateCreatedOn);
      }
      const profileData = response.data
      const mergedData = deepMerge({...profileData}, appSetup);
      dispatch(fetchProfileSuccess(mergedData));
      dispatch(setActiveProfile(mergedData.id))
      dispatch(stopLoading())
      dispatch(setNotification({ message: 'Profile fetched successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading())
      throw new Error('Failed to fetch profile');
    }
  } catch (err) {
    console.log(err);
    dispatch(stopLoading())
    dispatch(fetchProfileFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to fetch profile', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const switchProfile = (userId: string, profileId: string) => async (dispatch: any) => {
  dispatch(startLoading('Switching profile...'));

  try {
      const updateResponse = await updateActiveProfileId(userId, profileId);
      
      if (!updateResponse.success) {
        dispatch(stopLoading())
        throw new Error(updateResponse.error);
      }

      await dispatch(getProfileById(userId, profileId));
      dispatch(stopLoading())
  } catch (err) {
      console.log(err);
      dispatch(stopLoading());
      dispatch(setNotification({ 
          message: 'Failed to switch profile', 
          type: 'error', 
          horizontal: 'right', 
          vertical: 'top' 
      }));
  }
};

export const updateBasicInfo = (userId: string, profileId: string, formData: BasicInfoFormDataTypes) => async (dispatch: any) => {
  // dispatch(startLoading('Saving profile data...'))
  dispatch(updateBasicInfoRequest());
  
  try {
    const response = await updateProfileBasicInfo(userId, profileId, formData);
    if (response.success) {
      dispatch(updateBasicInfoSuccess(formData));
      // dispatch(stopLoading())
      dispatch(setNotification({ message: 'Basic Info updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading())
      throw new Error('Failed to update basic info');
    }
  } catch (err) {
    console.log(err);
    // dispatch(stopLoading())
    dispatch(updateBasicInfoFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update basic info', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateAboutInfoData = (userId: string, profileId: string, formData: AboutFormDataTypes) => async (dispatch: any) => {
  // dispatch(startLoading('Saving about data...'))
  dispatch(updateAboutRequest());
  
  try {
    const response = await updateAboutInfo(userId, profileId, formData);
    
    if (response.success) {
      dispatch(updateAboutSuccess(formData));
      // dispatch(stopLoading())
      dispatch(setNotification({ message: 'About Info updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading())
      throw new Error('Failed to update about info');
    }
  } catch (err) {
    console.log(err);
    // dispatch(stopLoading())
    dispatch(updateAboutFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update about info', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateContactFormData = (userId: string, profileId: string, formData: ContactFormType) => async (dispatch: any) => {
  // dispatch(startLoading('Saving form data...'))
  dispatch(updateAboutRequest());
  
  try {
    const response = await updateContactForm(userId, profileId, formData);
    if (response.success) {
      dispatch(updateContactFormSuccess(formData));
      dispatch(stopLoading())
      dispatch(setNotification({ message: 'Form updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      // dispatch(stopLoading())
      throw new Error('Failed to update form');
    }
  } catch (err) {
    console.log(err);
    // dispatch(stopLoading())
    dispatch(updateContactFormFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update form', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateThemeSettingsData = (userId: string, profileId: string, themeSettings: ThemeSettingsType, favoriteColors: ColorType[]) => async (dispatch: any) => {
  // dispatch(startLoading('Updating theme...'))
  dispatch(updateThemeRequest());
  
  try {
    const response = await updateThemeSettings(userId, profileId, themeSettings, favoriteColors);
    if (response.success) {
      dispatch(updateThemeSuccess(themeSettings, favoriteColors));
      // dispatch(stopLoading())
      dispatch(setNotification({ message: 'Theme updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading())
      throw new Error('Failed to update theme');
    }
  } catch (err) {
    console.log(err);
    // dispatch(stopLoading())
    dispatch(updateThemeFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update theme', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateCoverImageData = (
  userId: string, 
  profileId: string, 
  coverImageData: { url: string, base64: string, blob: Blob },
) => async (dispatch: any, getState: any) => {
  
  dispatch(startLoading('Updating cover image...'));
  dispatch(updateCoverImageRequest());

  try {
    const updatedImagesResponse = await updateCoverImage(userId, profileId, coverImageData);


    if (updatedImagesResponse.success) {
      const mergedData = {
        coverImageData: { url: coverImageData.url },
      };
      
      dispatch(updateCoverImageSuccess(mergedData));
      dispatch(stopLoading());
      dispatch(setNotification({ message: 'Cover image updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading());
      throw new Error('Failed to update cover image');
    }
  } catch (err) {
    console.log(err);
    dispatch(stopLoading());
    dispatch(updateCoverImageFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update cover image', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateProfileImageData = (
  userId: string, 
  profileId: string, 
  profileImageData: { url: string, base64: string, blob: Blob }
) => async (dispatch: any, getState: any) => {
  
  dispatch(startLoading('Updating profile image...'));
  dispatch(updateProfileImageRequest());

  try {
    const updatedImageResponse = await updateProfileImage(userId, profileId, profileImageData);

    if (updatedImageResponse.success) {
      const mergedData = {
        profileImageData: { 
          url: profileImageData.url,
          base64: profileImageData.base64
        }
      };
      
      dispatch(updateProfileImageSuccess(mergedData));
      dispatch(stopLoading());
      dispatch(setNotification({ message: 'Profile image updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading());
      throw new Error('Failed to update profile image');
    }
  } catch (err) {
    console.log(err);
    dispatch(stopLoading());
    dispatch(updateProfileImageFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update profile image', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateProfileLinks = (userId: string, profileId: string, links: { social: LinkType[], custom: LinkType[] }) => async (dispatch: any) => {
  // dispatch(startLoading('Updating links...'));
  dispatch(updateLinksRequest());

  try {
    const response = await updateLinks(userId, profileId, links);

    if (response.success) {
      dispatch(updateLinksSuccess(links.social, links.custom));
      // dispatch(stopLoading());
      dispatch(setNotification({ message: 'Links updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading());
      throw new Error('Failed to update links');
    }
  } catch (err) {
    console.log(err);
    // dispatch(stopLoading());
    dispatch(updateLinksFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to update links', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export type {
  SaveProfileRequestAction,
  SaveProfileSuccessAction,
  SaveProfileFailureAction,
  FetchProfileRequestAction,
  FetchProfileSuccessAction,
  FetchProfileFailureAction,
  UpdateBasicInfoSuccessAction,
  UpdateAboutSuccessAction,
  UpdateContactFormSuccessAction,
  UpdateThemeSuccessAction,
  UpdateCoverImageSuccessAction,
  UpdateProfileImageSuccessAction,
  UpdateLinksRequestAction,
  UpdateLinksSuccessAction,
  UpdateLinksFailureAction,
};

export {};

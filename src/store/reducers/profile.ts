import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  SAVE_PROFILE_REQUEST,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_FAILURE,
  UPDATE_BASIC_INFO_SUCCESS,
  UPDATE_ABOUT_SUCCESS,
  UPDATE_CONTACT_FORM_SUCCESS,
  UPDATE_THEME_SUCCESS,
  UPDATE_COVER_IMAGE_SUCCESS,
  UPDATE_PROFILE_IMAGE_SUCCESS,
  UPDATE_LINKS_REQUEST,
  UPDATE_LINKS_SUCCESS,
  UPDATE_LINKS_FAILURE,
} from '../actions/actionTypes';

import {
  ProfileActionTypes,
  SaveProfileSuccessAction,
  SaveProfileFailureAction,
  FetchProfileSuccessAction,
  FetchProfileFailureAction,
  UpdateBasicInfoSuccessAction,
  UpdateAboutSuccessAction,
  UpdateContactFormSuccessAction,
  UpdateThemeSuccessAction,
  UpdateCoverImageSuccessAction,
  UpdateProfileImageSuccessAction,
  UpdateLinksSuccessAction,
  UpdateLinksFailureAction,
} from '../actions/profile';

import { ProfileDataType } from '../../types/profile';

const initialState: {
  profile: ProfileDataType | null;
  loading: boolean;
  error: string | null;
} = {
  profile: null,
  loading: false,
  error: null,
};

const fetchProfileRequest = (state: typeof initialState) => {
  return {
    ...state,
    loading: true
  };
};

const fetchProfileSuccess = (state: typeof initialState, action: FetchProfileSuccessAction) => {
  return {
    ...state,
    profile: action.payload,
    loading: false,
    error: null
  };
};

const fetchProfileFailure = (state: typeof initialState, action: FetchProfileFailureAction) => {
  return {
    ...state,
    loading: false,
    error: action.error
  };
};

const saveProfileRequest = (state: typeof initialState) => {
  return {
    ...state,
    loading: true
  };
};

const saveProfileSuccess = (state: typeof initialState, action: SaveProfileSuccessAction) => {
  return {
    ...state,
    profile: action.payload,
    loading: false,
    error: null
  };
};

const saveProfileFailure = (state: typeof initialState, action: SaveProfileFailureAction) => {
  return {
    ...state,
    loading: false,
    error: action.error
  };
};

const updateBasicInfoSuccess = (state: typeof initialState, action: UpdateBasicInfoSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        basicInfoData: action.payload,
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateAboutSuccess = (state: typeof initialState, action: UpdateAboutSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        aboutData: action.payload,
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateContactFormSuccess = (state: typeof initialState, action: UpdateContactFormSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        contactFormData: action.payload,
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateThemeSuccess = (state: typeof initialState, action: UpdateThemeSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        themeSettings: action.payload.themeSettings,
        favoriteColors: action.payload.favoriteColors,
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateCoverImageSuccess = (state: typeof initialState, action: UpdateCoverImageSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        coverImageData: action.payload.coverImageData,
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateProfileImageSuccess = (state: typeof initialState, action: UpdateProfileImageSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        profileImageData: action.payload.profileImageData,
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateLinksRequest = (state: typeof initialState) => {
  return {
    ...state,
    loading: true
  };
};

const updateLinksSuccess = (state: typeof initialState, action: UpdateLinksSuccessAction) => {
  if (state.profile) {
    return {
      ...state,
      profile: {
        ...state.profile,
        links: {
          ...state.profile.links,
          social: [...action.payload.social],
          custom: [...action.payload.custom]
        },
      },
      loading: false,
      error: null
    };
  }
  return state;
};

const updateLinksFailure = (state: typeof initialState, action: UpdateLinksFailureAction) => {
  return {
    ...state,
    loading: false,
    error: action.error
  };
};

const profileReducer = (state = initialState, action: ProfileActionTypes): typeof initialState => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST: return fetchProfileRequest(state);
    case FETCH_PROFILE_SUCCESS: return fetchProfileSuccess(state, action);
    case FETCH_PROFILE_FAILURE: return fetchProfileFailure(state, action);
    case SAVE_PROFILE_REQUEST: return saveProfileRequest(state);
    case SAVE_PROFILE_SUCCESS: return saveProfileSuccess(state, action);
    case SAVE_PROFILE_FAILURE: return saveProfileFailure(state, action);
    case UPDATE_BASIC_INFO_SUCCESS: return updateBasicInfoSuccess(state, action);
    case UPDATE_ABOUT_SUCCESS: return updateAboutSuccess(state, action);
    case UPDATE_CONTACT_FORM_SUCCESS: return updateContactFormSuccess(state, action);
    case UPDATE_THEME_SUCCESS: return updateThemeSuccess(state, action);
    case UPDATE_COVER_IMAGE_SUCCESS: return updateCoverImageSuccess(state, action);
    case UPDATE_PROFILE_IMAGE_SUCCESS: return updateProfileImageSuccess(state, action);
    case UPDATE_LINKS_REQUEST: return updateLinksRequest(state);
    case UPDATE_LINKS_SUCCESS: return updateLinksSuccess(state, action);
    case UPDATE_LINKS_FAILURE: return updateLinksFailure(state, action);
    default: return state;
  }
};

export default profileReducer;

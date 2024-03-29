import { ContactType } from "./contact";

export type RedirectType = {
  active: boolean;
  url: string | null;
}

export interface UserType {
  accountSecret: string,
  createdOn: Date | string | null,
  loginEmail: string,
  lastLogin: Date | string | null,
  viaInvitation: boolean,
  isActive: boolean,
  invitationId: string,
  batchId: string,
  profileUrlSuffix: string,
  firstName: string,
  lastName: string,
  fullName: string,
  loginMethod: string,
  isTeamMember: boolean,
  isTeamMaster: boolean,
  isAdmin: boolean,
  activeProfileId: string,
  redirect?: RedirectType | null,
  id: string,
  visits?: number | null,
  profileList: [
    {
      profileId: string,
      profileTitle: string,
    }
  ],
  contacts?: ContactType[] | null, 
}

export interface DeleteUserRequest {
  userId: string;
}

export interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

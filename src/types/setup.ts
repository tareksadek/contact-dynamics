import { BasicInfoFormDataTypes, AboutFormDataTypes, LinkType, ImageType, ThemeSettingsType, ContactFormType } from "./profile";
import { RedirectType } from "./user";

export type Milestone = {
  title: string;
  code?: string;
  link?: string;
  description: string;
  goal: number;
}

export interface StaticSetup {
  withInvitations: boolean;
  withMultipleProfiles: boolean;
  profileLimit: number;
  withSubscription: boolean;
  trialPeriod: null | number;
  withTeams: boolean;
  withPrivacyKey: boolean;
  withImpact: boolean;
  withRewards: boolean;
}

export interface FetchedSetup {
  crmExports: Array<object>;
  embedForms: Array<object>;
  rewardsMilestones: Milestone[];
  basicInfoData: BasicInfoFormDataTypes | null;
  aboutData: AboutFormDataTypes | null;
  coverImageData: ImageType | null;
  themeSettings: ThemeSettingsType | null;
  contactFormData?: ContactFormType | null;
  links: {
    social: LinkType[];
    custom: LinkType[];
  };
  connectionSettings: {
    connectButtonText: string;
    connectFormText: string;
    connectFormType: string;
    connectFormCode: string | null;
  };
  redirect?: RedirectType | null,
}

export type SetupType = StaticSetup & FetchedSetup;
export interface InvitationData {
  id?: string | null;
  used: boolean | null;
  usedOn: Date | string | null;
  usedBy: string | null;
  connected: boolean;
  type: string;
  isMaster: boolean;
  expirationDate: Date | string | null;
}

export interface BatchData {
  themeSettings: {
    layout: string;
    theme: string;
    socialLinksToSelectedColor: boolean;
    selectedColor: {
      code: string;
      name: string;
    },
  } | null,
  appLabel: {
    logo: string;
    logoLink: string;
    buttonText: string;
    buttonLink: string;
  } | null,
  id?: string | null;
  createdOn: Date | string | null;
  status: string | null;
  stripeProductId: string | null;
  withSubscription: boolean;
  title: string | null;
  isTeams: boolean;
  invitations?: InvitationData[],
}

export interface BatchesType {
  batches: BatchData[],
}
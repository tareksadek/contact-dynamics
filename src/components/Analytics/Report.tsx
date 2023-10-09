import React from 'react';
import { Box } from '@mui/material';
import { LinkType } from '../../types/profile';
import { ProfileDataType } from '../../types/profile';
import EfficiencyReport from './EfficiencyReport';
import LinksReport from './LinksReport';
import VisitsReport from './VisitsReport';

type ReportProps = {
  sections: {
    efficiency: boolean;
    visits: boolean;
    links: boolean;
  };
  contacts: number;
  visits: number;
  addedToContacts: number;
  links: {
    social: LinkType[];
    custom: LinkType[];
  } | null;
  userId?: string | null;
  profile?: ProfileDataType | null;
};

const Report: React.FC<ReportProps> = ({
  sections,
  contacts,
  visits,
  addedToContacts,
  links,
  userId,
  profile,
}) => {
  return (
    <Box>
      {sections.efficiency && (
        <EfficiencyReport
          contacts={contacts || 0}
          visits={visits || 0}
          addedToContacts={addedToContacts || 0}
        />
      )}
      {sections.links && (
        <LinksReport
          links={links || null}
        />
      )}
      {sections.visits && (
        <VisitsReport
          selectedUserId={userId}
          selectedUserProfile={profile}
        />
      )}
    </Box>
  );
};

export default Report;
import React from 'react';
import { Box } from '@mui/material';
import { LinkType } from '../../types/profile';
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
};

const Report: React.FC<ReportProps> = ({
  sections,
  contacts,
  visits,
  addedToContacts,
  links,
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
        <VisitsReport />
      )}
    </Box>
  );
};

export default Report;
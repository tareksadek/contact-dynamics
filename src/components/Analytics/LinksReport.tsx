import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { LinkType } from '../../types/profile';

type LinksProps = {
  links: {
    social: LinkType[];
    custom: LinkType[];
  } | null;
};

const LinksReport: React.FC<LinksProps> = ({ links }) => {
  const allLinks = links ? [...links.social, ...links.custom] : [];
  const sortedLinks = allLinks.sort((a, b) => (b.clicked || 0) - (a.clicked || 0));

  if (!links || (links && allLinks.length === 0)) {
    return (
      <div>
        There is no links in this profile
      </div>
    )
  }

  return (
    <Box p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h6">Links Report</Typography>
      {sortedLinks.map(link => (
        <Box mt={2} key={link.id}>
          <Link href={link.url} target="_blank" rel="noopener noreferrer">
            {link.isCustom ? link.title : link.platform}
          </Link>
          <Typography variant="caption">
            Clicked: {link.clicked || 0} times
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default LinksReport;
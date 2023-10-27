import React from 'react';
import {
  Typography,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import { SocialIcon } from 'react-social-icons';
import { LinkType } from '../../types/profile';
import { analyticsStyles } from './styles';

type LinksProps = {
  links: {
    social: LinkType[];
    custom: LinkType[];
  } | null;
};

const LinksReport: React.FC<LinksProps> = ({ links }) => {
  const theme = useTheme()
  const classes = analyticsStyles()
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
    <Box>
      <Box pb={2} className={classes.linksContainer}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="body1" align="left">Links Engagement</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {!links || (links && allLinks.length === 0) ? (
                <Alert severity="warning">No Links added to this digital cards.</Alert>
              ) : (
                <Box
                  className={classes.linksList}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="center"
                  flexDirection="column"
                >
                  {sortedLinks.map(link => (
                    <Box
                      key={link.id}
                      className={classes.linkClicksContainer}
                      mb={2}
                    >
                      <Box>
                        <Typography variant="body1" align='left' className={classes.linkClicks}>
                          {link.clicked || 0}
                          <span>Clicks</span>
                        </Typography>
                        <Box
                          className={classes.link}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {link.isCustom ? (
                            <Box pt={0.5} mr={0.5}>
                              <LinkIcon style={{ fontSize: 20 }} />
                            </Box>
                          ) : (
                            <SocialIcon
                              network={link.platform}
                              fgColor={theme.palette.background.avatar}
                              bgColor='transparent'
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                              style={{
                                width: 30,
                                height: 30,
                                marginLeft: -8
                              }}
                            />
                          )}
                          <Typography variant="body1" align='center'>{link.isCustom ? link.title : link.platform}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default LinksReport;
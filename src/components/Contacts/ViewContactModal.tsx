import React from 'react';
import { format, parse } from 'date-fns';
import { Drawer, List, ListItem, ListItemText, Box, Link, IconButton } from '@mui/material';
import { ContactType } from '../../types/contact';
import { layoutStyles } from '../../theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface ViewContactModalProps {
  open: boolean;
  onClose: () => void;
  contact: ContactType | null;
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({ open, onClose, contact }) => {
  const layoutClasses = layoutStyles()
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: layoutClasses.radiusBottomDrawer
      }}
    >
      <Box p={2}>
        <List>
          <ListItem>
            <ListItemText
              primary={`${contact?.firstName || ''} ${contact?.lastName || ''}`}
              primaryTypographyProps={{
                align: 'center',
                style: {
                  textTransform: 'capitalize'
                }
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={(
                <Link
                  href={`mailto:${contact?.email}`}
                >
                  {contact?.email}
                </Link>
              )}
              primaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={(
                <Link
                  href={`tel:${contact?.phone}`}
                >
                  {contact?.phone}
                </Link>
              )}
              primaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
          {contact && typeof contact.createdOn === 'string' && (
            <ListItem>
              <ListItemText
                primary="Created On"
                secondary={format(parse(contact.createdOn as string, 'yyyy-MMM-dd', new Date()), 'yyyy-MMM-dd')}
                primaryTypographyProps={{
                  align: 'center',
                }}
                secondaryTypographyProps={{
                  align: 'center',
                }}
              />
            </ListItem>
          )}
          <ListItem>
            <ListItemText
              primary={contact?.note || ''}
              primaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
        </List>
      </Box>
      <IconButton
        aria-label="delete"
        color="primary"
        className={layoutClasses.drawerCloseButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Drawer>
  );
}

export default ViewContactModal;

import React from 'react';
import { format, parse } from 'date-fns';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { ContactType } from '../../types/contact';

interface ViewContactModalProps {
  open: boolean;
  onClose: () => void;
  contact: ContactType | null;
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({ open, onClose, contact }) => {
  console.log(contact?.createdOn);
  
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <div style={{ width: '100%', padding: '1rem' }}>
        <List>
          <ListItem>
            <ListItemText primary="First Name" secondary={contact?.firstName || ''} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Last Name" secondary={contact?.lastName || ''} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Email"
              secondary={(
                <a href={`mailto:${contact?.email}`}>{contact?.email}</a>
              )}
            >
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Phone"
              secondary={(
                <a href={`tel:${contact?.phone}`}>{contact?.phone}</a>
              )}
            >
            </ListItemText>
          </ListItem>
          {contact && typeof contact.createdOn === 'string' && (
            <ListItem>
              <ListItemText primary="Created On" secondary={format(parse(contact.createdOn as string, 'yyyy-MMM-dd', new Date()), 'yyyy-MMM-dd')} />
            </ListItem>
          )}
          <ListItem>
            <ListItemText primary="Note" secondary={contact?.note || ''} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default ViewContactModal;

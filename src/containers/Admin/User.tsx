import React, { useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import QRCodeStyling from "qr-code-styling";
import { AppDispatch } from '../../store/reducers';
import { RootState } from '../../store/reducers';
import { fetchUser } from '../../store/actions/users';
import { resetInvitation } from '../../store/actions/batch';
import {
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { appDomain } from '../../setup/setup';
import { userStyles } from './styles';
// import { layoutStyles } from '../../theme/layout';

const User: React.FC = () => {
  // const layoutClasses = layoutStyles()
  const classes = userStyles()
  const theme = useTheme()
  const params = useParams<{ userId: string }>();
  const userId = params?.userId || "";

  const navigate = useNavigate();

  const setup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.users.selectedUser);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);  
  const dispatch = useReduxDispatch<AppDispatch>();  

  // const [expanded, setExpanded] = useState<string | false>('panel1');

  const qrCodeRef = useRef(null);
  const qrCode = useMemo(() => new QRCodeStyling({
    width: 200,
    height: 200,
    data: `${appDomain}/activate?tac=${user?.invitationId}_${user?.batchId}`,
    dotsOptions: {
      color: '#000000',
      type: 'rounded',
    },
  }), [user?.invitationId, user?.batchId]);  

  useEffect(() => {
    if (!user || (user && user.id !== userId)) {
      dispatch(fetchUser(userId));
    }
  }, [userId, dispatch, user]);

  useEffect(() => {
    if (user && qrCodeRef.current) {
      qrCode.append(qrCodeRef.current);
    }
  }, [user, qrCode]);

  const viewProfile = () => {
    if (user && user.profileUrlSuffix) {
      navigate(`${appDomain}/${user.profileUrlSuffix}`)
    }
  }

  const viewContacts = () => {
    if (user) {
      navigate(`/users/${user.id}/contacts`)
    }
  }

  const deleteUser = () => {
    let message = 'Deleting a user will remove all user data and reset the related invitation. Continue?';

    if (!window.confirm(message)) {
      return;
    }
    if (user) {
      dispatch(resetInvitation(user.batchId, user.invitationId, userId))
      navigate('/users')
    }
  }

  // const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

  return (
    <Box>
      {user && (
        <Box>
          <Box pb={2}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography variant="body1" align="left">Digital Card</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className={classes.qrBoxContainer}>
                  <List>
                    <ListItem>
                      <Box width="100%" display="flex" alignItems="center" justifyContent="center" className={classes.qrBox}>
                        <div ref={qrCodeRef}></div>
                      </Box>
                    </ListItem>
                    <ListItem>
                      <Box width="100%" display="flex" alignItems="center" justifyContent="center" gap={2}>
                        <Button
                          onClick={() => qrCode.download({
                            extension: "svg",
                            name: `${user.firstName}_${user.lastName}`
                          })}
                        >
                          Save as SVG
                        </Button>

                        <Button
                          onClick={() => qrCode.download({
                            extension: "png",
                            name: `${user.firstName}_${user.lastName}`
                          })}
                        >
                          Save as PNG
                        </Button>
                      </Box>
                    </ListItem>
                  </List>
                  <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2} className={classes.qrBoxButtons}>
                    <Button
                      onClick={viewProfile}
                      variant='outlined'
                      color='primary'
                      fullWidth
                    >
                      View Digital Card
                    </Button>
                    <Button
                      onClick={viewContacts}
                      variant='outlined'
                      color='primary'
                      fullWidth
                    >
                      View Contacts
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box pb={2}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography variant="body1" align="left">Account Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className={classes.accountInfoContainer}>
                  <List>
                    <ListItem>
                      <Typography variant="body2" align="left">Created On</Typography>
                      <Typography variant="body1" align="left">
                        {user.createdOn ? (user.createdOn instanceof Date ? user.createdOn.toLocaleString() : user.createdOn) : 'N/A'}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" align="left">Full Name</Typography>
                      <Typography variant="body1" align="left" style={{ textTransform: 'capitalize' }}>{user.fullName}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" align="left">Login Method</Typography>
                      <Typography variant="body1" align="left">{user.loginMethod}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" align="left">Login Email</Typography>
                      <Typography variant="body1" align="left">{user.loginEmail}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" align="left">Last Login</Typography>
                      <Typography variant="body1" align="left">
                        {user.lastLogin ? (user.lastLogin instanceof Date ? user.lastLogin.toLocaleString() : user.lastLogin) : 'N/A'}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" align="left">Digital Card URL</Typography>
                      <Typography variant="body1" align="left">{`${appDomain}/${user.profileUrlSuffix}`}</Typography>
                    </ListItem>
                    {setup && setup.withMultipleProfiles && user && user.profileList && (
                      <ListItem>
                        <Typography variant="body2" align="left">Number of Digital Cards</Typography>
                        <Typography variant="body1" align="left">{user.profileList.length}</Typography>
                      </ListItem>
                    )}
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box pb={2}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography variant="body1" align="left">Team Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className={classes.accountInfoContainer}>
                  <List>
                    <ListItem>
                      <Typography variant="body2" align="left">Is Team Member</Typography>
                      <Typography variant="body1" align="left">
                        {user.isTeamMember ? 'Yes' : 'No'}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" align="left">Is Team Master</Typography>
                      <Typography variant="body1" align="left">{user.isTeamMaster ? 'Yes' : 'No'}</Typography>
                    </ListItem>
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      )}
      <Box
        // className={layoutClasses.stickyBottomBox}
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
      >
        <Button
          onClick={deleteUser}
          disabled={isLoading}
          fullWidth
          variant="contained"
          color="primary"
          style={{
            backgroundColor: theme.palette.background.danger
          }}
        >
          Delete user
        </Button>
      </Box>
    </Box>
  );
}

export default User;


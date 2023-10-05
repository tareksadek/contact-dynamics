import React, { useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import QRCodeStyling from "qr-code-styling";
import { AppDispatch } from '../../store/reducers';
import { RootState } from '../../store/reducers';
import { fetchUser } from '../../store/actions/users';
import { resetInvitation } from '../../store/actions/batch';
import { Paper, Typography, List, ListItem, Button } from '@mui/material';
import { appDomain } from '../../setup/setup';

const User: React.FC = () => {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId || "";

  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.users.selectedUser);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);  
  const dispatch = useReduxDispatch<AppDispatch>();  

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
    if (!user) {
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

  const deleteUser = () => {
    if (user) {
      dispatch(resetInvitation(user.batchId, user.invitationId))
      navigate('/users')
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={deleteUser}
        disabled={isLoading}
      >
        Delete user
      </Button>
      {user && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {/* Basic Info */}
          <Paper style={{ padding: '20px', flexGrow: 1 }}>
            <Typography variant="h5">Basic Info</Typography>
            <List>
              <ListItem><strong>Full Name:</strong> {user.fullName}</ListItem>
              <ListItem><strong>Email:</strong> {user.loginEmail}</ListItem>
            </List>
          </Paper>

          {/* Profile Info */}
          <Paper style={{ padding: '20px', flexGrow: 1 }}>
            <Typography variant="h5">Profile Info</Typography>
            <List>
              <ListItem><strong>Number of profiles:</strong> {user.profileList.length}</ListItem>
              <ListItem><strong>Profile URL:</strong> {`${appDomain}/${user.profileUrlSuffix}`}</ListItem>
              <ListItem>
                <div ref={qrCodeRef}></div>
              </ListItem>
              <ListItem>
                <Button onClick={viewProfile}>View Profile</Button>
                <Button onClick={() => qrCode.download({
                    extension: "svg",
                    name: `${user.firstName}_${user.lastName}`
                })}>Save as SVG</Button>

                <Button onClick={() => qrCode.download({
                    extension: "png",
                    name: `${user.firstName}_${user.lastName}`
                })}>Save as PNG</Button>
              </ListItem>
            </List>
          </Paper>

          {/* Team & Admin Info */}
          <Paper style={{ padding: '20px', flexGrow: 1 }}>
            <Typography variant="h5">Team & Admin Info</Typography>
            <List>
              <ListItem><strong>Is Team Master:</strong> {user.isTeamMaster ? 'Yes' : 'No'}</ListItem>
              <ListItem><strong>Is Team Member:</strong> {user.isTeamMember ? 'Yes' : 'No'}</ListItem>
            </List>
          </Paper>

          {/* Account Info */}
          <Paper style={{ padding: '20px', flexGrow: 1 }}>
            <Typography variant="h5">Account Info</Typography>
            <List>
              <ListItem><strong>Login Method:</strong> {user.loginMethod}</ListItem>
              <ListItem>
                <strong>Created On:</strong> 
                {user.createdOn ? (user.createdOn instanceof Date ? user.createdOn.toLocaleString() : user.createdOn) : 'N/A'}
              </ListItem>
              <ListItem>
                <strong>Last Login:</strong> 
                {user.lastLogin ? (user.lastLogin instanceof Date ? user.lastLogin.toLocaleString() : user.lastLogin) : 'N/A'}
              </ListItem>

            </List>
          </Paper>
        </div>
      )}
    </div>
  );
}

export default User;


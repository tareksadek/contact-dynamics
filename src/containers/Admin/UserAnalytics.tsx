import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Report from '../../components/Analytics/Report';
import { RootState, AppDispatch } from '../../store/reducers';
import { fetchUserProfileById } from '../../store/actions/users';

const UserAnalytics: React.FC = () => {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId || "";
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.users.selectedUserProfile);
  const selectedUser = useSelector((state: RootState) => state.users.selectedUser);

  useEffect(() => {
    if (!selectedUser || (profile && userId !== profile.userId)) {
      dispatch(fetchUserProfileById(userId));
    }
  }, [dispatch, selectedUser, userId, profile]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Analytics</Typography>
      <Typography variant="body1" mb={3}>
        A detailed report about performance.
      </Typography>
      <Report
        sections={{
          efficiency: true,
          visits: true,
          links: true
        }}
        contacts={profile?.contacts || 0}
        visits={profile?.visits || 0}
        addedToContacts={profile?.addedToContacts || 0}
        links={profile?.links || null}
        userId={userId}
        profile={profile}
      />
    </Box>
  );
};

export default UserAnalytics;
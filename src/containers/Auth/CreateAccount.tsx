import React, { useEffect } from 'react';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, User } from '@firebase/auth';
import { Timestamp } from '@firebase/firestore';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '../../store/reducers';
import { fetchSetup } from '../../store/actions/setup';
import { createUserDocument } from '../../API/user';
import { generateRandomString } from '../../utilities/utils';
import { updateInvitation } from '../../API/invitations';
import { SetupType } from '../../types/setup';
import { InvitationData, BatchData } from '../../types/userInvitation';
import { appDomainView } from '../../setup/setup';

const CreateAccount: React.FC = () => {
  const dispatch = useReduxDispatch<AppDispatch>();
  const navigate = useNavigate();
  const setup = useSelector((state: RootState) => state.setup.setup);
  const batch = useSelector((state: RootState) => state.userInvitation.batch);
  const invitation = useSelector((state: RootState) => state.userInvitation.invitation);

  useEffect(() => {
    if (setup) {
      if (setup.withInvitations && !invitation) {
        navigate('/');
      }
    } else {
      dispatch(fetchSetup());
    }
  }, [invitation, navigate, dispatch, setup]);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
  });

  const handlePostSignupActions = async (
    user: User,
    setup: SetupType,
    batch: BatchData,
    invitation: InvitationData,
    firstName: string,
    lastName: string,
    loginMethod: string
  ) => {
    const docData = {
      accountSecret: generateRandomString(),
      createdOn: Timestamp.now().toDate(),
      loginEmail: user.email || '',
      lastLogin: Timestamp.now().toDate(),
      viaInvitation: !!setup?.withInvitations || false,
      isActive: true,
      invitationId: invitation?.id || '',
      batchId: batch?.id || '',
      profileUrlSuffix: `${firstName}_${lastName}`,
      firstName,
      lastName,
      fullName: `${firstName || ''} ${lastName || ''}`,
      loginMethod: loginMethod,
      isTeamMember: batch?.isTeams || false,
      isTeamMaster: invitation?.isMaster || false,
      isAdmin: false,
      redirect: {
        active: false,
        url: ''
      },
    };
    const response = await createUserDocument(user.uid, docData);
    if (response.success) {
      console.log("Document successfully created!");

      if (setup?.withInvitations && batch?.id && invitation?.id) {
        const updateData = {
          used: true,
          usedBy: user.uid,
          usedOn: Timestamp.now(),
        };
        const updateResponse = await updateInvitation(batch.id, invitation.id, updateData);
        if (updateResponse.success) {
          console.log("Invitation successfully updated!");
        } else {
          console.error("Error updating invitation:", updateResponse.error);
        }
      }
      navigate('/createProfile');
    } else {
      console.error("Error creating document:", response.error);
    }
  }

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        // Extract user details from Google Auth provider
        const fullName = user.displayName || '';
        const [firstName = '', lastName = ''] = fullName.split(' ');
        if (setup && batch && invitation) {
          await handlePostSignupActions(user, setup, batch, invitation, firstName, lastName, 'google');
        }
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  const onSubmit = async (data: any) => {
    const { email, password, firstName, lastName } = data;
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      if (user && setup && batch && invitation) {
        await handlePostSignupActions(user, setup, batch, invitation, firstName, lastName, 'email');
      }
    } catch (err) {
      // Handle error
      console.error((err as Error).message);
    }
  };

  // Example for watching field changes
  const watchedFirstName = watch('firstName');
  const watchedLastName = watch('lastName');

  const profileUrl = `${appDomainView}/${watchedFirstName || '...'}${watchedLastName ? `_${watchedLastName}` : ''}`;

  return (
    <Container>
      <Box pt={2}>
        <Typography variant="h3" align="center">Welcome to Contact Dynamics</Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={1}
          mb={1}
        >
          <img src="/assets/images/welcome.svg" alt="Welcome to Contact Dynamics" />
        </Box>
        <Typography variant="h4" align="center">Create Account</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("firstName", { required: "First name is required" })}
            variant="outlined"
            margin="normal"
            fullWidth
            label="First Name*"
          />
          <Typography color="error">
            {typeof errors.firstName?.message === 'string' ? errors.firstName.message : null}
          </Typography>

          <TextField
            {...register("lastName")}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Last Name"
          />

          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email format"
              }
            })}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            type="email"
          />
          <Typography color="error">
            {typeof errors.email?.message === 'string' ? errors.email.message : null}
          </Typography>

          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters long" }
            })}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type="password"
          />
          <Typography color="error">
            {typeof errors.password?.message === 'string' ? errors.password.message : null}
          </Typography>

          <Box mt={2} mb={2}>
            <Typography variant="body1">
              <b>Your profile URL will be: {profileUrl}</b>
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isValid}
          >
            Sign Up
          </Button>

          <Box mt={2} mb={2}>
            <Typography variant="body1" align="center">
              - OR -
            </Typography>
          </Box>

          <Button
            onClick={signInWithGoogle}
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
          >
            Continue with Google
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default CreateAccount;

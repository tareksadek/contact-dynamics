import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AppDispatch } from '../../store/reducers';
import { setNotification } from '../../store/actions/notificationCenter';
import { getAuthErrorMessage } from '../../utilities/utils';
import { getUserById } from '../../API/user';
import { UserType } from '../../types/user';

interface FirebaseError extends Error {
  code: string;
}

type ResponseType = {
  success: boolean;
  data?: UserType;
  error?: string;
};

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm();
  const navigate = useNavigate();

  const handleSignInSuccess = async (userCredential: any, auth: any) => {
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const userResponse = await getUserById(auth.currentUser?.uid) as ResponseType;
    if (idTokenResult.claims.admin) {
      navigate('/adminDashboard');
    } else if (userResponse.success && userResponse.data && userResponse.data.profileList && userResponse.data.profileList.length > 0) {
      navigate(`/${userResponse.data.profileUrlSuffix}`);
    } else {
      navigate('/createProfile');
    }
  };  

  const signInWithEmail = async (email: string, password: string) => {
    const auth = getAuth();
      
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSignInSuccess(userCredential, auth)
    } catch (err) {      
      const message = getAuthErrorMessage((err as FirebaseError).code);
      dispatch(setNotification({ 
        message: message, 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  };  

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await handleSignInSuccess(userCredential, auth)
      // const idTokenResult = await userCredential.user.getIdTokenResult();
      // let userResponse: ResponseType = { success: false }
      // if (auth && auth.currentUser && auth.currentUser?.uid) {
      //   userResponse = await getUserById(auth.currentUser?.uid) as ResponseType;
      // }
      // if (userResponse.success && userResponse.data) {
      //   if (idTokenResult.claims.admin) {
      //     navigate('/adminDashboard');
      //   } else if (userResponse.data.profileList && userResponse.data.profileList.length > 0) {          
      //     navigate(`/${userResponse.data.profileUrlSuffix}`);
      //   } else {
      //     navigate('/createProfile');
      //   }
      // }
    } catch (err) {
      const message = getAuthErrorMessage((err as FirebaseError).code);
      dispatch(setNotification({ 
        message: message, 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  };  

  const onSubmit = (data: any) => {
    const { email, password } = data;
    signInWithEmail(email, password);
  };

  return (
    <Container maxWidth="xs">
      <Box pt={2}>
        <Typography variant="h4" align="center">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              required: "Password is required"
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isValid}
          >
            Login
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
          >
            Login with Google
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;

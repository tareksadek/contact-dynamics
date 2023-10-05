import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm();
  const navigate = useNavigate();

  const signInWithEmail = async (email: string, password: string) => {
    const auth = getAuth();
      
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        navigate('/adminDashboard');
      } else {
        console.log('navigating to profile');
        
        navigate('/profile');
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };  

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };  

  const onSubmit = (data: any) => {
    const { email, password } = data;
    signInWithEmail(email, password);
  };

  return (
    <Container maxWidth="xs">
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
        <br /><br />
        <Button
          onClick={signInWithGoogle}
          fullWidth
          variant="outlined"
          style={{ marginTop: '16px' }} // add some space between the buttons
        >
          Login with Google
        </Button>
      </form>
    </Container>
  );
}

export default Login;

import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import { Button, TextField, Container, Typography } from '@mui/material';

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      // Navigate to profile or dashboard page after successful account creation
      // For now, we'll just clear the form
      setEmail('');
      setPassword('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
      // Navigate to profile or dashboard page after successful account creation
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center">Create Account</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign Up
        </Button>
        <br /><br />
        <Button
          onClick={handleGoogleSignup}  // Notice the change here
          fullWidth
          variant="outlined"  // Made this "outlined" to distinguish it from the email sign-up
          color="primary"
        >
          Sign Up with Google
        </Button>
      </form>
    </Container>
  );
}

export default CreateAccount;

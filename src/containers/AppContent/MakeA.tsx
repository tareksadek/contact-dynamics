import React, { useState } from 'react';
import { functions } from '../../API/firebaseConfig';
import { httpsCallable, HttpsCallableResult } from '@firebase/functions';

// This is the shape of the data we send to the callable function.
interface AddAdminRequest {
  email: string;
}

// This is the expected shape of the response.
interface AdminRoleResponse {
  message: string;
}

const MakeAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const makeAdmin = async () => {
    const addAdminRole = httpsCallable<AddAdminRequest, AdminRoleResponse>(functions, 'addAdminRole');

    try {
      const result: HttpsCallableResult<AdminRoleResponse> = await addAdminRole({ email });
      setMessage(result.data.message);
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="User's email" 
      />
      <button onClick={makeAdmin}>Make Admin</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MakeAdmin;

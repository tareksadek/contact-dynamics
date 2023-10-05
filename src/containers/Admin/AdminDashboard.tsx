import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import { RootState } from '../../store/reducers';

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const error = useSelector((state: RootState) => state.setup.error);

  if (error) return <p>Error: {error}</p>;

  console.log(theme);

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
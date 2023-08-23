import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateAccount from './containers/Auth/CreateAccount';
import ProfilePage from './containers/Profile/Profile';
import Landing from './containers/Landing/Landing'; 

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* You can add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

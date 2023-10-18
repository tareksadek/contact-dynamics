import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileWizardProvider } from '../../providers/ProfileWizardProvider';
import { SubmitProvider } from '../../contexts/SubmitContext';
import ProtectedWrapper from './ProtectedWrapper';
import GuestOnlyWrapper from './GuestOnlyWrapper';
import ProfileWrapper from './ProfileWrapper';
import AdminProtectedWrapper from './AdminProtectedWrapper';
import AppLayout from '../../Layout/AppLayout';
import Notification from '../../components/Notification/Notification';
import LoadingBackdrop from '../../components/Loading/LoadingBackdrop';
import Login from '../Auth/Login';
import CreateAccount from '../Auth/CreateAccount';
import ProfilePage from '../Profile/View/Profile';
import Landing from '../Landing/Landing'; 
import InvitationValidator from '../InvitationValidator/InvitationValidator';
import CreateProfile from '../Profile/Create/CreateProfile';
import BasicInfo from '../Profile/Edit/BasicInfo';
import About from '../Profile/Edit/About';
import Theme from '../Profile/Edit/Theme';
import Images from '../Profile/Edit/Images';
import Links from '../Profile/Edit/Links';
import Contacts from '../Contacts/Contacts';
import ContactForm from '../Contacts/ContactForm';
import QrCode from '../Utilities/QrCode';
import ShareProfile from '../Utilities/ShareProfile';
import RedirectProfiles from '../Utilities/RedirectProfiles';
import AdminDashboard from '../Admin/AdminDashboard';
import Batches from '../Admin/batches';
import EnvironmentalImpact from '../ImpactAndRewards/EnvironmentalImpact';
import Analytics from '../Analytics/Analytics';
import Invitations from '../Admin/Invitations';
import CreateBatch from '../Admin/CreateBatch';
import Users from '../Admin/users';
import User from '../Admin/User';
import UserContacts from '../Admin/UserContacts'
import UserAnalytics from '../Admin/UserAnalytics';
import Logout from '../Auth/Logout';
import MakeAdmin from './MakeA';

const AppContent: React.FC = () => {
  return (
      <SubmitProvider>
        <Router>
          <AppLayout>
            <Notification />
            <LoadingBackdrop cubed />
            <Routes>
              <Route path="/" element={<GuestOnlyWrapper><Landing /></GuestOnlyWrapper>} />
              <Route path="/login" element={<GuestOnlyWrapper><Login /></GuestOnlyWrapper>} />

              <Route path="/createAccount" element={<GuestOnlyWrapper><CreateAccount /></GuestOnlyWrapper>} />
              <Route path="/createProfile" element={<ProtectedWrapper><ProfileWizardProvider><CreateProfile /></ProfileWizardProvider></ProtectedWrapper>} />
              <Route path="/info" element={<ProtectedWrapper><BasicInfo /></ProtectedWrapper>} />
              <Route path="/about" element={<ProtectedWrapper><About /></ProtectedWrapper>} />
              <Route path="/theme" element={<ProtectedWrapper><Theme /></ProtectedWrapper>} />
              <Route path="/images" element={<ProtectedWrapper><Images /></ProtectedWrapper>} />
              <Route path="/links" element={<ProtectedWrapper><Links /></ProtectedWrapper>} />
              <Route path="/contacts" element={<ProtectedWrapper><Contacts /></ProtectedWrapper>} />
              <Route path="/contactForm" element={<ProtectedWrapper><ContactForm /></ProtectedWrapper>} />
              <Route path="/qrcode" element={<ProtectedWrapper><QrCode /></ProtectedWrapper>} />
              <Route path="/share" element={<ProtectedWrapper><ShareProfile /></ProtectedWrapper>} />
              <Route path="/redirect" element={<ProtectedWrapper><RedirectProfiles /></ProtectedWrapper>} />
              <Route path="/impact" element={<ProtectedWrapper><EnvironmentalImpact /></ProtectedWrapper>} />
              <Route path="/efficiency" element={<ProtectedWrapper><Analytics /></ProtectedWrapper>} />

              <Route path="/makea" element={<ProtectedWrapper><MakeAdmin /></ProtectedWrapper>} />
              <Route path="/adminDashboard" element={<AdminProtectedWrapper><AdminDashboard /></AdminProtectedWrapper>} />
              <Route path="/batches" element={<AdminProtectedWrapper><Batches /></AdminProtectedWrapper>} />
              <Route path="/createBatch" element={<AdminProtectedWrapper><CreateBatch /></AdminProtectedWrapper>} />
              <Route path="/batches/:batchId/invitations" element={<AdminProtectedWrapper><Invitations /></AdminProtectedWrapper>} />
              <Route path="/users" element={<AdminProtectedWrapper><Users /></AdminProtectedWrapper>} />
              <Route path="/users/:userId" element={<AdminProtectedWrapper><User /></AdminProtectedWrapper>} />
              <Route path="/users/:userId/contacts" element={<AdminProtectedWrapper><UserContacts /></AdminProtectedWrapper>} />
              <Route path="/users/:userId/analytics" element={<AdminProtectedWrapper><UserAnalytics /></AdminProtectedWrapper>} />

              <Route path="/activate" element={<InvitationValidator />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/:profileSuffix" element={<ProfileWrapper><ProfilePage /></ProfileWrapper>} />
            </Routes>
          </AppLayout>
        </Router>
      </SubmitProvider>
  );
}

export default AppContent;

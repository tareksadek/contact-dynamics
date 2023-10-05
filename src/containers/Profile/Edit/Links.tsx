import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import LinksCreator from '../../../components/Profile/LinksCreator';
import { LinkType } from '../../../types/profile';
import { RootState, AppDispatch } from '../../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateProfileLinks } from '../../../store/actions/profile';

const Links: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [links, setLinks] = useState<{ social: LinkType[], custom: LinkType[] }>({ social: [], custom: [] });

  const initialSocialLinksData = useRef<LinkType[]>(links.social);
  const initialCustomLinksData = useRef<LinkType[]>(links.custom);

  const checkIfLinksChanged = useCallback(() => {
    const socialLinksChanged = JSON.stringify(initialSocialLinksData.current) !== JSON.stringify(links.social);
    const customLinksChanged = JSON.stringify(initialCustomLinksData.current) !== JSON.stringify(links.custom);
    return { socialLinksChanged, customLinksChanged }
  }, [links]);

  // console.log(links);
  // console.log(profile && profile.links.social);

  const handleLinksSubmit = useCallback(() => {
    if (!authUser?.userId || !user) {
      return;
    }
    const linksChanged = checkIfLinksChanged();

    console.log(links);
    
    if (linksChanged.socialLinksChanged || linksChanged.customLinksChanged) {
      dispatch(updateProfileLinks(authUser?.userId, user.activeProfileId, links))
    }   
  }, [authUser?.userId, user, links, checkIfLinksChanged, dispatch]);

  useEffect(() => {
    if (profile && profile.links) {
      setLinks(profile.links)
      initialSocialLinksData.current = profile.links.social;
      initialCustomLinksData.current = profile.links.custom;
    }
  }, [profile]);

  useEffect(() => {
    registerSubmit(handleLinksSubmit);
  }, [registerSubmit, handleLinksSubmit]);

  useEffect(() => {
    const linksChanged = checkIfLinksChanged();
    console.log(linksChanged);
    setFormValid(true)
    setFormChanged(linksChanged.socialLinksChanged || linksChanged.customLinksChanged);
  }, [checkIfLinksChanged, links, setFormChanged, setFormValid]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>Links</Typography>
      <LinksCreator
        setLinks={setLinks}
        links={links}
      />
    </div>
  );
}

export default Links;

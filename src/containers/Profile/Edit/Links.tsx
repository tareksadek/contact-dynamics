import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import LinksCreator from '../../../components/Profile/LinksCreator';
import { LinkType } from '../../../types/profile';
import { RootState, AppDispatch } from '../../../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { updateProfileLinks } from '../../../store/actions/profile';
import { layoutStyles } from '../../../theme/layout';

const Links: React.FC = () => {
  const layoutClasses = layoutStyles()
  const authUser = useSelector((state: RootState) => state.authUser);
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [links, setLinks] = useState<{ social: LinkType[], custom: LinkType[] }>({ social: [], custom: [] });

  const initialSocialLinksData = useRef<LinkType[]>(links.social);
  const initialCustomLinksData = useRef<LinkType[]>(links.custom);

  const checkIfLinksChanged = useCallback(() => {
    const socialLinksChanged = !_.isEqual(initialSocialLinksData.current, links.social);
    const customLinksChanged = !_.isEqual(initialCustomLinksData.current, links.custom);
    return { socialLinksChanged, customLinksChanged }
  }, [links]);

  const handleLinksSubmit = useCallback(() => {
    if (!authUser?.userId || !user) {
      return;
    }
    const linksChanged = checkIfLinksChanged();

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
    <Box>
      <LinksCreator
        setLinks={setLinks}
        links={links}
      />
      <Box
        className={layoutClasses.stickyBottomBox}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          onClick={handleLinksSubmit}
          fullWidth
          variant="contained"
          color="primary"
          disabled={!formValid || !formChanged}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default Links;

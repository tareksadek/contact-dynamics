import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';

const About: React.FC = () => {
  const setup = useSelector((state: RootState) => state.setup.setup);
  const profile = useSelector((state: RootState) => state.profile.profile);

  let aboutData;

  if (setup && setup.aboutData && setup.aboutData.about) {
    aboutData = setup.aboutData.about;
  } else if (profile && profile.aboutData && profile.aboutData.about) {
    aboutData = profile.aboutData.about;
  }

  if (aboutData) {
    return (
      <div>
        <div>
          <div>
            <p>
              {aboutData}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null
};

export default About;

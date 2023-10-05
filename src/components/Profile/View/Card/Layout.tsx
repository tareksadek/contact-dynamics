import React from 'react';
import Header from './Header';
import About from '../About';
import ActionButtons from '../ActionButtons';
import Links from '../Links';
import Video from '../Video';
import Info from '../Info';

const Layout: React.FC<{ profile: any }> = ({ profile }) => {
  return (
    <div>
      <Header />

      <About />

      <ActionButtons
        buttonStyles={{
          layout: 'divided',
          buttonStyle: 'rounded'
        }}
      />

      <Links
        linksStyles={{
          socialLinksStyle: 'rounded',
          customLinksFirst: false
        }}
      />

      <Video />

      <Info />
    </div>
  );
};

export default Layout;

import { Container } from "@mui/material";
import { ReactNode } from 'react';
import { appStyles } from './appStyles';

interface AppContentContainerProps {
  children: ReactNode;
}

const AppContentContainer: React.FC<AppContentContainerProps> = ({ children }) => {
  const classes = appStyles();
  return (
    <Container className={classes.contentContainer}>
      {children}
    </Container>
  );
}

export default AppContentContainer;

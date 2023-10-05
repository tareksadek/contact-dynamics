import { Container } from "@mui/material";
import { ReactNode } from 'react';


interface AppContentContainerProps {
  children: ReactNode;
}

const AppContentContainer: React.FC<AppContentContainerProps> = ({ children }) => {
  return (
    <Container style={{maxWidth: 550}}>
      {children}
    </Container>
  );
}

export default AppContentContainer;

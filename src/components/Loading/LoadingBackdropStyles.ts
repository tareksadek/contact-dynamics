import { styled } from '@mui/material/styles';

type BackdropProps = {
  boxed?: boolean;
}

const BackdropStyled = styled('div')<BackdropProps>(({ theme, boxed }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: '#fff',
  flexDirection: 'column',
  backgroundColor: '#000000',
  position: 'fixed',
  top: 0,
  bottom: 'auto',
  ...(boxed && {
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }),
}));

const LoadingBoxStyled = styled('div')<BackdropProps>(({ theme }) => ({
  // position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
  width: 300,
  height: 85,
  padding: theme.spacing(2),
  backgroundColor: '#f2f2f2',
  borderRadius: theme.spacing(1),
  boxShadow: '0 0 5px #222',
}));

const ProgressContainerStyled = styled('div')<BackdropProps>(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
  width: 300,
  height: 85,
  padding: theme.spacing(2),
  backgroundColor: '#f2f2f2',
  borderRadius: theme.spacing(1),
  boxShadow: '0 0 5px #222',
  '& .MuiLinearProgress-root': {
    height: 5,
    borderRadius: theme.spacing(2),
    backgroundColor: '#272727',
  },
  '& .MuiLinearProgress-barColorPrimary': {
    backgroundColor: '#00c1af',
  },
  '& .MuiLinearProgress-bar1Buffer': {
    backgroundColor: '#272727',
  },
}));

const ProgressMessageStyled = styled('div')<BackdropProps>(({ theme }) => ({
  padding: 0,
  textAlign: 'center',
  color: '#272727',
  fontSize: '0.8rem',
  position: 'relative',
  zIndex: 1,
}));

const ProgressPercentageContainerStyled = styled('div')<BackdropProps>(({ theme }) => ({
  position: 'initial',
  padding: 0,
  textAlign: 'center',
  color: '#272727',
  fontSize: '0.8rem',
}));

export {
  BackdropStyled,
  LoadingBoxStyled,
  ProgressContainerStyled,
  ProgressMessageStyled,
  ProgressPercentageContainerStyled
};

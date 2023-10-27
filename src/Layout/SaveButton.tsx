import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Grow } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { RootState } from '../store/reducers';
// import { hideNotification } from '../store/actions/notificationCenter';
import { saveButtonStyles } from './appStyles';

interface SaveButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled: boolean | undefined;
  text: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, type, disabled, text }) => {
  const classes = saveButtonStyles()
  const notification = useSelector((state: RootState) => state.notificationCenter.notification);
  const isOpen = useSelector((state: RootState) => state.notificationCenter.isOpen);

  // const dispatch = useDispatch();

  // const handleClose = () => {
  //   dispatch(hideNotification());
  // };

  return (
    <>
        {/* <Snackbar open={isOpen} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ horizontal, vertical }}>
        <Alert onClose={handleClose} severity={notification.type}>
        {notification.message}
        </Alert>
        </Snackbar> */}
        <Button
          onClick={onClick}
          type={type || undefined}
          fullWidth
          variant="contained"
          color="primary"
          disabled={disabled}
          className={`${classes.saveButton} ${isOpen && notification && notification.type === 'success' ? classes.saveButtonSuccess : ''} ${isOpen && notification && notification.type === 'error' ? classes.saveButtonError : ''}`}
        >
          {isOpen && notification && notification.type === 'success' && (
            <Grow in={true}>
              <CheckCircleOutlineIcon />
            </Grow>
          )}
          {isOpen && notification && notification.type === 'error' && (
            <Grow in={true}>
              <HighlightOffIcon />
            </Grow>
          )}
          {!notification && text}
        </Button>
    </>
  );
};

export default SaveButton;
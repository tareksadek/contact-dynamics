import styled from '@emotion/styled';
import Cropper from 'react-easy-crop';
import { SketchPicker } from 'react-color';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const imageCropperStyles = makeStyles((theme: Theme) => ({
  delButtonContainer: {},
  currentImageContainer: {
    position: 'relative',
    '& $delButtonContainer': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.red,
      color: '#fff',
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      width: 24,
      height: 24,
      '&:hover': {
        backgroundColor: theme.palette.background.red,
        color: '#fff',
      },
    },
  },
  
}));

export const linksStyles = makeStyles((theme: Theme) => ({
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    flexWrap: 'wrap',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: `${theme.spacing(1)} !important`,
    maxWidth: 50,
    '& .MuiListItemIcon-root': {
      minWidth: 50,
    },
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
      textTransform: 'capitalize',
    }
  },
  buttonContainerDisabled: {
    opacity: 0.5,
  },
  platformTitle: {
    fontSize: '0.75rem',
  },
  linkItemIconButton: {},
  linksListItem: {
    backgroundColor: theme.palette.background.listItem,
    border: `1px solid ${theme.palette.background.listItemBorder}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0
    },
    '& $linkItemIconButton': {
      color: theme.palette.background.listItemIconButton
    },
  },
  linkItemDragIcon: {
    color: theme.palette.background.listItemDragHandler,
    marginRight: theme.spacing(1),
  },
}));

export const themeStyles = makeStyles((theme: Theme) => ({
  layoutContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 350,
  },
  layoutItem: {
    position: 'relative',
    '& p': {
      color: theme.palette.background.defaultText,
    }
  },
  layoutIcon: {
    '& svg': {
      fontSize: '140px !important',
    },
  },
  selectedLayoutIconContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
  selectedLayoutIcon: {
    color: theme.palette.background.selectedItemIcon,
  },
  themeSelectedIconContainer: {},
  themeIconContainer: {
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: theme.palette.background.defaultIcon,
    '& svg': {
      fontSize: 32,
    },
    '&$themeSelectedIconContainer': {
      backgroundColor: theme.palette.background.selectedItemIcon,
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  colorItem: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
}));

type IconCircleProps = {
  bgColor?: string;
};


export const StyledCropper = styled(Cropper)`
    .reactEasyCrop_Container {
        width: 100%;
        max-width: 550px;
        max-height: 550px;
        margin: auto;
    }
`;

export const StyledSketchPicker = styled(SketchPicker)`
  > div: first-child {
    height: 200px;
    padding-bottom: 0 !important;
  }
  > div: last-child {
    display: none !important;
  }
`;

export const IconCircle = styled.div<IconCircleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.bgColor};
  svg {
    color: #fff;
  }
`;

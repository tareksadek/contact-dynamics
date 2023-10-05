import styled from '@emotion/styled';
import Cropper from 'react-easy-crop';
import { SketchPicker } from 'react-color';
import IconButton from '@mui/material/IconButton';

type IconCircleProps = {
  bgColor?: string;
};


export const StyledIconButton = styled(IconButton)`
  svg {
    font-size: 140px;
  }
  
  &:hover svg {
  }
`;

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

import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Drawer, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { setNotification } from '../../store/actions/notificationCenter';
import ImageCropper from './ImageCropper';
import { createImage } from '../../utilities/utils';
import { FirstReadImageDimensionsType } from '../../types/profile';
import { ImageType } from '../../types/profile';
import { AppDispatch, RootState } from '../../store/reducers';
import { layoutStyles } from '../../theme/layout';
import { imageCropperStyles } from './styles';
import { openModal, closeMenu } from '../../store/actions/modal';

interface ProfileImageProps {
  data: ImageType | null;
  setData: React.Dispatch<React.SetStateAction<ImageType>>;
  cropWidth: number | null;
  cropHeight: number | null;
  isLoading?: boolean;
}

const ProfileImageProcessor: React.FC<ProfileImageProps> = ({
  data,
  setData,
  cropWidth,
  cropHeight,
  isLoading,
}) => {
  const classes = imageCropperStyles()
  const layoutClasses = layoutStyles()
  const [temporaryImageData, setTemporaryImageData] = useState<string | null>(null);
  const [firstReadImageDimensions, setFirstReadImageDimensions] = useState<FirstReadImageDimensionsType>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isImageCropperModalOpen = openModalName === 'profileImage';

  const closeProfileImageCropper = () => {
    dispatch(closeMenu())
  }  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png') {
        dispatch(setNotification({ message: 'Only JPG and PNG images are supported.', type: 'error', horizontal: 'right', vertical: 'top' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const tempData = e.target?.result as string;
        setTemporaryImageData(tempData);
  
        if (cropWidth && cropHeight) {
          const imageRes = await createImage(tempData);
          setFirstReadImageDimensions({ width: imageRes.width, height: imageRes.height })
        }
        
        dispatch(openModal('profileImage'))
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setData({
      url: null,
      blob: null,
      base64: null
    });
  }

  if (isLoading) {
    if (data && data.url) {
      return <img src={data.url} alt="Profile" style={{width: '100%', height: 'auto', maxWidth: cropWidth || 'initial' }} />
    }
    return <div>Loading...</div>
  }

  return (
    <Box>
      {data && data.url ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={2}
        >
          <Box className={classes.currentImageContainer}>
            <img
              src={data.url}
              alt="Profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                maxWidth: cropWidth || 'initial'
              }}
            />
            <IconButton
              className={classes.delButtonContainer}
              onClick={handleRemoveImage}
              color="secondary"
            >
              <HighlightOffIcon />
            </IconButton>
          </Box>
          <Box mt={2} width="100%">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Change Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={2}
        >
          <Box onClick={() => fileInputRef.current?.click()}>
            <img src="/assets/images/profileImagePlaceholder.svg" alt="Profile placeholder" />
          </Box>
          <Box mt={2} width="100%">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      )}

      <Drawer
        anchor="bottom"
        open={isImageCropperModalOpen}
        onClose={() => dispatch(closeMenu())}
        PaperProps={{
          className: layoutClasses.radiusBottomDrawer
        }}
      >
        <Box mt={2}>
          <ImageCropper
            selectedImage={temporaryImageData!}
            desiredWidth={cropWidth}
            desiredHeight={cropHeight}
            firstReadImageDimensions={firstReadImageDimensions}
            onCropComplete={(croppedImage) => {
              setData({
                url: croppedImage.croppedImageUrl,
                blob: croppedImage.croppedBlob,
                base64: croppedImage.base64
              });
              closeProfileImageCropper();
            }}
          />
        </Box>
        <IconButton
          aria-label="delete"
          color="primary"
          className={layoutClasses.drawerCloseButton}
          onClick={() => dispatch(closeMenu())}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Box>
  );
}

export default React.memo(ProfileImageProcessor);

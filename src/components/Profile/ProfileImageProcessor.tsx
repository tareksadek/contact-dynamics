import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Drawer } from '@mui/material';
import { setNotification } from '../../store/actions/notificationCenter';
import ImageCropper from './ImageCropper';
import { createImage } from '../../utilities/utils';
import { FirstReadImageDimensionsType } from '../../types/profile';
import { ImageType } from '../../types/profile';
import { AppDispatch } from '../../store/reducers';

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
  const [profileImageCropperOpen, setProfileImageCropperOpen] = useState(false);
  const [temporaryImageData, setTemporaryImageData] = useState<string | null>(null);
  const [firstReadImageDimensions, setFirstReadImageDimensions] = useState<FirstReadImageDimensionsType>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const closeProfileImageCropper = () => {
    setProfileImageCropperOpen(false);
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
        
        setProfileImageCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    if (data && data.url) {
      return <img src={data.url} alt="Profile" style={{width: '100%', height: 'auto', maxWidth: cropWidth || 'initial' }} />
    }
    return <div>Loading...</div>
  }

  return (
    <div>
      {data && data.url ? (
        <>
          <img src={data.url} alt="Profile" style={{width: '100%', height: 'auto', maxWidth: cropWidth || 'initial' }} />
          <Button onClick={() => fileInputRef.current?.click()}>Change Image</Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </>
      ) : (
        <>
          <Button onClick={() => fileInputRef.current?.click()}>Upload and Crop Image</Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </>
      )}

      <Drawer anchor="bottom" open={profileImageCropperOpen} onClose={closeProfileImageCropper}>
        <div style={{ height: '80vh' }}>
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
        </div>
      </Drawer>
    </div>
  );
}

export default React.memo(ProfileImageProcessor);

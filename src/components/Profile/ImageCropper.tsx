import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedAndCompressedImg } from '../../utilities/utils';
import { CroppedArea } from '../../types/profile';

interface ImageCropperProps {
  selectedImage: string;
  firstReadImageDimensions: {
    width: number,
    height: number
  } | null;
  desiredWidth: number | null;
  desiredHeight: number | null;
  onCropComplete: (croppedImage: { croppedImageUrl: string, croppedBlob: Blob, base64: string }) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  selectedImage,
  firstReadImageDimensions,
  onCropComplete,
  desiredWidth,
  desiredHeight,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: CroppedArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirmCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedAndCompressedImg(selectedImage, croppedAreaPixels, desiredWidth ?? undefined, desiredHeight ?? undefined);
      onCropComplete(croppedImage);
    }
  };

  const aspectRatio = desiredWidth && desiredHeight ? desiredWidth / desiredHeight : 1;

  return (
    <>
      <div style={{ width: desiredWidth || '100%', height: desiredHeight || 'auto' }}>
        {(desiredWidth && desiredHeight) && firstReadImageDimensions && (firstReadImageDimensions.width < desiredWidth || firstReadImageDimensions.height < desiredHeight) && (
          <div>
            The uploaded image is too small and may not look good when resized. Please consider using a larger image.
          </div>
        )}
        
        <Cropper
          image={selectedImage}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          style= {{
            containerStyle: {
              maxWidth: desiredWidth || '100%',
              maxHeight: desiredHeight || 'auto',
              margin: 'auto',
            }
          }}
        />
      </div>
      <button onClick={handleConfirmCrop}>Confirm Crop</button>
    </>
  );
};

export default ImageCropper;


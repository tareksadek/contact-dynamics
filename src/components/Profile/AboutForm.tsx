import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, TextField, CircularProgress } from '@mui/material';
import { Controller } from 'react-hook-form';
import ReactPlayer from 'react-player';
import { isValidVideoUrl } from '../../utilities/utils';
import validator from 'validator';
import { AboutFormDataTypes } from '../../types/profile';
import { UserType } from '../../types/user';
import { RootState } from '../../store/reducers';

interface AboutProps {
  formStatedata: AboutFormDataTypes | null;
  control: any;
  register: any;
  loadingData: boolean;
  setValue: any;
  errors: any;
  defaultData: any;
  currentUser: UserType | null;
  currentVideo?: string | null;
}

const AboutForm: React.FC<AboutProps> = ({
  formStatedata,
  loadingData,
  control,
  register,
  setValue,
  errors,
  defaultData,
  currentUser,
  currentVideo,
}) => {
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const [videoUrl, setVideoUrl] = useState(formStatedata?.videoUrl || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleVideoUrlChange = (url: string, field?: any) => {
    setVideoUrl(url);

    if (field) {
        field.onChange(url);
    }

    if (!validator.isURL(url)) {
        setFeedback('Invalid URL format.');
        return;
    }

    if (!isValidVideoUrl(url)) {
        setFeedback('We only support YouTube, Vimeo, Facebook, Sound Cloud, Streamable, Twitch, Daily Motion and Mix Cloud.');
        return;
    }

    setFeedback(null);
  };

  useEffect(() => {
    if (currentVideo) {
      handleVideoUrlChange(currentVideo)
    }
  }, [currentVideo]);

  return (
    <div>
      {appSetup && appSetup.aboutData && !appSetup.aboutData.about && (
        <div>
          <Typography variant="h5" gutterBottom>About</Typography>

          <Controller
            name="about"
            control={control}
            defaultValue={formStatedata?.about || ''}
            rules={{ maxLength: 500 }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                margin="normal"
                fullWidth
                label="About"
                multiline
                rows={6}
                InputProps={{
                  endAdornment: loadingData ? <CircularProgress size={20} /> : null
                }}
                helperText={`${field.value.length}/500`}
                error={Boolean(errors.about)}
              />
            )}
          />

          <Typography color="error">
            {errors.about && "Your biography must not exceed 500 characters."}
          </Typography>
        </div>
      )}

      {appSetup && appSetup.aboutData && !appSetup.aboutData.videoUrl && (
        <div>
          <Typography variant="h5" gutterBottom>Video</Typography>

          <Controller
            name="videoUrl"
            control={control}
            defaultValue={formStatedata?.videoUrl || ''}
            render={({ field }) => (
              <TextField
                {...field}
                value={videoUrl}
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  endAdornment: loadingData ? <CircularProgress size={20} /> : null
                }}
                label="Video URL"
                onChange={(e) => handleVideoUrlChange(e.target.value, field)}
              />
            )}
          />


          {isValidVideoUrl(videoUrl) && <ReactPlayer url={videoUrl} width="100%" />}
          {feedback && <Typography color="error">{feedback}</Typography>}

        </div>
      )}
    </div>
  );
}

export default AboutForm;

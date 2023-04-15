import { useState, useEffect, useRef } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import LandscapeIcon from '@mui/icons-material/Landscape';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

interface ImageUploadProps {
  width?: string | number;
  height?: string | number;
  onImage: (image: File | null) => void;
  value: File | null;
}

export default function ImageUpload({ width, height, onImage, value }: ImageUploadProps) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!value) {
      setImageURL(null);
    } else {
      setImageURL(URL.createObjectURL(value));
    }
  }, [value]);

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredImage = event.target.files;
    if (!enteredImage || enteredImage.length === 0) return;
    onImage(enteredImage[0])
  };

  const imageDeleteHandler = () => {
    onImage(null);
    setImageURL(null);
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
    >
      <Button
        component="label"
        sx={{
          width: width || 200,
          height: height || 200,
          position: 'relative',
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {imageURL ? (
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                zIndex: 1,
                position: 'relative',
                width: width || 200,
                height: height || 200,
                background: '#ccc',
                color: '#000',
                borderRadius: theme.shape,
                transition: 'all 0.5s ease',
                '&: hover': {
                  opacity: 0.9,
                }
              }}
            >
              <LandscapeIcon fontSize="large" />
              ChANGE IMAGE
            </Box>
            <Image
              src={imageURL}
              alt="entered image"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LandscapeIcon fontSize="large" />
            UPLOAD IMAGE
          </Box>
        )}
        <input
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={imageChangeHandler}
        />
      </Button>
      {imageURL && (
        <Button onClick={imageDeleteHandler}>
          <DeleteIcon /> Delete image
        </Button>
      )}
    </Box>
  );
}

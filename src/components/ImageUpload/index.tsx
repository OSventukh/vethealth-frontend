import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { imageUploadAction } from '@/actions/image-upload.action';

interface ImageUploadProps {
  width?: string | number;
  height?: string | number;
  onImage: (image: { id: string; path: string } | null) => void;
  value: File | null | string;
  uploadAction: typeof imageUploadAction;
}

export default function ImageUpload({
  onImage,
  value,
  uploadAction,
}: ImageUploadProps) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!value) {
      setImageURL(null);
    } else {
      setImageURL(`${value}#${new Date().getTime().toString()}`);
    }
  }, [value]);

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredImage = event.target.files;
    if (!enteredImage || enteredImage.length === 0) return;
    const formData = new FormData();
    formData.append('topic', enteredImage[0]);

    startTransition(async () => {
      const response = await uploadAction(formData);
      if (response.image) {
        setImageURL(response.image.path);
        onImage(response.image);
      }
    });
  };

  const imageDeleteHandler = () => {
    onImage(null);
    setImageURL(null);
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <label>
        {imageURL ? (
          <div className="group flex relative justify-center items-center cursor-pointer w-[200px] aspect-square rounded-md overflow-hidden">
            <div className="absolute flex justify-center items-center invisible group-hover:visible z-10 w-full h-full bg-slate-500 bg-opacity-50">
              <ImageIcon />
              CHANGE IMAGE
            </div>
            <Image
              src={imageURL}
              unoptimized
              alt="preview"
              priority
              fill
              sizes="100%"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div className="flex justify-center flex-col items-center w-[200px] aspect-square cursor-pointer rounded-md overflow-hidden">
            <ImageIcon
              fontSize="large"
              size={200}
              // strokeWidth={1}
              absoluteStrokeWidth
            />
            <span className="uppercase text-center">Завантажити картинку</span>
          </div>
        )}
        <input
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={imageChangeHandler}
        />
      </label>
      {imageURL && (
        <Button type="button" onClick={imageDeleteHandler}>
          <Trash2 /> Delete image
        </Button>
      )}
    </div>
  );
}

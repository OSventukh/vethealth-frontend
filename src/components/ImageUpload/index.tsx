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
  field: 'topic' | 'post-featured';
}

export default function ImageUpload({
  onImage,
  value,
  uploadAction,
  field,
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
    formData.append(field, enteredImage[0]);

    startTransition(async () => {
      const response = await uploadAction(formData, field);
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
    <div className="flex flex-col items-center justify-center gap-2">
      <label>
        {imageURL ? (
          <div className="group relative flex aspect-square w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-md">
            <div className="invisible absolute z-10 flex h-full w-full items-center justify-center bg-slate-500/50 uppercase group-hover:visible">
              <ImageIcon />
              Змінити
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
          <div className="flex aspect-square w-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md">
            <ImageIcon fontSize="large" size={200} absoluteStrokeWidth />
            <span className="text-center uppercase">Завантажити картинку</span>
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
        <Button
          type="button"
          variant="destructive"
          onClick={imageDeleteHandler}
        >
          <Trash2 /> Видалити картинку
        </Button>
      )}
    </div>
  );
}

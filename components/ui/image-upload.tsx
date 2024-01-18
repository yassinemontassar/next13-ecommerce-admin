"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import axios from 'axios'; // Import axios

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    console.log('Public ID:', result.info.public_id);
    setUploadResult(result); // Save the result in state
    onChange(result.info.secure_url);
  };


  const extractPublicIdFromUrl = (url: string) => {
    // Assuming Cloudinary URLs are in the format: https://res.cloudinary.com/{cloudName}/image/upload/{version}/{publicId}.{format}
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex !== -1 && uploadIndex < parts.length - 2) {
      return parts[uploadIndex + 2].split('.')[0];
    }
  
    return null;
  };
  const removeFromCloudinary = async (url: string) => {
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) {
      const apiUrl = `/api/cloudinary/${publicId}`;
      try {
        const response = await axios.delete(apiUrl);
  
        if (response.status === 200) {
          console.log('Image removed successfully');
          onRemove(url); // Call onRemove with the publicId
        } else {
          console.error('Failed to remove image');
        }
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => removeFromCloudinary(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="qqit6vwa">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

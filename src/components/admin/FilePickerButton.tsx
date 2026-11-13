import React from 'react';

/** Overlay file input — iPhone Safari ignores .click() on display:none inputs. */
export const PHOTO_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/*,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif';

export const VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime,video/*,.mp4,.mov,.webm,.m4v';
export const AUDIO_ACCEPT = 'audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/aac,audio/*,.mp3,.m4a,.wav,.aac';
export const MEDIA_ACCEPT = `${PHOTO_ACCEPT},${VIDEO_ACCEPT},${AUDIO_ACCEPT}`;

interface FilePickerButtonProps {
  accept: string;
  multiple?: boolean;
  capture?: 'user' | 'environment';
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  children: React.ReactNode;
}

export const FilePickerButton: React.FC<FilePickerButtonProps> = ({
  accept,
  multiple,
  capture,
  disabled,
  onChange,
  className,
  children,
}) => (
  <label
    className={`relative flex min-h-11 w-full cursor-pointer items-center justify-center ${
      disabled ? 'pointer-events-none opacity-60' : ''
    } ${className || ''}`}
  >
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      capture={capture}
      disabled={disabled}
      onChange={onChange}
      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
    />
    {children}
  </label>
);

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@osventukh/ckeditor5-custom-build-balloon-block-version';

interface EditorCoreProps {
  data?: string;
  onChange: (event: Event, editor: any) => void;
  onBlur?: (event: Event, editor: any) => void;
  onFocus?: (event: Event, editor: any) => void;
  onReady?: (editor: any) => void;
}

export default function EditorCore({
  data,
  onChange,
  onBlur,
  onFocus,
  onReady,
}: EditorCoreProps) {
  return (
    <CKEditor
      editor={BalloonBlockEditor}
      config={{
        simpleUpload: {
          uploadUrl: 'http://localhost:5000/posts/upload-image',
          withCredentials: true,
          headers: {
            Authorization: 'Bearer <JSON Web Token>',
          },
        },
      }}
      data={data ?? data}
      onReady={onReady}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}

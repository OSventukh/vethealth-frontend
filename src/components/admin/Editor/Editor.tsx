import { useRef, ChangeEvent } from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react/';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';

interface EditorCoreProps {
  title?: string;
  content?: string;
  onContentChange: (value: string, editor: any) => void;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function RichEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
}: EditorCoreProps) {
  const editorRef = useRef<any>(null);

  const handleImageUpload: any = (blobInfo: any) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('upload', blobInfo.blob(), blobInfo.filename());

      return fetch('http://localhost:5000/posts/upload-image', {
        method: 'POST',
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('HTTP Error: ' + response.status);
          }
          return response.json();
        })
        .then((json) => {
          if (!json || typeof json.location !== 'string') {
            throw new Error('Invalid JSON: ' + JSON.stringify(json));
          }
          resolve(json.location);
        })
        .catch((error) => {
          reject({ message: error.message });
        });
    });
  };

  return (
    <Box>
      <input
        id="editor-title"
        placeholder="Title"
        value={title}
        onInput={onTitleChange}
        style={{
          width: '100%',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '2rem',
          background: 'transparent',
          color: 'inherit',
          borderRadius: '5px',
        }}
      />
      <Divider />
      <TinyEditor
        onInit={(evt, editor) => (editorRef.current = editor)}
        id="editor-content"
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={content}
        onEditorChange={onContentChange}
        init={{
          images_upload_handler: handleImageUpload,
          content_css: 'dark',
          inline: true,
          skin: 'oxide-dark',
          image_dimensions: false,
          image_title: true,
          image_caption: true,
          height: 500,
          menubar: false,
          placeholder: 'Type your content...',
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
            'code',
            'quickbars',
            'pagebreak',
          ],
          pagebreak_separator: '<!-- read more -->',
          pagebreak_split_block: true,
          toolbar: false,
          quickbars_insert_toolbar: 'quicktable image media codesample | numlist bullist | pagebreak',
          quickbars_selection_toolbar:
            'bold italic underline | align | blocks | blockquote quicklink',
          contextmenu:
            'undo redo | inserttable | cell row column deletetable | code | help',
          content_style: `.mce-content-body {
            min-height: 20rem;
            padding: 0.5rem 2rem;
            font-size: 1.5rem;
            border-radius: 5px;
          }
          
          .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
            padding: 1.5rem 2rem;
            line-height: 1rem;
            font-size: 1.5rem;
          }`,
        }}
      ></TinyEditor>
    </Box>
  );
}

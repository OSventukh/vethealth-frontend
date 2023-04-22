import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import EditorToolbar from './EditorToolbar';
import EditorCore from './Editor';
import styles from './editor.module.css';
import type { EditorProps } from '@/types/editor-types';

export default function Editor({ onSave, initValue }: EditorProps) {
  const [content, setContent] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [topics, setTopics] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);

  const saveHandler = () => {
    onSave({ content, slug, categories, topics, status: 'published' });
  };

  const saveDraftHandler = () => {
    onSave({ content, slug, categories, topics, status: 'draft' });
  };

  return (
    <Box
      className={styles.editor}
      component="div"
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <EditorToolbar
        onSave={saveHandler}
        onSaveDraft={saveDraftHandler}
        onCategories={setCategories}
        onTopics={setTopics}
        onSlug={setSlug}
        initTopics={initValue?.topics || topics }
        initCategories={initValue?.categories || categories }
        initSlug={initValue?.slug || slug }
      />
      <Paper>
        <EditorCore
          onChange={(event: Event, editor: any) => {
            const data = editor.getData();
            setContent(data);
          }}
          data={initValue?.content || content }
        />
      </Paper>
    </Box>
  );
}

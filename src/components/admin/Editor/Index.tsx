import { Box, Paper } from '@mui/material';
import EditorToolbar from './EditorToolbar';
import EditorCore from './Editor';
import styles from './editor.module.css';
import type { EditorProps } from '@/types/editor-types';
export default function Editor({
  onSave,
  content,
  slug,
  categories,
  topics,
  contentChangeHandler,
  slugChangeHandler,
  categoriesChangeHandler,
  topicsChangeHandler,
}: EditorProps) {

  const saveHandler = () => {
    const status = 'published';
    onSave(status);
  };

  const saveDraftHandler = () => {
    const status = 'draft';
    onSave(status);
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
        onCategories={categoriesChangeHandler}
        onTopics={topicsChangeHandler}
        onSlug={slugChangeHandler}
        initTopics={topics}
        initCategories={categories}
        initSlug={slug}
      />
      <Paper>
        <EditorCore
          onChange={(event: Event, editor: any) => {
            const data = editor.getData();
            contentChangeHandler(data);
          }}
          data={content}
        />
      </Paper>
    </Box>
  );
}

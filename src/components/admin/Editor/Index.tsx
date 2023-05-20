import { Box, Paper } from '@mui/material';
import EditorToolbar from './EditorToolbar';
import RichEditor from './Editor';
import type { EditorProps } from '@/types/editor-types';

export default function Editor({
  onSave,
  content,
  title,
  slug,
  categories,
  topics,
  titleChangeHandler,
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
        <RichEditor
          content={content}
          title={title}
          onTitleChange={titleChangeHandler}
          onContentChange={contentChangeHandler}
        />
      </Paper>
    </Box>
  );
}

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
  topic,
  parentPage,
  titleChangeHandler,
  contentChangeHandler,
  slugChangeHandler,
  categoriesChangeHandler,
  topicsChangeHandler,
  topicChangeHandler,
  parentPageChangeHandler,
  isPage,
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
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <EditorToolbar
        onSave={saveHandler}
        onSaveDraft={saveDraftHandler}
        onCategories={categoriesChangeHandler}
        onTopics={topicsChangeHandler}
        onTopic={topicChangeHandler}
        onSlug={slugChangeHandler}
        onParentPages={parentPageChangeHandler}
        initTopics={topics}
        initTopic={topic}
        initParentPage={parentPage}
        initCategories={categories}
        initSlug={slug}
        isPage={isPage}
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

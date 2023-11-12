'use client';
import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { editorInitialConfig } from './config';

export default function Editor() {
  return (
    <div className="relative w-full h-full">
      <LexicalComposer initialConfig={editorInitialConfig}>
        <ToolbarPlugin setIsLinkEditMode={() => true} />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={
            <div className="absolute top-[5rem] left-4">Введіть текст...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        {/* <CharacterLimitPlugin /> */}
        <CheckListPlugin />
        <LexicalClickableLinkPlugin />
        <HorizontalRulePlugin />
        <ListPlugin />
        <TablePlugin />
        <OnChangePlugin onChange={(state) => console.log(state)} />
      </LexicalComposer>
    </div>
  );
}

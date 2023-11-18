'use client';
import { Dispatch, SetStateAction, useState } from 'react';

import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { editorInitialConfig } from './config';
import ImagesPlugin from './plugins/ImagesPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';

type Props = {
  setTitle: Dispatch<SetStateAction<string | undefined>>;
  setContent: Dispatch<SetStateAction<string | undefined>>;
  initialTitle?: string;
  initialContent?: InitialEditorStateType;
};

export default function Lexical({
  setTitle,
  setContent,
  initialContent,
  initialTitle,
}: Props) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(true);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative h-[calc(100dvh-7rem)] md:h-[calc(100dvh-10rem)] overflow-auto w-full max-w-screen-lg flex flex-col gap-2">
      <LexicalComposer
        initialConfig={{
          ...editorInitialConfig,
          editorState: initialContent,
        }}
      >
        <>
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />

          {floatingAnchorElem && (
            <>
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            </>
          )}

          <ImagesPlugin />

          <RichTextPlugin
            contentEditable={
              <div
                className="flex-auto mt-2 gap-1 relative resize-y"
                ref={onRef}
              >
                <input
                  type="text"
                  placeholder="Заголовок"
                  className="w-full px-5 -z-10 py-2 md:px-10 md:py-4 border-[1px] border-border outline-0 rounded-t-2xl bg-background text-2xl placeholder:text-slate-500"
                  onChange={(event) => setTitle(event.target.value)}
                  value={initialTitle}
                />
                <ContentEditable />
              </div>
            }
            placeholder={
              <div className="absolute inline-block top-[9rem] text-lg text-slate-500 left-10">
                <p>Введіть текст...</p>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          {/* <CharacterLimitPlugin /> */}
          <CheckListPlugin />
          <LexicalClickableLinkPlugin />
          <HorizontalRulePlugin />
          <FloatingTextFormatToolbarPlugin />
          <LayoutPlugin />
          <ListPlugin />
          <TablePlugin />
          <LinkPlugin />
          <LexicalClickableLinkPlugin />
          <OnChangePlugin
            onChange={(state) => {
              const stringifiedContent = JSON.stringify(state);
              setContent(stringifiedContent);
            }}
          />
        </>
      </LexicalComposer>
    </div>
  );
}

'use client';
import { useState } from 'react';

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
  onChangeTitle?: (title: string) => void;
  onChangeContent?: (content: string) => void;
  initialTitle?: string | undefined;
  initialContent?: InitialEditorStateType | undefined;
};

export default function Lexical({
  onChangeTitle,
  onChangeContent,
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
    <div className="relative flex h-[calc(100dvh-7rem)] w-full max-w-screen-lg flex-col gap-2 overflow-auto md:h-[calc(100dvh-10rem)]">
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
                className="relative mt-2 flex-auto resize-y gap-1 prose max-w-none"
                ref={onRef}
              >
                <input
                  type="text"
                  placeholder="Заголовок"
                  className="-z-10 w-full rounded-t-2xl border-[1px] border-border bg-background px-5 py-2 text-2xl outline-0 placeholder:text-slate-500 md:px-10 md:py-4"
                  onChange={(event) =>
                    onChangeTitle && onChangeTitle(event.target.value)
                  }
                  value={initialTitle}
                />
                <ContentEditable />
              </div>
            }
            placeholder={
              <div className="absolute left-10 top-[9rem] inline-block text-lg text-slate-500">
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
              onChangeContent && onChangeContent(stringifiedContent);
            }}
          />
        </>
      </LexicalComposer>
    </div>
  );
}

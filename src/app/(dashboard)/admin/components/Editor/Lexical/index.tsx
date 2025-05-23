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
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { editorInitialConfig } from './config';
import ImagesPlugin from './plugins/ImagesPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import { cn } from '@/lib/utils';

type Props = {
  onChangeTitle?: (title: string) => void;
  onChangeContent?: (content: string) => void;
  initialTitle?: string | undefined;
  initialContent?: InitialEditorStateType | undefined;
  className?: string;
};

export default function Lexical({
  onChangeTitle,
  onChangeContent,
  initialContent,
  initialTitle,
  className,
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
    <div
      className={cn(
        'relative flex h-[calc(100dvh-10rem)] w-full max-w-(--breakpoint-lg) flex-col gap-2 overflow-auto md:h-[calc(100dvh-8rem)]',
        className
      )}
    >
      <LexicalComposer
        initialConfig={{
          ...editorInitialConfig,
          editorState: initialContent,
        }}
      >
        <>
          <input
            type="text"
            placeholder="Заголовок"
            className="border-border bg-background w-full rounded-2xl border-[1px] px-5 py-2 text-2xl outline-0 placeholder:text-slate-500 md:px-10 md:py-4"
            onChange={(event) =>
              onChangeTitle && onChangeTitle(event.target.value)
            }
            value={initialTitle}
          />
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
              <>
                <div
                  className="prose border-border bg-background relative mt-2 h-full max-w-none resize-y gap-1 overflow-hidden rounded-2xl border-[1px] text-slate-900 md:h-[calc(100%_-_75px)]"
                  ref={onRef}
                >
                  <div className="relative h-full overflow-auto">
                    <ContentEditable />
                  </div>
                </div>
              </>
            }
            placeholder={
              <div className="absolute top-[10.7rem] left-10 inline-block text-lg text-slate-500">
                <p>Введіть текст...</p>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          {/* <CharacterLimitPlugin /> */}
          <CheckListPlugin />
          <ClickableLinkPlugin />
          <HorizontalRulePlugin />
          <FloatingTextFormatToolbarPlugin />
          <LayoutPlugin />
          <ListPlugin />
          <TablePlugin />
          <LinkPlugin />
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

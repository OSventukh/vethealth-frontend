/* eslint-disable @typescript-eslint/no-unused-vars */
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createHeadingNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $isParentElementRTL, $setBlocksType } from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from 'lexical';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CaseSensitive,
  ChevronDown,
  Grid2X2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Plus,
  Quote,
  Redo,
  RemoveFormatting,
  Rows,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline,
  Undo,
} from 'lucide-react';
import * as React from 'react';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { IS_APPLE } from '../../utils/environment';
// import { $createStickyNode } from '../../nodes/StickyNode';

import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
// import { EmbedConfigs } from '../AutoEmbedPlugin';
// import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
// import { InsertEquationDialog } from '../EquationsPlugin';
// import { INSERT_EXCALIDRAW_COMMAND } from '../ExcalidrawPlugin';
import { InsertImageDialog } from '../ImagesPlugin';
// import { InsertInlineImageDialog } from '../InlineImagePlugin';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
// import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
// import { InsertPollDialog } from '../PollPlugin';
// import { InsertNewTableDialog, InsertTableDialog } from '../TablePlugin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

import clsx from 'clsx';
import useModal from '../../hooks/useModal';
import ItemButton from '../../ui/ItemButton';

export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const toolbarButtonClass: React.ComponentProps<'div'>['className'] =
  'flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-blue-200 hover:shadow-lg';

const blockTypes = {
  bullet: { title: 'Невпорядкований список', icon: <List /> },
  check: { title: 'Check List', icon: <ListChecks /> },
  h1: { title: 'Заголовок 1', icon: <Heading1 /> },
  h2: { title: 'Заголовок 2', icon: <Heading2 /> },
  h3: { title: 'Заголовок 3', icon: <Heading3 /> },
  number: { title: 'Впорядкоаний список', icon: <ListOrdered /> },
  paragraph: { title: 'Текст', icon: <Type /> },
  quote: { title: 'Цитата', icon: <Quote /> },
};

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: React.ReactElement;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: <AlignCenter />,
    iconRTL: 'right-align',
    name: 'По центру',
  },
  right: {
    icon: <AlignRight />,
    iconRTL: 'left-align',
    name: 'Праворуч',
  },
  justify: {
    icon: <AlignJustify />,
    iconRTL: 'justify-align',
    name: 'По ширині',
  },
  left: {
    icon: <AlignLeft />,
    iconRTL: 'left-align',
    name: 'Ліворуч',
  },
  end: { icon: <></>, iconRTL: '', name: '' },
  start: {
    icon: <></>,
    iconRTL: '',
    name: '',
  },
};

function dropDownActiveClass(active: boolean) {
  if (active) return 'bg-blue-200 rounded-sm';
  else return '';
}

function BlockFormatDropDown({
  editor,
  blockType, // rootType,
}: {
  blockType: keyof typeof blockTypes;
  // rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): React.ReactElement {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={toolbarButtonClass}>
        {blockTypes[blockType].icon} {blockTypes[blockType].title}
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
        >
          <ItemButton
            onClick={formatParagraph}
            icon={blockTypes.paragraph.icon}
          >
            {blockTypes.paragraph.title}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={'item ' + dropDownActiveClass(blockType === 'h1')}
        >
          <ItemButton
            onClick={() => formatHeading('h1')}
            icon={blockTypes.h1.icon}
          >
            {blockTypes.h1.title}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={'item ' + dropDownActiveClass(blockType === 'h2')}
        >
          <ItemButton
            onClick={() => formatHeading('h2')}
            icon={blockTypes.h2.icon}
          >
            {blockTypes.h2.title}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={'item ' + dropDownActiveClass(blockType === 'h3')}
        >
          <ItemButton
            onClick={() => formatHeading('h3')}
            icon={blockTypes.h3.icon}
          >
            {blockTypes.h3.title}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={'item ' + dropDownActiveClass(blockType === 'bullet')}
        >
          <ItemButton onClick={formatBulletList} icon={blockTypes.bullet.icon}>
            {blockTypes.bullet.title}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={'item ' + dropDownActiveClass(blockType === 'number')}
        >
          <ItemButton
            onClick={formatNumberedList}
            icon={blockTypes.number.icon}
          >
            {blockTypes.number.title}
          </ItemButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Divider(): React.ReactElement {
  return <div className="divider" />;
}

function ElementFormatDropdown({
  editor,
  value,
}: {
  editor: LexicalEditor;
  value: Exclude<ElementFormatType, ''>;
  isRTL: boolean;
  disabled: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={toolbarButtonClass}>
        {ELEMENT_FORMAT_OPTIONS[value].icon}
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <ItemButton
            icon={ELEMENT_FORMAT_OPTIONS.left.icon}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
            }
          >
            {ELEMENT_FORMAT_OPTIONS.left.name}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ItemButton
            icon={ELEMENT_FORMAT_OPTIONS.center.icon}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
            }
          >
            {ELEMENT_FORMAT_OPTIONS.center.name}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ItemButton
            icon={ELEMENT_FORMAT_OPTIONS.right.icon}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
            }
          >
            {ELEMENT_FORMAT_OPTIONS.right.name}
          </ItemButton>
        </DropdownMenuItem>
        <DropdownMenuItem></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>;
}): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypes>('paragraph');
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [elementFormat, setElementFormat] =
    useState<Exclude<ElementFormatType, ''>>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [modal, showModal] = useModal();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypes) {
            setBlockType(type as keyof typeof blockTypes);
          }
        }
      }
      // Handle buttons
      setElementFormat(
        ($isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType()) || 'left'
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          if (!isLink) {
            setIsLinkEditMode(true);
          } else {
            setIsLinkEditMode(false);
          }
          return activeEditor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl('https://')
          );
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            if (idx === 0 && anchor.offset !== 0) {
              node = node.splitText(anchor.offset)[1] || node;
            }
            if (idx === nodes.length - 1) {
              node = (node as TextNode).splitText(focus.offset)[0] || node;
            }

            if ((node as TextNode).__style !== '') {
              (node as TextNode).setStyle('');
            }
            if ((node as TextNode).__format !== 0) {
              (node as TextNode).setFormat(0);
              $getNearestBlockElementAncestorOrThrow(node).setFormat('');
            }
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="z-20 mt-2 flex min-h-[3rem] touch-auto gap-1 overflow-y-auto rounded-2xl border-[1px] border-border bg-slate-100 p-1 align-middle shadow-sm md:overflow-x-auto md:overflow-y-hidden">
      <button
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type="button"
        className={toolbarButtonClass}
        aria-label="Undo"
      >
        <Undo />
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
        type="button"
        className={toolbarButtonClass}
        aria-label="Redo"
      >
        <Redo />
      </button>
      <Divider />

      <>
        <BlockFormatDropDown editor={editor} blockType={blockType} />
      </>
      <>
        <Divider />
        <button
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
          className={clsx(toolbarButtonClass, { 'bg-blue-200': isBold })}
          title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
          type="button"
          aria-label={`Format text as bold. Shortcut: ${
            IS_APPLE ? '⌘B' : 'Ctrl+B'
          }`}
        >
          <Bold />
        </button>
        <button
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
          className={clsx(toolbarButtonClass, { 'bg-blue-200': isItalic })}
          title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
          type="button"
          aria-label={`Format text as italics. Shortcut: ${
            IS_APPLE ? '⌘I' : 'Ctrl+I'
          }`}
        >
          <Italic />
        </button>
        <button
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
          className={clsx(toolbarButtonClass, { 'bg-blue-200': isUnderline })}
          title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
          type="button"
          aria-label={`Format text to underlined. Shortcut: ${
            IS_APPLE ? '⌘U' : 'Ctrl+U'
          }`}
        >
          <Underline />
        </button>
        <button
          disabled={!isEditable}
          onClick={insertLink}
          className={clsx(toolbarButtonClass, { 'bg-blue-200': isLink })}
          aria-label="Insert link"
          title="Insert link"
          type="button"
        >
          <Link />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className={toolbarButtonClass}>
            <CaseSensitive />
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className={'item ' + dropDownActiveClass(isStrikethrough)}
              title="Strikethrough"
              aria-label="Format text with a strikethrough"
            >
              <ItemButton
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'strikethrough'
                  );
                }}
                icon={<Strikethrough />}
              >
                Strikethrough
              </ItemButton>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'item ' + dropDownActiveClass(isSubscript)}
              title="Subscript"
              aria-label="Format text with a subscript"
            >
              <ItemButton
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'subscript'
                  );
                }}
                icon={<Subscript />}
              >
                Subscript
              </ItemButton>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'item ' + dropDownActiveClass(isSuperscript)}
              title="Superscript"
              aria-label="Format text with a superscript"
            >
              <ItemButton
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'superscript'
                  );
                }}
                icon={<Superscript />}
              >
                Superscript
              </ItemButton>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="item"
              title="Clear text formatting"
              aria-label="Clear all text formatting"
            >
              <ItemButton onClick={clearFormatting} icon={<RemoveFormatting />}>
                Clear Formatting
              </ItemButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Divider />
        <DropdownMenu>
          <DropdownMenuTrigger className={toolbarButtonClass}>
            <Plus />
            Вставити
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ItemButton
                icon={<Rows />}
                onClick={() => {
                  activeEditor.dispatchCommand(
                    INSERT_HORIZONTAL_RULE_COMMAND,
                    undefined
                  );
                }}
              >
                Горизонтальна лінія
              </ItemButton>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => {
                activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
              }}
              className="item"
            >
              <i className="icon page-break" />
              <span className="text">Page Break</span>
            </DropdownMenuItem> */}

            <DropdownMenuItem>
              <ItemButton
                icon={<ImageIcon />}
                onClick={() => {
                  showModal('Вставити картинку', (onClose) => (
                    <InsertImageDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
              >
                Вставити картинку
              </ItemButton>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <ItemButton
                icon={<Grid2X2 />}
                onClick={() => {
                  showModal('Вставити колонки', (onClose) => (
                    <InsertLayoutDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
              >
                Колонки
              </ItemButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>

      <Divider />
      <ElementFormatDropdown
        disabled={!isEditable}
        value={elementFormat}
        editor={editor}
        isRTL={isRTL}
      />
      {modal}
    </div>
  );
}

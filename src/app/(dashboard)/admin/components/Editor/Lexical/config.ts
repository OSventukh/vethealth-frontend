import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ImageNode } from './nodes/ImageNode';
import { LayoutContainerNode } from './nodes/LayoutContainerNode';
import { LayoutItemNode } from './nodes/LayoutItemNode';

export const editorInitialConfig: InitialConfigType = {
  namespace: 'VethealthEditor',
  theme: {
    root: 'min-h-full border-[1px] border-border px-10 py-4 bg-background shadow-sm outline-none text-lg',
    text: {
      underline: 'underline underline-offset-2',
      strikethrough: 'line-through',
      italic: 'italic',
    },
    link: 'text-blue-600 underline underline-offset-2',
    list: {
      nested: {
        listitem: 'list-inside',
      },
      ol: 'list-decimal list-inside',
      ul: 'list-disc list-inside',
      listitem: 'editor-listItem',
    },
    layoutContainer: 'grid gap-10',
    layoutItem: 'border-[1px] border-slate-600 border-dashed',
    image: 'inline-block relative',
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HorizontalRuleNode,
    ImageNode,
    LayoutContainerNode,
    LayoutItemNode,
  ],
  onError: (error: unknown) => console.log(error),
};

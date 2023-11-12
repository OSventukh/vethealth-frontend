import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

export const editorInitialConfig: InitialConfigType = {
  namespace: 'VethealthEditor',
  theme: {
    root: 'w-full border-[1px] border-border px-4 py-2 mt-2 rounded-2xl bg-background shadow-sm',
    list: {
      nested: {
        listitem: 'list-inside',
      },
      ol: 'list-decimal list-inside',
      ul: 'list-disc list-inside',
      listitem: 'editor-listItem',
    },
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
  ],
  onError: (error: unknown) => console.log(error),
};

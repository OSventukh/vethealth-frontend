'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';
import {
  TooltipNode,
  $createTooltipNode,
  $isTooltipNode,
} from '../../nodes/TooltipNode';

export default function TooltipPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TooltipNode])) {
      throw new Error('TooltipPlugin: TooltipNode not registered on editor');
    }

    // Plugin doesn't need to register commands, it just ensures the node is registered
    // The actual tooltip rendering is handled by TooltipComponent in the editor
    // and ParsedContent for rendered content
  }, [editor]);

  return null;
}

// Helper function to wrap selection in tooltip node
export function $wrapSelectionInTooltip(
  text: string,
  tooltipText: string
): void {
  const selection = $getSelection();
  if ($isRangeSelection(selection) && !selection.isCollapsed()) {
    const selectedText = selection.getTextContent();
    const tooltipNode = $createTooltipNode(
      text || selectedText,
      tooltipText,
      true // isInline = true when wrapping selected text
    );
    selection.insertText('');
    selection.insertNodes([tooltipNode]);
  }
}

// Helper function to check if node is tooltip node
export { $isTooltipNode };

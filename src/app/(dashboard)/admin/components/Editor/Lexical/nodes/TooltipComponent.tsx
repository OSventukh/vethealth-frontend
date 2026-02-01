'use client';

import * as React from 'react';
import { NodeKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { $isTooltipNode, TooltipNode } from './TooltipNode';
import { $getNodeByKey } from 'lexical';

type Props = {
  nodeKey: NodeKey;
  text: string;
  tooltipText: string;
  isInline: boolean; // true if tooltip is on selected text, false if after cursor
};

export default function TooltipComponent({
  nodeKey,
  text,
  tooltipText,
  isInline,
}: Props): React.ReactElement {
  const [editor] = useLexicalComposerContext();

  // If tooltip is inline (on selected text), show tooltip on hover over text
  // If tooltip is after text, show tooltip only on icon
  if (isInline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline cursor-help border-b border-dotted border-gray-400">
              {text}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>{tooltipText}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Tooltip after text - show only on icon
  return (
    <TooltipProvider>
      <span className="inline-flex items-center">
        {text}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-1 inline-flex cursor-help items-center">
              <Info className="h-4 w-4 text-blue-600" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>{tooltipText}</span>
          </TooltipContent>
        </Tooltip>
      </span>
    </TooltipProvider>
  );
}

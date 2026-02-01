'use client';

import { useState, useEffect, useRef } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  LexicalEditor,
} from 'lexical';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { $createTooltipNode } from '../../nodes/TooltipNode';
import { DialogButtonsList } from '../../ui/Dialog';

type Props = {
  activeEditor: LexicalEditor;
  onClose: () => void;
  initialText?: string;
};

export default function InsertTooltipDialog({
  activeEditor,
  onClose,
  initialText = '',
}: Props) {
  const [text, setText] = useState(initialText);
  const [tooltipText, setTooltipText] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update text when initialText changes
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    // Auto-focus on tooltip textarea when dialog opens with initial text
    // Otherwise focus on text input
    const timer = setTimeout(() => {
      if (initialText && initialText.trim()) {
        // If we have initial text, focus on tooltip textarea
        const tooltipTextarea = document.getElementById('tooltip') as HTMLTextAreaElement;
        if (tooltipTextarea) {
          tooltipTextarea.focus();
        }
      } else if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [initialText]);

  const handleSubmit = () => {
    if (!text.trim() || !tooltipText.trim()) {
      return;
    }

    activeEditor.update(() => {
      const selection = $getSelection();
      let isInline = false;

      // Check if we have initialText (from selected text) to determine if it's inline
      if (initialText && initialText.trim()) {
        // If we had selected text when dialog opened, it's an inline tooltip
        isInline = true;
        // If there's still a selection, replace it, otherwise insert at current position
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          selection.insertText('');
        }
        const tooltipNode = $createTooltipNode(
          text.trim() || initialText.trim(),
          tooltipText,
          isInline
        );
        $insertNodes([tooltipNode]);
      } else {
        // If no initial text, insert tooltip after cursor (tooltip with icon)
        isInline = false;
        // If there's a selection, clear it first
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          selection.insertText('');
        }
        const tooltipNode = $createTooltipNode(text.trim(), tooltipText, isInline);
        $insertNodes([tooltipNode]);
      }
    });

    onClose();
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="text">Текст</Label>
          <Input
            ref={textInputRef}
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введіть текст"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && text.trim() && tooltipText.trim()) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tooltip">Текст тултіпа</Label>
          <Textarea
            id="tooltip"
            value={tooltipText}
            onChange={(e) => setTooltipText(e.target.value)}
            placeholder="Введіть речення для тултіпа"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey && text.trim() && tooltipText.trim()) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>
      </div>
      <DialogButtonsList>
        <Button type="button" variant="outline" onClick={onClose}>
          Скасувати
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || !tooltipText.trim()}
        >
          Додати
        </Button>
      </DialogButtonsList>
    </>
  );
}

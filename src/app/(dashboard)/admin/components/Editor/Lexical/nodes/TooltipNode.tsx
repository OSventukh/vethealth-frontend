/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

const TooltipComponent = React.lazy(() => import('./TooltipComponent'));

export type SerializedTooltipNode = Spread<
  {
    text: string;
    tooltipText: string;
    isInline: boolean;
  },
  SerializedLexicalNode
>;

export class TooltipNode extends DecoratorNode<React.ReactElement> {
  __tooltipText: string;
  __text: string;
  __isInline: boolean; // true if tooltip wraps selected text, false if inserted after cursor

  static getType(): string {
    return 'tooltip';
  }

  static clone(node: TooltipNode): TooltipNode {
    return new TooltipNode(
      node.__text,
      node.__tooltipText,
      node.__isInline,
      node.__key
    );
  }

  constructor(
    text: string,
    tooltipText: string,
    isInline: boolean = true,
    key?: NodeKey
  ) {
    super(key);
    this.__text = text;
    this.__tooltipText = tooltipText;
    this.__isInline = isInline;
  }

  static importJSON(serializedNode: SerializedTooltipNode): TooltipNode {
    const node = $createTooltipNode(
      serializedNode.text,
      serializedNode.tooltipText,
      serializedNode.isInline ?? true
    );
    return node;
  }

  exportJSON(): SerializedTooltipNode {
    return {
      text: this.__text,
      tooltipText: this.__tooltipText,
      isInline: this.__isInline,
      type: 'tooltip',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.setAttribute('data-tooltip-text', this.__tooltipText);
    span.setAttribute('data-tooltip-inline', String(this.__isInline));
    span.className = 'tooltip-node';
    span.style.display = 'inline'; // Ensure it's inline
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  getText(): string {
    return this.getLatest().__text;
  }

  getTooltipText(): string {
    return this.getLatest().__tooltipText;
  }

  isInline(): boolean {
    // TooltipNode should always be inline to prevent line breaks
    return true;
  }

  getIsInline(): boolean {
    return this.getLatest().__isInline;
  }

  setTooltipText(tooltipText: string): void {
    const writable = this.getWritable();
    writable.__tooltipText = tooltipText;
  }

  setText(text: string): void {
    const writable = this.getWritable();
    writable.__text = text;
  }

  setIsInline(isInline: boolean): void {
    const writable = this.getWritable();
    writable.__isInline = isInline;
  }

  decorate(): React.ReactElement {
    return (
      <Suspense fallback={<span>{this.__text}</span>}>
        <TooltipComponent
          nodeKey={this.getKey()}
          text={this.__text}
          tooltipText={this.__tooltipText}
          isInline={this.__isInline}
        />
      </Suspense>
    );
  }
}

export function $createTooltipNode(
  text: string,
  tooltipText: string,
  isInline: boolean = true
): TooltipNode {
  return $applyNodeReplacement(new TooltipNode(text, tooltipText, isInline));
}

export function $isTooltipNode(
  node: LexicalNode | null | undefined
): node is TooltipNode {
  return node instanceof TooltipNode;
}

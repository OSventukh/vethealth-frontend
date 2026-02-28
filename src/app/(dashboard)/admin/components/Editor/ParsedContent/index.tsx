/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_UNDERLINE = 1 << 3;
const IS_STRIKETHROUGH = 1 << 2;
const IS_SUBSCRIPT = 1 << 4;
const IS_SUPERSCRIPT = 1 << 6;

type TextFormatType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'subscript'
  | 'superscript';

const TEXT_TYPE_TO_FORMAT: Record<TextFormatType | string, number> = {
  bold: IS_BOLD,
  italic: IS_ITALIC,
  underline: IS_UNDERLINE,
  strikethrough: IS_STRIKETHROUGH,
  subscript: IS_SUBSCRIPT,
  superscript: IS_SUPERSCRIPT,
};

const sanitizeKeyPart = (value: unknown): string => {
  if (value === null || value === undefined) return 'empty';

  return String(value)
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 40);
};

const createNodeKey = (node: any, index: number, parentPath: string): string => {
  const nodeType = sanitizeKeyPart(node?.type || 'node');
  const identity =
    node?.key ||
    node?.id ||
    node?.url ||
    node?.src ||
    node?.text ||
    node?.tag ||
    node?.templateColumns ||
    'item';

  return `${parentPath}-${index}-${nodeType}-${sanitizeKeyPart(identity)}`;
};

const hasFormat = (type: TextFormatType, format: number): boolean => {
  return (format & TEXT_TYPE_TO_FORMAT[type]) !== 0;
};

const handleFormatting = (str: string, format: number) => {
  let element = <>{str}</>;

  if (hasFormat('bold', format)) {
    element = <b>{element}</b>;
  }

  if (hasFormat('italic', format)) {
    element = <i>{element}</i>;
  }

  if (hasFormat('underline', format)) {
    element = <u>{element}</u>;
  }

  if (hasFormat('strikethrough', format)) {
    element = <s>{element}</s>;
  }

  if (hasFormat('subscript', format)) {
    element = <sub>{element}</sub>;
  }

  if (hasFormat('superscript', format)) {
    element = <sup>{element}</sup>;
  }

  return element;
};

const HandleTextNodeChildren = ({
  items,
  nodePath,
}: {
  items: any[];
  nodePath: string;
}): React.ReactNode => {
  const hasTooltips = items.some((child: any) => child.type === 'tooltip');
  const content = items.map((child: any, i: number) => {
    const isLastItem = i === items.length - 1;
    const nextChild = items[i + 1];
    const childKey = createNodeKey(child, i, nodePath);

    if (child.type === 'text') {
      const shouldAddSpace =
        !isLastItem &&
        nextChild?.type !== 'punctuation' &&
        !/^[.,!?;:]/.test(nextChild?.text || '');

      return (
        <React.Fragment key={childKey}>
          {handleFormatting(child.text?.trim(), child.format)}
          {shouldAddSpace && ' '}
        </React.Fragment>
      );
    }

    if (child.type === 'tooltip') {
      const shouldAddSpace =
        !isLastItem &&
        nextChild?.type !== 'punctuation' &&
        !/^[.,!?;:]/.test(nextChild?.text || '');

      const formattedText = handleFormatting(child.text?.trim(), child.format);
      const isInline = child.isInline !== false; // default to true for backward compatibility

      // If tooltip is inline (on selected text), show tooltip on hover over text
      // If tooltip is after text, show tooltip only on icon
      if (isInline) {
        return (
          <React.Fragment key={childKey}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help border-b border-dotted border-gray-400">
                  {formattedText}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>{child.tooltipText}</span>
              </TooltipContent>
            </Tooltip>
            {shouldAddSpace && ' '}
          </React.Fragment>
        );
      }

      // Tooltip after text - show only on icon
      return (
        <React.Fragment key={childKey}>
          <TooltipProvider>
            <span className="inline-flex items-center">
              {formattedText}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 inline-flex cursor-help items-center">
                    <Info className="h-4 w-4 text-blue-600" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{child.tooltipText}</span>
                </TooltipContent>
              </Tooltip>
            </span>
          </TooltipProvider>
          {shouldAddSpace && ' '}
        </React.Fragment>
      );
    }

    if (child.type === 'linebreak') {
      return <br key={`${childKey}-linebreak`} />;
    }

    if (child.type === 'link') {
      const linkContent = child.children[0]?.text || '';
      const isInternalLink = child.url?.startsWith('/');

      return (
        <React.Fragment key={childKey}>
          <span>{i > 0 && ' '}</span>
          {isInternalLink ? (
            <Link href={child.url} className="underline">
              {linkContent}
            </Link>
          ) : (
            <a href={child.url} className="underline">
              {linkContent}
            </a>
          )}
          <span>{!isLastItem && ' '}</span>
        </React.Fragment>
      );
    }

    return null;
  });

  if (hasTooltips) {
    return <TooltipProvider>{content}</TooltipProvider>;
  }

  return content;
};

const HandleListItem = ({
  items,
  nodePath,
}: {
  items: any[];
  nodePath: string;
}): React.ReactNode => {
  const list = items.map((item: any, i: number) => {
    const itemKey = createNodeKey(item, i, nodePath);

    return (
      <li key={itemKey}>
        <HandleTextNodeChildren
          items={item.children}
          nodePath={`${itemKey}-children`}
        />
      </li>
    );
  });

  return list;
};

const AppendChildNodeToHtml = ({
  node,
  nodePath,
}: {
  node: any;
  nodePath: string;
}): React.ReactNode => {
  const { children } = node;

  const currentNodeType = node.type;

  if (currentNodeType === 'heading') {
    const HeadingTag = node.tag;

    return (
      <HeadingTag
        className={clsx('text-left', {
          'text-center': node.format === 'center',
          'text-right': node.format === 'right',
        })}
      >
        <HandleTextNodeChildren
          items={children}
          nodePath={`${nodePath}-children`}
        />
      </HeadingTag>
    );
  }

  if (currentNodeType === 'paragraph' && node.children[0]?.type == 'image') {
    const imageNode = node.children[0];
    const src = imageNode.src;
    const width = imageNode.width || 500;
    const height = imageNode.height || 500;
    const alt = imageNode.altText;

    return (
      <figure
        className={clsx({
          'text-left': !node.format || node.format === 'left',
          'text-center': node.format === 'center',
          'text-right': node.format === 'right',
        })}
      >
        <div className="inline-block">
          <Image
            className="not-prose inline h-auto w-auto"
            src={src}
            width={width}
            height={height}
            alt={alt}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 700px"
          />
          {imageNode.showCaption && (
            <figcaption className="mt-1 text-center text-sm text-gray-600">
              {imageNode?.caption}
            </figcaption>
          )}
        </div>
      </figure>
    );
  }
  if (currentNodeType === 'paragraph') {
    return (
      <p
        className={clsx('text-left', {
          'text-center': node.format === 'center',
          'text-right': node.format === 'right',
        })}
      >
        <HandleTextNodeChildren
          items={children}
          nodePath={`${nodePath}-children`}
        />
      </p>
    );
  }
  if (currentNodeType === 'list') {
    if (node.tag === 'ol') {
      return (
        <ol className="list-decimal">
          <HandleListItem items={children} nodePath={`${nodePath}-items`} />
        </ol>
      );
    }
    return (
      <ul className="list-disc">
        <HandleListItem items={children} nodePath={`${nodePath}-items`} />
      </ul>
    );
  }

  if (currentNodeType === 'layout-container') {
    const gridItemsNode = node.children;
    const gridItems = gridItemsNode.map((gridItemNode: any, i: number) => {
      const gridItemKey = createNodeKey(gridItemNode, i, `${nodePath}-grid`);

      return (
        <div key={gridItemKey}>
          <ParsedContent
            content={gridItemNode}
            keyPrefix={`${gridItemKey}-content`}
          />
        </div>
      );
    });
    const gridTamplate = node.templateColumns;

    return (
      <div
        className={clsx('grid gap-4', {
          'grid-cols-1 md:grid-cols-[1fr_1fr]': gridTamplate === '1fr 1fr',
          'grid-cols-1 md:grid-cols-[1fr_3fr]': gridTamplate === '1fr 3fr',
          'md:grid-cols-2 lg:grid-cols-3': gridTamplate === '1fr 1fr 1fr',
          'grid-cols-1 md:grid-cols-[1fr_2fr_1fr]':
            gridTamplate === '1fr 2fr 1fr',
          'grid-cols-1 sm:grid-cols-2 md:grid-cols-4':
            gridTamplate === '1fr 1fr 1fr 1fr',
        })}
      >
        {gridItems}
      </div>
    );
  }
};

type Props = {
  content: {
    children: any[];
    root?: any;
  };
  excerpt?: boolean;
  keyPrefix?: string;
};
export const ParsedContent = ({
  content,
  excerpt = false,
  keyPrefix = 'parsed-content',
}: Props): React.ReactNode => {
  if (!content) return <div></div>;
  const topLevelChildren = content?.root?.children || content?.children;
  if (!topLevelChildren) {
    return <div></div>;
  }

  if (excerpt) {
    return (
      <AppendChildNodeToHtml
        node={topLevelChildren[0]}
        nodePath={`${keyPrefix}-excerpt-0`}
      />
    );
  }
  return (
    <>
      {topLevelChildren.map((topLevelNode: any, i: number) => {
        const topLevelKey = createNodeKey(topLevelNode, i, `${keyPrefix}-root`);

        return (
          <AppendChildNodeToHtml
            key={topLevelKey}
            node={topLevelNode}
            nodePath={topLevelKey}
          />
        );
      })}
    </>
  );
};

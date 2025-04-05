/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import Link from 'next/link';
import { randomUUID } from 'crypto';
import clsx from 'clsx';
import React from 'react';

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

const generateRandomKey = () => {
  if (typeof window === 'undefined') {
    return randomUUID();
  }
  return window.crypto.getRandomValues(new Uint32Array(1))[0];
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

const HandleTextNodeChildren = ({ items }: any): React.ReactNode => {
  const text = items.map((child: any, i: number) => {
    if (child.type === 'text') {
      return (
        <React.Fragment key={i}>
          {handleFormatting(child.text?.trim(), child.format)}
        </React.Fragment>
      );
    }

    if (child.type === 'linebreak') {
      return <br key={generateRandomKey()} />;
    }

    if (child.type === 'link') {
      if (child.url?.startsWith('/')) {
        return (
          <Link
            key={generateRandomKey()}
            href={child.url}
            className="underline"
          >
            {child.children[0]?.text}
          </Link>
        );
      }
      return (
        <a key={generateRandomKey()} href={child.url} className="underline">
          {child.children[0]?.text}
        </a>
      );
    }
  });

  return text;
};

const HandleListItem = ({ items }: any): React.ReactNode => {
  const list = items.map((item: any) => {
    return (
      <li key={generateRandomKey()}>
        <HandleTextNodeChildren items={item.children} />
      </li>
    );
  });

  return list;
};

const AppendChildNodeToHtml = ({ node }: any): React.ReactNode => {
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
        <HandleTextNodeChildren items={children} />
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
            key={generateRandomKey()}
            src={src}
            width={width}
            height={height}
            alt={alt}
            priority
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
        <HandleTextNodeChildren items={children} />
      </p>
    );
  }
  if (currentNodeType === 'list') {
    if (node.tag === 'ol') {
      return (
        <ol className="list-decimal">
          <HandleListItem items={children} />
        </ol>
      );
    }
    return (
      <ul className="list-disc">
        <HandleListItem items={children} />
      </ul>
    );
  }

  if (currentNodeType === 'layout-container') {
    const gridItemsNode = node.children;
    const gridItems = gridItemsNode.map((gridItemNode: any) => {
      return (
        <div key={generateRandomKey()}>
          <ParsedContent content={gridItemNode} />
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
};
export const ParsedContent = ({
  content,
  excerpt = false,
}: Props): React.ReactNode => {
  if (!content) return <div></div>;
  const topLevelChildren = content?.root?.children || content?.children;
  if (!topLevelChildren) {
    return <div></div>;
  }

  if (excerpt) {
    return (
      <AppendChildNodeToHtml
        key={generateRandomKey()}
        node={topLevelChildren[0]}
      />
    );
  }
  return (
    <>
      {topLevelChildren.map((topLevelNode: any) => {
        return (
          <AppendChildNodeToHtml
            key={generateRandomKey()}
            node={topLevelNode}
          />
        );
      })}
    </>
  );
};

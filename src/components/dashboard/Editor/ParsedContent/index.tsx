import Image from 'next/image';
import Link from 'next/link';
import { randomUUID } from 'crypto';
import clsx from 'clsx';

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
    console.log('here');
    element = <sup>{element}</sup>;
  }

  return element;
};

const HandleParagraphChildren = ({ items }: any): any => {
  const text = items.map((child: any) => {
    if (child.type === 'text') {
      return <>{handleFormatting(child.text?.trim(), child.format)}</>;
    }

    if (child.type === 'linebreak') {
      return <br key={randomUUID()} />;
    }

    if (child.type === 'link') {
      if (child.url?.startsWith('/')) {
        return (
          <Link key={randomUUID()} href={child.url}>
            {child.children[0]?.text}
          </Link>
        );
      }
      return (
        <a key={randomUUID()} href={child.url}>
          {child.children[0]?.text}
        </a>
      );
    }

    if (child.type === 'image') {
      console.log(child);
      const src = child.src;
      const width = child.width;
      const height = child.height;
      if (child.showCaption) {
        return (
          <figure key={randomUUID()} className="inline">
            <figcaption>
              <Image
                className="inline w-auto h-auto"
                key={randomUUID()}
                src={src}
                width={width || 500}
                height={height || 500}
                alt={child?.altText}
                priority
              />
              <ParsedContent content={child.caption.editorState} />
            </figcaption>
          </figure>
        );
      }
      return (
        <Image
          className="inline w-auto h-auto"
          key={randomUUID()}
          src={src}
          width={width || 500}
          height={height || 500}
          alt={child?.altText}
          priority
        />
      );
    }
  });

  return text;
};

const HandleListItem = ({ items }: any): any => {
  const list = items.map((item: any) => {
    return (
      <li key={randomUUID()}>
        <HandleParagraphChildren items={item.children} />
      </li>
    );
  });

  return list;
};

const AppendChildNodeToHtml = ({ node }: any): any => {
  const { children } = node;

  const currentNodeType = node.type;

  if (currentNodeType === 'heading') {
    const tag = node.tag;
    if (tag === 'h1') {
      return <h1>{node.children[0].text}</h1>;
    }

    if (tag === 'h2') {
      return <h2>{node.children[0].text}</h2>;
    }

    if (tag === 'h3') {
      return <h3>{node.children[0].text}</h3>;
    }

    if (tag === 'h4') {
      return <h4>{node.children[0].text}</h4>;
    }

    if (tag === 'h5') {
      return <h5>{node.children[0].text}</h5>;
    }

    if (tag === 'h4') {
      return <h6>{node.children[0].text}</h6>;
    }
  }

  if (currentNodeType === 'paragraph') {
    return (
      <p
        className={clsx('text-left', {
          'text-center': node.format === 'center',
          'text-right': node.format === 'right',
        })}
      >
        <HandleParagraphChildren items={children} />
      </p>
    );
  }
  if (currentNodeType === 'list') {
    if (node.tag === 'ol') {
      return (
        <ol>
          <HandleListItem items={children} />
        </ol>
      );
    }
    return (
      <ul>
        <HandleListItem items={children} />
      </ul>
    );
  }

  if (currentNodeType === 'layout-container') {
    const gridItemsNode = node.children;
    console.log(node);
    const gridItems = gridItemsNode.map((gridItemNode: any) => {
      return (
        <div key={randomUUID()}>
          <ParsedContent content={gridItemNode} />
        </div>
      );
    });
    const gridTamplate = node.templateColumns;

    return (
      <div
        className={clsx('grid', {
          'grid-cols-1 md:grid-cols-[1fr_1fr]': gridTamplate === '1fr 1fr',
          'grid-cols-1 md:grid-cols-[1fr_3fr]': gridTamplate === '1fr 3fr',
          'grid-cols-1 md:grid-cols-[1fr 1fr 1fr]':
            gridTamplate === '1fr 1fr 1fr',
          'grid-cols-1 md:grid-cols-[1fr 2fr 1fr]':
            gridTamplate === '1fr 2fr 1fr',
          'grid-cols-1 md:grid-cols-[1fr 1fr 1fr 1fr]':
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
};
export const ParsedContent = ({ content }: Props): React.ReactNode => {
  if (!content) return <div></div>;
  const topLevelChildren = content?.root?.children || content?.children;
  if (!topLevelChildren) {
    return <div></div>;
  }
  return (
    <>
      {topLevelChildren.map((topLevelNode: any) => {
        return <AppendChildNodeToHtml key={randomUUID()} node={topLevelNode} />;
      })}
    </>
  );
};

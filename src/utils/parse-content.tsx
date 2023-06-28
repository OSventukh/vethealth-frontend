import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import parse, {
  HTMLReactParserOptions,
  Element,
  Text,
  domToReact,
} from 'html-react-parser';

const transformStyle = (styleStr: string) => {
  const obj: { [key: string]: string } = {};

  if (!styleStr) {
    return {};
  }

  styleStr.split(';').forEach((prop) => {
    const [key, value] = prop.split(':');
    if (key && value) {
      obj[key.trim()] = value.trim();
    }
  });
  return obj;
};

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    const typedDomNode = domNode as Element;
    if (typedDomNode.attribs && typedDomNode.name === 'a') {
      const linkText =
        typedDomNode?.children &&
        (typedDomNode.children.find((item) => item.type === 'text') as Text);

      return (
        <Link
          className={typedDomNode.attribs.class}
          title={typedDomNode.attribs.title}
          href={typedDomNode.attribs.href}
        >
          {linkText?.data!}
        </Link>
      );
    }

    if (typedDomNode.name === 'img') {
      if (!typedDomNode.attribs?.width) {
        return (
          <div
            style={{
              ...transformStyle(typedDomNode?.attribs?.style),
              position: 'relative',
              width: '100%',
              aspectRatio: 1,
            }}
          >
            <Image
              style={{
                ...transformStyle(typedDomNode?.attribs?.style),
                objectFit: 'cover',
              }}
              src={typedDomNode.attribs.src}
              priority
              fill
              sizes="100%"
              alt={typedDomNode?.attribs?.alt}
            />
          </div>
        );
      }
      return (
        <Image
          style={transformStyle(typedDomNode?.attribs?.style)}
          src={typedDomNode.attribs.src}
          priority
          width={+typedDomNode?.attribs?.width}
          height={+typedDomNode?.attribs?.height}
          alt={typedDomNode?.attribs?.alt}
        />
      );
    }
    return false;
  },
};

export default function ParsedContent({ html }: { html: string }) {
  const parsedPost = parse(html, options);

  return <>{parsedPost}</>;
}

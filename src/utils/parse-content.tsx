import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, Tooltip } from '@mui/material';

import parse, {
  HTMLReactParserOptions,
  Element,
  Text,
  domToReact,
  DOMNode,
  
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

const replaceFunction = (domNode: DOMNode) => {
  const typedNode = domNode as Element;
  if (typedNode.name === 'div' && typedNode?.attribs?.class === 'grid') {
    return (
      <Grid container spacing={10}>{domToReact(typedNode?.children, { replace: replaceFunction})}</Grid>
    )
  }
  if (typedNode.name === 'span' && typedNode?.attribs?.class === 'tooltip' && typedNode.attribs?.['data-tooltip']) {
    const text = typedNode?.children && (typedNode.children.find((item) => item.type === 'text') as Text);
    return (
      <Tooltip title={typedNode.attribs['data-tooltip']} placement="top" enterTouchDelay={0}><span className='tooltip'>{text?.data}</span></Tooltip>
    )
  }
  if (typedNode.name === 'div' && typedNode?.attribs?.class === 'grid-item') {
    return (
      <Grid item>{domToReact(typedNode?.children)}</Grid>
    )
  }
  if (typedNode.name === 'a') {
    const linkText =
    typedNode?.children &&
      (typedNode.children.find((item) => item.type === 'text') as Text);

    return (
      <Link
        className={typedNode.attribs?.class}
        title={typedNode.attribs?.title}
        href={typedNode.attribs?.href}
      >
        {linkText?.data}
      </Link>
    );
  }

  if (typedNode.name === 'img') {
    if (!typedNode.attribs?.width) {
      return (
        <div
          style={{
            ...transformStyle(typedNode?.attribs?.style),
            position: 'relative',
            width: '100%',
            aspectRatio: 1,
          }}
        >
          <Image
            style={{
              ...transformStyle(typedNode?.attribs?.style),
              objectFit: 'cover',
            }}
            src={typedNode.attribs.src}
            priority
            fill
            sizes="100%"
            alt={typedNode?.attribs?.alt}
          />
        </div>
      );
    }
    return (
      <Image
        style={transformStyle(typedNode?.attribs?.style)}
        src={typedNode.attribs.src}
        priority
        width={+typedNode?.attribs?.width}
        height={+typedNode?.attribs?.height}
        alt={typedNode?.attribs?.alt}
      />
    );
  }
  return false;
};

const options: HTMLReactParserOptions = {
  replace: replaceFunction,
};

export default function ParsedContent({ html }: { html: string }) {
  const parsedPost = parse(html, options);

  return <>{parsedPost}</>;
}

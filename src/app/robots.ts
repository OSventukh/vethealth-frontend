import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isAllowed = process.env.NODE_ENV === 'production';

  if (!isAllowed) {
    return {
      rules: {
        userAgent: '*',
        disallow: ['/', '/admin'],
      },
    };
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
  };
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://stridedistrict.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/account/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

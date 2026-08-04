// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Jangan indeks endpoint backend
        },
        sitemap: 'https://codegraph.my.id/sitemap.xml',
    };
}

import React from 'react'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'


import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Codegraph | Premium Digital Assets, Canva & Excel Templates',
        template: '%s | Codegraph', // e.g., "Financial Tracker | Codegraph"
    },
    description:
        'Elevate your productivity with Codegraph. Discover premium digital assets, professional Canva designs, automated Excel spreadsheets, and ready-to-use templates.',
    keywords: [
        'Codegraph',
        'digital assets',
        'Canva templates',
        'Excel templates',
        'productivity tools',
        'design templates',
        'spreadsheet trackers'
    ],
    authors: [{ name: 'Codegraph' }],
    creator: 'Codegraph',
    publisher: 'Codegraph',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://codegraph.com', // Replace with your actual domain
        siteName: 'Codegraph',
        title: 'Codegraph | Premium Digital Assets & Templates',
        description:
            'High-quality Canva designs, Excel spreadsheets, and digital assets to streamline your workflow.',
        images: [
            {
                url: 'https://codegraph.com/og-image.png', // Create & place this in /public/og-image.png
                width: 1200,
                height: 630,
                alt: 'Codegraph Digital Assets Marketplace',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Codegraph | Premium Digital Assets & Templates',
        description: 'High-quality Canva designs, Excel spreadsheets, and digital assets.',
        images: ['https://codegraph.com/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};


const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='bg-linear-to-br from-slate-50 via-white to-slate-100'>
            <Navbar />
            <div className="">
                {children}
            </div>
            <ChatWidget />
            <Footer />
        </div>
    )
}

export default Layout

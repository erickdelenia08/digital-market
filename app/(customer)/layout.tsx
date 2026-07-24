import React from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
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

import React from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='bg-linear-to-br from-slate-50 via-white to-slate-100'>
            <Navbar />
            <div className="">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout

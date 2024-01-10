import React from 'react'

interface propsLayout {
    children: React.ReactNode
}

function Layout({ children }: propsLayout) {
    return (
        <div className='flex flex-col gap-10 h-full items-center justify-center '>
            {children}</div>
    )
}

export default Layout
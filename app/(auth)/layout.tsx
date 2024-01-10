import React from 'react'
import Logo from './_components/Logo'

interface propsLayout {
    children: React.ReactNode
}

function AuthLayout({ children }: propsLayout) {
    return (
        <div className='flex flex-col gap-10 h-full items-center justify-center '>
            <Logo/>
            {children}</div>
    )
}

export default AuthLayout
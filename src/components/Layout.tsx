import Image from 'next/image'
import logo from '@/public/enpal-logo.svg'
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

export default function Layout({children}) {
    return (
        <>
            <div className="absolute top-0 left-0 bg-gray-100 w-full flex">
                <Image id="enpal-logo" src={logo} alt="Enpal ." className="block w-[100px] h-[50px] mx-auto p-[5px]"/>
            </div>
            <main className="flex flex-col justify-between items-center p-24 min-h-screen">{children}</main>
        </>
    )
}
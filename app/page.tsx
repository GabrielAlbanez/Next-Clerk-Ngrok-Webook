import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div className=' flex gap-10 py-3 px-10 rounded-full border-[1px] border-white shadow-md'>
        <Link href="/sign-up"><button>Registrar</button></Link>
        <p>|</p>
        <Link href="/sign-in"><button>Logar</button></Link>
     </div>
    </main>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgeVerification from '@/components/AgeVerification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShadowClips.asia - Streaming & Download',
  description: 'Streaming and Download Premium Clips',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} text-slate-100 selection:bg-cyan-500 selection:text-white bg-[#0a0a0c]`}>
        <Navbar />
        {children}
        <Footer />
        <AgeVerification />
      </body>
    </html>
  )
}
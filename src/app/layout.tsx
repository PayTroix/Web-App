import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

//Appkit
import { headers } from 'next/headers' 
import ContextProvider from '@/context/Appkit'

export const metadata: Metadata = {
  title: "PayTroix - Web3 Payroll Solution",
  description: "Payroll Reinvented for Web3 - Instant, Secure, and Borderless",
}

// Added async so await in appkit intergration doesnt throw error
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  //Appkit Intergration
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  
  return (
    <html lang="en">
      <body className={inter.className}><ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}

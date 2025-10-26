import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@coinbase/onchainkit/styles.css"
import "./globals.css"
import { Toaster } from "react-hot-toast";
import 'nprogress/nprogress.css';
import { Providers } from '@/providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PayTroix - Web3 Payroll Solution",
  description: "Payroll Reinvented for Web3 - Instant, Secure, and Borderless",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              className: '',
              duration: 5000,
              style: {
                background: '#1A1A1A',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

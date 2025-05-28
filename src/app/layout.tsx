// 'use client'
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast";
// import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useEffect } from 'react';

// Configure NProgress
// NProgress.configure({
//   minimum: 0.3,
//   easing: 'ease',
//   speed: 500,
//   showSpinner: false
// });

// function NavigationEvents() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     NProgress.start();
//     NProgress.done();
//   }, [pathname, searchParams]);

//   return null;
// }

const inter = Inter({ subsets: ["latin"] })

//Appkit
import { AppKit } from '@/context/Appkit'


const metadata: Metadata = {
  title: "PayTroix - Web3 Payroll Solution",
  description: "Payroll Reinvented for Web3 - Instant, Secure, and Borderless",
}

// Added async so await in appkit intergration doesnt throw error
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKit>{children}
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
        </AppKit>
      </body>
    </html>
  )
}

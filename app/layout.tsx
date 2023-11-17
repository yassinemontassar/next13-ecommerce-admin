
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from '@clerk/localizations';

import { ModalProvider } from '@/providers/modal-provider';

import './globals.css'
import { ToasterProvider } from '@/providers/toast-provider';
import { Suspense } from 'react';
import Skeleton from '@/components/skelton';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider localization={frFR} appearance={{
        elements: {
          footer: "hidden",
        },
      }}>
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Skeleton/>}>
        <ToasterProvider />
        <ModalProvider/>
        {children}
        </Suspense>
        </body>
        
    </html>
    </ClerkProvider>
  )
}

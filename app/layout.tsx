
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from '@clerk/localizations';

import { ModalProvider } from '@/providers/modal-provider';

import './globals.css'
import { ToasterProvider } from '@/providers/toast-provider';
import { Suspense } from 'react';
import Skeleton from '@/components/skelton';
import { ThemeProvider } from '@/providers/theme-provider';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RoundaStore Administration',
  description: 'RoundaStore Administration',
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
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Suspense fallback={<Skeleton/>}>
          <ToasterProvider />
          <ModalProvider/>
          {children}
          </Suspense>
        </ThemeProvider>
        </body>
        
    </html>
    </ClerkProvider>
  )
}

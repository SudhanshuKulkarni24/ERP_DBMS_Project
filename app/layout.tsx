import { ChakraProvider } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from "next"
import { checkEnvironmentVariables } from "@/lib/env-check"

// Check environment variables in development
if (process.env.NODE_ENV !== "production") {
  checkEnvironmentVariables()
}

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Course Management System',
  description: 'A comprehensive system for course registration and management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}



import './globals.css'
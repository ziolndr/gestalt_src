'use client'

import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '../ThemeContext'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 20 L50 10 L80 20 L90 50 L80 80 L50 90 L20 80 L10 50 Z' fill='%232A2A2A'/><path d='M35 40 L65 40 L65 60 L50 70 L35 60 Z' fill='none' stroke='%23FFFFFF' stroke-width='5'/><circle cx='50' cy='30' r='5' fill='%23FFFFFF'/></svg>" />
      </head>
      <body className={spaceGrotesk.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
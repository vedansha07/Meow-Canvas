import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meow-Canvas',
  description: 'Created by VS07',
  generator: 'VS07',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

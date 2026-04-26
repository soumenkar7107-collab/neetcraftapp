import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NEETCraft — Premium NEET Prep System',
  description: 'Gamified NEET preparation dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000' }}>{children}</body>
    </html>
  )
}

import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'VoltMart — Premium Electrical Store',
  description: 'Shop LED bulbs, ceiling fans, switches, wires and more. Quality electrical products delivered fast across India.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

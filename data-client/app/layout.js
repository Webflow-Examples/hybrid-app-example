import './globals.css'

export const metadata = {
  title: 'Stay Tuned for DevFlow Party',
  description: 'We are enhancing our demo application to deliver a more impressive, engaging, and enlightening experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}

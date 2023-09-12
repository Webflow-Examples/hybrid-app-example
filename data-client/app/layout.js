import './globals.css'

export const metadata = {
  title: 'DevFlow Party',
  description: 'A simple App to explore the capabilities of the Webflow API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}

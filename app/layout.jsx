import './globals.css'

export const metadata = {
  title: 'Premiere Stories Wall',
  description: 'Prototype voor filmpremière social stories wall'
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}

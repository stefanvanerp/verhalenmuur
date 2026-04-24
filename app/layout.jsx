import './globals.css';

export const metadata = {
  title: 'Verhalenmuur',
  description: 'Premiere stories wall voor bioscoopschermen'
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}

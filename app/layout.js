import { Jura } from 'next/font/google'
import "./global.css";

export const jura = Jura({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Solana Crowdsale",
  description: "Fundraiser for sDAPP",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jura.className}`}>
        {children}
      </body>
    </html>
  );
}
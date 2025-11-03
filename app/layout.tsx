import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavServer from "@/components/NavServer";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced root metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000'),
  title: {
    default: 'E-Shop - Quality Products Online',
    template: '%s | E-Shop'
  },
  description: "Discover amazing deals on quality products. Shop our latest collection with fast shipping and secure payment.",
  keywords: ['ecommerce', 'shopping', 'online store', 'quality products', 'fast shipping'],
  authors: [{ name: 'E-Shop Team' }],
  creator: 'E-Shop',
  publisher: 'E-Shop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'E-Shop',
    title: 'E-Shop - Quality Products Online',
    description: "Discover amazing deals on quality products. Shop our latest collection with fast shipping.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Shop - Quality Products Online',
    description: "Discover amazing deals on quality products. Shop our latest collection with fast shipping.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavServer />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
        <Footer />
      </body>
    </html>
  );
}

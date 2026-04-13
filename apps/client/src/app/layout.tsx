import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aevia-live.vercel.app"),
  title: {
    default: "AeviaLive — Live Streaming & Creator Monetization Platform",
    template: "%s | AeviaLive",
  },
  description:
    "AeviaLive is the premium live streaming and creator monetization platform. Go live, sell exclusive content, receive tips and subscriptions. Ultra-low latency. Own your audience, no middlemen.",
  keywords: [
    "live streaming platform",
    "AeviaLive",
    "creator monetization",
    "live stream tips",
    "exclusive content creators",
    "PPV streaming",
    "fan subscriptions",
    "creator economy",
    "Valentin Milliand",
  ],
  authors: [{ name: "Valentin Milliand", url: "https://valentin-milliand.vercel.app" }],
  creator: "Valentin Milliand",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aevia-live.vercel.app",
    siteName: "AeviaLive",
    title: "AeviaLive — Live Streaming & Creator Monetization Platform",
    description:
      "Premium live streaming and creator monetization: tips, subscriptions, exclusive content. Ultra-low latency, no middlemen.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AeviaLive — Live Streaming Platform for Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeviaLive — Live Streaming & Creator Monetization Platform",
    description:
      "Premium live streaming and creator monetization: tips, subscriptions, exclusive content. Ultra-low latency, no middlemen.",
    images: ["/og.png"],
    creator: "@valentinmilliand",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://aevia-live.vercel.app",
  },
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AeviaLive',
  url: 'https://aevia-live.vercel.app',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'All',
  description:
    'Premium live streaming and creator monetization platform. Go live, sell exclusive content, receive tips and subscriptions. Ultra-low latency, no middlemen.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free to join. Creator monetization available.',
  },
  author: {
    '@type': 'Person',
    name: 'Valentin Milliand',
    url: 'https://valentin-milliand.vercel.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

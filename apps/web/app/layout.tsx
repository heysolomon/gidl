import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";
import { Agentation } from "agentation";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Gidl | Motion Components",
    template: "%s | Gidl",
  },
  description: "Beautiful animation primitives for engineers and designers.",
  keywords: ["react", "framer motion", "animations", "components", "design engineer", "solomon akuson"],
  authors: [{ name: "Solomon Akuson", url: "https://www.solomonakuson.com" }],
  creator: "Solomon Akuson",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://gidl.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gidl - Solomon Akuson",
    title: "Gidl",
    description: "Beautiful animation primitives for engineers and designers.",
    images: ["/api/og?title=Motion%20Components"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidl",
    description: "Beautiful animation primitives for engineers and designers.",
    creator: "@heysolomon_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${urbanist.variable} font-sans antialiased`}>
        <RootProvider>{children}</RootProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}

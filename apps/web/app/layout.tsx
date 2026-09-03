import type { Metadata, Viewport } from "next";
import { Caveat, Urbanist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Agentation } from "agentation";
import { JsonLd } from "@/components/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://gidl.dev";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
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
  description: "Animated UI components, recreated from inspiration and rebuilt for you to copy into your own project.",
  keywords: [
    "react",
    "framer motion",
    "animations",
    "components",
    "design engineer",
    "solomon akuson",
  ],
  authors: [{ name: "Solomon Akuson", url: "https://www.solomonakuson.com" }],
  creator: "Solomon Akuson",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gidl - Solomon Akuson",
    title: "Gidl",
    description: "Animated UI components, recreated from inspiration and rebuilt for you to copy into your own project.",
    images: ["/api/og?title=Motion%20Components"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidl",
    description: "Animated UI components, recreated from inspiration and rebuilt for you to copy into your own project.",
    creator: "@heysolomon",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Gidl",
      url: SITE_URL,
      description:
        "Animated UI components, recreated from inspiration and rebuilt for you to copy into your own project.",
      author: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Solomon Akuson",
      url: "https://www.solomonakuson.com",
      sameAs: ["https://x.com/heysolomon", "https://github.com/heysolomon"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${urbanist.variable} ${caveat.variable} font-sans antialiased`}
      >
        <JsonLd data={jsonLd} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const azeretMono = localFont({
  src: "./fonts/AzeretMono-Regular.woff2",
  variable: "--font-azeret",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains",
  display: "swap",
});

const firaMono = localFont({
  src: "./fonts/FiraMono-Regular.woff2",
  variable: "--font-fira",
  display: "swap",
});

const sourceCodePro = localFont({
  src: "./fonts/SourceCodePro-Regular.woff2",
  variable: "--font-source",
  display: "swap",
});

const cascadiaMono = localFont({
  src: "./fonts/CascadiaMono-Regular.woff2",
  variable: "--font-cascadia",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: "./fonts/IBMPlexMono-Regular.woff2",
  variable: "--font-ibm",
  display: "swap",
});

const inconsolata = localFont({
  src: "./fonts/Inconsolata-Regular.woff2",
  variable: "--font-inconsolata",
  display: "swap",
});

const ubuntuMono = localFont({
  src: "./fonts/UbuntuMono-Regular.woff2",
  variable: "--font-ubuntu",
  display: "swap",
});

const monaspaceArgon = localFont({
  src: "./fonts/MonaspaceArgon-Regular.woff2",
  variable: "--font-monaspace",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Regular.woff2",
  variable: "--font-geist",
  display: "swap",
});

const notoSansMono = localFont({
  src: "./fonts/NotoSansMono-Regular.woff2",
  variable: "--font-noto",
  display: "swap",
});

const robotoMono = localFont({
  src: "./fonts/Roboto-Regular.woff2",
  variable: "--font-roboto",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://playground.example.com";
const siteName = "Playground";
const siteDescription =
  "JavaScript & TypeScript REPL playground - Write, run, and test your code in real-time. Supports JavaScript and TypeScript with syntax highlighting, auto-run, and customizable themes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "javascript",
    "typescript",
    "repl",
    "playground",
    "code editor",
    "online compiler",
    "javascript playground",
    "typescript playground",
    "code runner",
    "live coding",
    "interactive coding",
    "web development",
    "programming",
    "code testing",
  ],
  authors: [{ name: "Hugh Fabre" }],
  creator: "Hugh Fabre",
  publisher: "Hugh Fabre",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
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
  alternates: {
    canonical: siteUrl,
  },
  category: "development",
};

const fontVariables = [
  azeretMono.variable,
  jetbrainsMono.variable,
  firaMono.variable,
  sourceCodePro.variable,
  cascadiaMono.variable,
  ibmPlexMono.variable,
  inconsolata.variable,
  ubuntuMono.variable,
  monaspaceArgon.variable,
  geistMono.variable,
  notoSansMono.variable,
  robotoMono.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "JavaScript REPL",
      "TypeScript REPL",
      "Real-time code execution",
      "Syntax highlighting",
      "Customizable themes",
      "Auto-run functionality",
      "Code sharing",
    ],
    programmingLanguage: ["JavaScript", "TypeScript"],
  };

  return (
    <html lang="en" className={fontVariables}>
      <body className="antialiased">
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}

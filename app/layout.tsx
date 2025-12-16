import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "Code Playground",
  description: "JavaScript & TypeScript REPL playground",
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
  return (
    <html lang="en" className={fontVariables}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

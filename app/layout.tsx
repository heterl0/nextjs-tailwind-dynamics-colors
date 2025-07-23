import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dynamic Color Generate",
  description:
    "Dynamic Color Generate was inspired by EvaColor Picker, that generates semantic colors from primary color.",
  openGraph: {
    title: "Dynamic Color Generate",
    description:
      "Dynamic Color Generate was inspired by EvaColor Picker, that generates semantic colors from primary color.",
    images: ["/projects/portfolio.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dynamic Color Generate",
    description:
      "Dynamic Color Generate was inspired by EvaColor Picker, that generates semantic colors from primary color.",
    images: ["/projects/portfolio.webp"],
  },
  alternates: {
    canonical: "https://dynamic-color-generate.heterl0.live",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/favicon-light.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.ico",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  metadataBase: new URL("https://dynamic-color-generate.heterl0.live"),
  keywords: ["Dynamic Color Generate", "EvaColor Picker", "Semantic Colors"],
  authors: [
    { name: "Hieu Le Van", url: "https://dynamic-color-generate.heterl0.live" },
  ],
  applicationName: "Dynamic Color Generate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

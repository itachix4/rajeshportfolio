import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../src/site.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parthparwani.com"),
  title: "Parth Parwani — Creative Developer, UI Engineer & Founder",
  description:
    "Selected work by Parth Parwani, a creative developer, UI engineer and ForgeLane founder—Krish Veneer, North Star, FinanceForTeen and PARTH LAB OS.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Parth Parwani — Creative Developer & UI Engineer",
    description:
      "Selected digital products and premium web experiences for Krish Veneer, North Star, FinanceForTeen, ForgeLane and PARTH LAB OS.",
    url: "/",
    siteName: "Parth Parwani",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Parth Parwani portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Parwani — Creative Developer & UI Engineer",
    description: "Selected work across brand, product, interaction and frontend engineering by Parth Parwani.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173fe7",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

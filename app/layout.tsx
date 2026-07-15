import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "../src/site.css";

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
  themeColor: "#163ee8",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

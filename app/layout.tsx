import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "../src/site.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://parthparwani.com"),
  title: "Parth Parwani — Creative Developer, UI Engineer & Founder",
  description:
    "Parth Parwani designs and engineers distinctive digital products, immersive interfaces and premium websites. Founder of ForgeLane.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Parth Parwani — Creative Developer & UI Engineer",
    description:
      "Distinctive digital products, immersive interfaces and premium websites—designed and engineered by Parth Parwani.",
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
    description: "Founder of ForgeLane. Design, code and strategy in one product-minded practice.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1830",
  colorScheme: "dark",
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

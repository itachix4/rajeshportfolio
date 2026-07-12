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
        url: "/images/preview.png",
        width: 1450,
        height: 828,
        alt: "Parth Parwani portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Parwani — Creative Developer & UI Engineer",
    description: "Founder of ForgeLane. Design, code and strategy in one product-minded practice.",
    images: ["/images/preview.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
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

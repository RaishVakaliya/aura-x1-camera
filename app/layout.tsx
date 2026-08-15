import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { LocomotiveProvider } from "@/components/providers/LocomotiveProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA X1 — Precision Camera System",
  description:
    "A precision camera system built around light, control and detail. The AURA X1.",
  openGraph: {
    title: "AURA X1 — Precision Camera System",
    description:
      "A precision camera system built around light, control and detail.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/camera/frames/ezgif-frame-001.jpg"
          type="image/jpeg"
        />
      </head>
      <body>
        <LocomotiveProvider>{children}</LocomotiveProvider>
      </body>
    </html>
  );
}

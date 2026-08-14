import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { LocomotiveProvider } from "@/components/providers/LocomotiveProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA X1 — Precision Camera System",
  description:
    "A precision camera system built around light, control and detail. The AURA X1.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <LocomotiveProvider>{children}</LocomotiveProvider>
      </body>
    </html>
  );
}

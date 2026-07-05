import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, Caveat, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Reverie",
  description: "Koleksi dongeng malam indah yang ditulis khusus untuk menemani tidurmu.",
  icons: {
    icon: "/reveriee.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", lora.variable, caveat.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Inter({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konde",
  description: "Platform for sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang='en'>
        <body className={`${sora.className} antialiased`}>
          <Toaster position='top-right' className='bg-pink text-white' />
          <main>{children}</main>
        </body>
      </html>
    </Providers>
  );
}

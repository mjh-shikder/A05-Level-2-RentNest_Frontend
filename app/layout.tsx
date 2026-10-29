import type { Metadata } from "next";
import {Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/shared/Navbar";
import ThemeProvider from "@/components/shared/ThemeProvider";
import { Suspense } from "react";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "Rent Nest",
  description: "Property Renter Services",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="h-16 border-b border-white/30 bg-white/10 backdrop-blur-xl"
              />
            }
          >
            <Navbar />
          </Suspense>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

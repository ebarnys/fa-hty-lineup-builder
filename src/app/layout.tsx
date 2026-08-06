import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FA Horšovský Týn – Sestavy",
  description:
    "Jednoduchá aplikace pro evidenci hráčů a skládání fotbalové sestavy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
          <footer className="border-t border-line/60 text-center text-xs text-zinc-500 py-4">
            FA Horšovský Týn · osobní nástroj pro sestavy · data uložena lokálně
            v prohlížeči
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}

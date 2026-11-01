import "./globals.scss";
import type { Viewport } from "next";
import { Geist } from "next/font/google";
import { getLocale } from "next-intl/server";
import { ThemeSync } from "@/app/components/ThemeSync/ThemeSync";

const geist = Geist({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=11" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          try {
            const t = localStorage.getItem('theme');
            const theme = t ? JSON.parse(t).state?.theme : 'light';
            document.documentElement.setAttribute('data-theme', theme || 'light');
          } catch {}
          `,
          }}
        />
      </head>
      <body className={geist.className} suppressHydrationWarning>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}

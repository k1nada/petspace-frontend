import "./../globals.scss";
import { Geist } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toast } from "../uikit/feedback/Toast/Toast";
import { UserProvider } from "../providers/UserProvider";

const geist = Geist({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          try {
            const t = localStorage.getItem('theme');
            const theme = t ? JSON.parse(t).state?.theme : 'light';
            document.documentElement.setAttribute('data-theme', theme || 'light');
            document.documentElement.style.background = theme === 'dark' ? '#1a1a1c' : '#f2f2f2';
          } catch {}
          `,
          }}
        />
      </head>
      <body className={geist.className} suppressHydrationWarning>
        <Toast />
        <NextIntlClientProvider>
          <UserProvider>{children}</UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

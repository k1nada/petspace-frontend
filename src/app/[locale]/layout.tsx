import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toast } from "@/app/uikit/feedback/Toast/Toast";
import { UserProvider } from "@/app/providers/UserProvider";
import { HtmlLang } from "@/app/components/HtmlLang/HtmlLang";

export default async function LocaleLayout({
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
    <>
      <HtmlLang locale={locale} />
      <Toast />
      <NextIntlClientProvider>
        <UserProvider>{children}</UserProvider>
      </NextIntlClientProvider>
    </>
  );
}

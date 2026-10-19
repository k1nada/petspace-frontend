"use client";

import { useEffect } from "react";

interface HtmlLangProps {
  locale: string;
}

export const HtmlLang = ({ locale }: HtmlLangProps) => {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
};

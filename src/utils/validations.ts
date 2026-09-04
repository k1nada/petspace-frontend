import { useTranslations } from "next-intl";

type Translator = ReturnType<typeof useTranslations>;

export const passwordValidationMin = (t: Translator) => ({
  value: 8,
  message: t("validations.minLength", { min: 8 }),
});

export const passwordValidationMax = (t: Translator) => ({
  value: 64,
  message: t("validations.maxLength", { max: 64 }),
});

export const usernameValidationMin = (t: Translator) => ({
  value: 3,
  message: t("validations.minLength", { min: 3 }),
});

export const usernameValidationMax = (t: Translator) => ({
  value: 20,
  message: t("validations.maxLength", { max: 20 }),
});

export const usernameValidationPattern = (t: Translator) => ({
  value: /^[a-zA-Z0-9_]+$/,
  message: t("validations.usernamePattern"),
});

export const nameValidationPattern = (t: Translator) => ({
  value: /^[\p{L}\p{N} ]+$/u,
  message: t("validations.namePattern"),
});

export const emailValidationMax = (t: Translator) => ({
  value: 254,
  message: t("validations.maxLength", { max: 254 }),
});

export const emailValidationPattern = (t: Translator) => ({
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: t("validations.emailPattern"),
});

export const passwordValidationPattern = (t: Translator) => ({
  value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  message: t("validations.passwordPattern"),
});

export const requiredValidation = "validations.required";

import { _Translator } from "next-intl";

export const signInValidationMin = (t: _Translator) => ({
  value: 3,
  message: t("validations.minLength", { min: 3 }),
});

export const signInValidationMax = (t: _Translator) => ({
  value: 30,
  message: t("validations.maxLength", { max: 30 }),
});

export const passwordValidationMin = (t: _Translator) => ({
  value: 8,
  message: t("validations.minLength", { min: 8 }),
});

export const passwordValidationMax = (t: _Translator) => ({
  value: 64,
  message: t("validations.maxLength", { max: 64 }),
});

export const usernameValidationMin = (t: _Translator) => ({
  value: 3,
  message: t("validations.minLength", { min: 3 }),
});

export const usernameValidationMax = (t: _Translator) => ({
  value: 20,
  message: t("validations.maxLength", { max: 20 }),
});

export const usernameValidationPattern = (t: _Translator) => ({
  value: /^[a-zA-Z0-9_]+$/,
  message: t("validations.usernamePattern"),
});

export const emailValidationMax = (t: _Translator) => ({
  value: 254,
  message: t("validations.maxLength", { max: 254 }),
});

export const emailValidationPattern = (t: _Translator) => ({
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: t("validations.emailPattern"),
});

export const passwordValidationPattern = (t: _Translator) => ({
  value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  message: t("validations.passwordPattern"),
});

export const requiredValidation = "validations.required";

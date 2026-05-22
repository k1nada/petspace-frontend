"use client";

import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import styles from "./SignUp.module.scss";
import { useForm } from "react-hook-form";
import {
  emailValidationMax,
  emailValidationPattern,
  passwordValidationMax,
  passwordValidationMin,
  passwordValidationPattern,
  requiredValidation,
  usernameValidationMax,
  usernameValidationMin,
  usernameValidationPattern,
} from "@/constants/validations";
import { useTranslations } from "next-intl";
import { Input } from "@/app/uikit/form/Input/Input";
import { Button } from "@/app/uikit/form/Button/Button";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { FormField } from "@/app/uikit/form/FormField/FormField";
import api from "@/config/axios";
import { SignUpData } from "@/types";

export const SignUp = () => {
  const t = useTranslations();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>();

  const handleError = (e: unknown) => {
    if (!isAxiosError(e)) return;
    const type = e.response?.data?.type;
    if (type === "EMAIL_ALREADY_EXISTS")
      toast.error(t("errors.EMAIL_ALREADY_EXISTS"));
    if (type === "USERNAME_ALREADY_EXISTS")
      toast.error(t("errors.USERNAME_ALREADY_EXISTS"));
  };

  const onSubmit = async (data: SignUpData) => {
    try {
      const {
        data: { token, user },
      } = await api.post("/signup", data);

      if (!user?.username) {
        toast.error(t("toast.error"));
        return;
      }

      localStorage.setItem("token", token);
      router.push(ROUTES.registrationSteps);
    } catch (e) {
      handleError(e);
    }
  };

  const onSignIn = () => router.push(ROUTES.signin);

  return (
    <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1 className={styles.title}>{t("signUp.title")}</h1>
        <p className={styles.subtitle}>{t("signUp.subtitle")}</p>
      </div>
      <div className={styles.fields}>
        <FormField
          id="name"
          label={t("signUp.name")}
          hint={t("signUp.displayNameHint")}
          error={errors.name?.message}
        >
          <Input
            {...register("name", {
              required: t(requiredValidation),
              minLength: usernameValidationMin(t),
              maxLength: usernameValidationMax(t),
              pattern: usernameValidationPattern(t),
            })}
            id="name"
            type="text"
            appearance="primary"
          />
        </FormField>

        <FormField
          id="username"
          label={t("signUp.username")}
          hint={t("signUp.displayUsernameHint")}
          error={errors.username?.message}
        >
          <Input
            {...register("username", {
              required: t(requiredValidation),
              minLength: usernameValidationMin(t),
              maxLength: usernameValidationMax(t),
              pattern: usernameValidationPattern(t),
            })}
            id="username"
            type="text"
            appearance="primary"
          />
        </FormField>

        <FormField
          id="email"
          label={t("signUp.email")}
          error={errors.email?.message}
        >
          <Input
            {...register("email", {
              required: t(requiredValidation),
              maxLength: emailValidationMax(t),
              pattern: emailValidationPattern(t),
            })}
            id="email"
            type="email"
            appearance="primary"
          />
        </FormField>

        <FormField
          id="password"
          label={t("signUp.password")}
          error={errors.password?.message}
        >
          <Input
            {...register("password", {
              required: t(requiredValidation),
              minLength: passwordValidationMin(t),
              maxLength: passwordValidationMax(t),
              pattern: passwordValidationPattern(t),
            })}
            id="password"
            type="password"
            appearance="primary"
          />
        </FormField>

        <div className={styles.buttons}>
          <Button type="submit" appearance="primary">
            {t("signUp.createAccount")}
          </Button>
          <Button type="button" appearance="secondary" onClick={onSignIn}>
            {t("signUp.haveAccount")}
          </Button>
        </div>
      </div>
    </form>
  );
};

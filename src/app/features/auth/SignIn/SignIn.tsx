"use client";

import { useRouter } from "next/navigation";
import styles from "./SignIn.module.scss";
import { SignInData } from "@/types";
import {
  emailValidationPattern,
  signInValidationMax,
  signInValidationMin,
  passwordValidationMax,
  passwordValidationMin,
  requiredValidation,
} from "@/constants/validations";
import { ROUTES } from "@/routes/routes";
import { useTranslations } from "next-intl";
import { ErrorMessage } from "@/app/uikit/form/ErrorMessage/ErrorMessage";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Input } from "@/app/uikit/form/Input/Input";
import { Button } from "@/app/uikit/form/Button/Button";
import { toast } from "react-toastify";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "@/config/axios";

export const SignIn = () => {
  const t = useTranslations();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInData>();

  const goToSignUp = () => router.push(ROUTES.signup);

  const onSubmit = async (data: SignInData) => {
    try {
      const response = await api.post("/signin", data);
      const { token, user } = response.data;

      if (!user?.username) {
        toast.error(t("toast.error"));
        return;
      }

      localStorage.setItem("token", token);
      router.push(ROUTES.profile(user.username));
    } catch {
      toast.error(t("errors.INVALID_CREDENTIALS"));
    }
  };

  return (
    <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1 className={styles.title}>{t("signin.title")}</h1>
        <p className={styles.subtitle}>{t("signin.subtitle")}</p>
      </div>
      <div className={styles.inputsWrapper}>
        <Input
          {...register("email", {
            required: t(requiredValidation),
            minLength: signInValidationMin(t),
            maxLength: signInValidationMax(t),
            pattern: emailValidationPattern(t),
          })}
          type="text"
          appearance="primary"
          placeholder={t("signin.email")}
          autoComplete="email"
        />

        {errors.email?.message && (
          <ErrorMessage message={errors.email?.message} />
        )}

        <div className={styles.password}>
          <Input
            {...register("password", {
              required: t(requiredValidation),
              minLength: passwordValidationMin(t),
              maxLength: passwordValidationMax(t),
            })}
            type={showPassword ? "text" : "password"}
            appearance="primary"
            className={styles.passwordInput}
            placeholder={t("signin.password")}
            autoComplete="current-password"
          />
          <Button
            appearance="ghost"
            className={styles.passwordButton}
            onClick={() => setShowPassword((p) => !p)}
          >
            <div className={styles.icon}>
              {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </div>
          </Button>
        </div>

        {errors.password?.message && (
          <ErrorMessage message={errors.password?.message} />
        )}
      </div>
      <Button type="submit" appearance="primary">
        {t("signin.submit")}
      </Button>
      <Link
        href={ROUTES.forgotPassword}
        appearance="primary"
        className={styles.forgotPassword}
      >
        {t("signin.forgotPassword")}
      </Link>
      <div className={styles.formDivider}>
        <span>{t("common.or")}</span>
      </div>
      <Button type="button" appearance="secondary" onClick={goToSignUp}>
        {t("signin.createAccount")}
      </Button>
    </form>
  );
};

export default SignIn;

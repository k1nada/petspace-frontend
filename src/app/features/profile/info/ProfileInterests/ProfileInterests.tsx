"use client";

import styles from "./ProfileInterests.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "@/config/axios";
import { BannerInfo } from "@/types";

interface ProfileInterestsProps {
  user: BannerInfo;
}

interface InterestsForm {
  toys: string;
  treats: string;
  activities: string;
  crimes: string;
  habits: string;
  humans: string;
}

export const ProfileInterests = ({ user }: ProfileInterestsProps) => {
  const t = useTranslations();

  const { register, handleSubmit, reset } = useForm<InterestsForm>({
    defaultValues: {
      toys: user.interests?.favoriteToys ?? "",
      treats: user.interests?.favoriteTreats ?? "",
      activities: user.interests?.favoriteActivities ?? "",
      crimes: user.interests?.crimes ?? "",
      habits: user.interests?.guiltyHabits ?? "",
      humans: user.interests?.humans ?? "",
    },
  });

  const onSubmit = async (data: InterestsForm) => {
    try {
      await api.put(`/user/${user.username}`, {
        interests: {
          favoriteToys: data.toys,
          favoriteTreats: data.treats,
          favoriteActivities: data.activities,
          crimes: data.crimes,
          guiltyHabits: data.habits,
          humans: data.humans,
        },
      });
      toast.success(t("toasts.saved"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>{t("profileInterests.title")}</h1>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileInterests.toys")}</label>
          <Textarea
            appearance="primary"
            {...register("toys")}
            maxLength={300}
            placeholder={t("profileInterests.toysPlaceholder")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileInterests.treats")}</label>
          <Textarea
            appearance="primary"
            {...register("treats")}
            maxLength={300}
            placeholder={t("profileInterests.treatsPlaceholder")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            {t("profileInterests.activities")}
          </label>
          <Textarea
            appearance="primary"
            {...register("activities")}
            maxLength={300}
            placeholder={t("profileInterests.activitiesPlaceholder")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileInterests.crimes")}</label>
          <Textarea
            appearance="primary"
            {...register("crimes")}
            maxLength={300}
            placeholder={t("profileInterests.crimesPlaceholder")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileInterests.habits")}</label>
          <Textarea
            appearance="primary"
            {...register("habits")}
            maxLength={300}
            placeholder={t("profileInterests.habitsPlaceholder")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileInterests.humans")}</label>
          <Textarea
            appearance="primary"
            {...register("humans")}
            maxLength={300}
            placeholder={t("profileInterests.humansPlaceholder")}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" type="submit">
          {t("common.save")}
        </Button>
        <Button appearance="secondary" type="button" onClick={() => reset()}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
};

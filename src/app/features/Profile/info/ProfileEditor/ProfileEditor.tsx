import styles from "./ProfileEditor.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { DatePicker } from "@/app/uikit/form/DatePicker/DatePicker";
import { AvatarEdit } from "@/app/uikit/user/AvatarEdit/AvatarEdit";
import { toast } from "react-toastify";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { updateProfile } from "@/app/api/profile";
import { getBreeds } from "@/app/api/breeds";
import { getCities, getCountries } from "@/app/api/locations";
import { Combobox } from "@/app/uikit/form/Combobox/Combobox";
import { Select } from "@/app/uikit/form/Select/Select";
import { BannerInfo } from "@/types";

interface ProfileEditorProps {
  user: BannerInfo;
}

interface ProfileForm {
  bio: string;
  gender: string;
  birthDate?: Date | string;
  country: string;
  city: string;
  breed: string;
}

export const ProfileEditor = ({ user }: ProfileEditorProps) => {
  const t = useTranslations();
  const [breeds, setBreeds] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  const { handleSubmit, control, setValue, reset } = useForm<ProfileForm>({
    defaultValues: {
      bio: user.bio ?? "",
      gender: user.gender ?? "",
      birthDate: user.birthDate,
      country: user.country ?? "",
      city: user.city ?? "",
      breed: user.breed ?? "",
    },
  });

  const selectedCountry = useWatch({ control, name: "country" });

const onSubmit = async (data: ProfileForm) => {
  try {
    await updateProfile(user.username, data as any);
    toast.success(t("toasts.saved"));
  } catch {
    toast.error(t("toasts.error"));
  }
};

  useEffect(() => {
    getBreeds().then(setBreeds);
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    getCities(selectedCountry).then(setCities);
  }, [selectedCountry]);

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>{t("profileEditor.title")}</h1>
      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <AvatarEdit
            src={user.avatar}
            size={120}
            avatarPhotos={user.avatarPhotos}
          />
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.name}>{user.name}</h2>
          <div className={styles.username}>Username: @{user.username}</div>
        </div>
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileEditor.bio")}</label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Textarea appearance="primary" {...field} maxLength={150} />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileEditor.birthday")}</label>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileEditor.gender")}</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "male", label: t("gender.male") },
                  { value: "female", label: t("gender.female") },
                ]}
                placeholder={t("placeholder.noneSelected")}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileEditor.country")}</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Combobox
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("city", "");
                }}
                options={countries}
                placeholder={t("placeholder.noneSelected")}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileEditor.city")}</label>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Combobox
                value={field.value}
                onChange={field.onChange}
                disabled={!selectedCountry}
                options={cities}
                placeholder={t("placeholder.noneSelected")}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("profileEditor.breed")}</label>
          <Controller
            control={control}
            name="breed"
            render={({ field }) => (
              <Combobox
                value={field.value}
                onChange={field.onChange}
                options={breeds}
                placeholder={t("placeholder.noneSelected")}
              />
            )}
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

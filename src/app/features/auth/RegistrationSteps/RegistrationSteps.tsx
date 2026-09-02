"use client";

import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./RegistrationSteps.module.scss";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/app/uikit/form/DatePicker/DatePicker";
import dayjs, { type Dayjs } from "@/utils/dayjs";
import { toast } from "react-toastify";
import { useBreeds } from "@/app/hooks/shared/useBreeds";
import { useCities, useCountries } from "@/app/hooks/shared/useLocationOptions";
import { updateRegistrationSteps } from "@/services/api/auth";
import { Combobox } from "@/app/uikit/form/Combobox/Combobox";
import { Select } from "@/app/uikit/form/Select/Select";

interface RegistrationStepsProps {
  birthDate?: number;
  sex?: string;
  country?: string;
  city?: string;
  breed?: string;
}

const RegistrationSteps = ({
  birthDate,
  sex,
  country,
  city,
  breed,
}: RegistrationStepsProps) => {
  const t = useTranslations();
  const router = useRouter();

  const [sexValue, setsexValue] = useState(sex ?? "");
  const [selectedAge, setSelectedAge] = useState<Dayjs | undefined>(
    birthDate ? dayjs(birthDate) : undefined,
  );
  const [selectedBreed, setSelectedBreed] = useState(breed ?? "");
  const [selectedCity, setSelectedCity] = useState(city ?? "");
  const [selectedCountry, setSelectedCountry] = useState(country ?? "");
  const breeds = useBreeds();
  const countries = useCountries();
  const cities = useCities(selectedCountry);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedCity("");
  };

  const skipRegistration = () => {
    router.push(ROUTES.registrationStepsAvatar);
  };

  const saveChanges = async () => {
    try {
      await updateRegistrationSteps({
        sex: sexValue,
        birthDate: selectedAge?.valueOf(),
        country: selectedCountry,
        city: selectedCity,
        breed: selectedBreed,
      });
      router.push(ROUTES.registrationStepsAvatar);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <form className={styles.form}>
      <div className={styles.fields}>
        <div>
          <h2 className={styles.title}>{t("registrationSteps.title")}</h2>
          <p className={styles.subtitle}>{t("registrationSteps.subtitle")}</p>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("fields.sex")}</label>
          <Select
            value={sexValue}
            onChange={setsexValue}
            options={[
              { value: "male", label: t("sex.male") },
              { value: "female", label: t("sex.female") },
            ]}
            placeholder={t("placeholder.noneSelected")}
          ></Select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("fields.birthday")}</label>
          <DatePicker
            value={selectedAge}
            onChange={setSelectedAge}
          ></DatePicker>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("fields.country")}</label>
          <Combobox
            value={selectedCountry}
            onChange={handleCountryChange}
            options={countries}
            placeholder={t("placeholder.noneSelected")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("fields.city")}</label>
          <Combobox
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities}
            placeholder={t("placeholder.noneSelected")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("fields.breed")}</label>
          <Combobox
            value={selectedBreed}
            onChange={setSelectedBreed}
            options={breeds}
            placeholder={t("placeholder.noneSelected")}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" type="button" onClick={saveChanges}>
          {t("common.continue")}
        </Button>
        <Button appearance="secondary" type="button" onClick={skipRegistration}>
          {t("common.skip")}
        </Button>
      </div>
    </form>
  );
};

export default RegistrationSteps;

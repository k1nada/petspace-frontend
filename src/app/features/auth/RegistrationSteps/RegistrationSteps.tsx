import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./RegistrationSteps.module.scss";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import { DatePicker } from "@/app/uikit/form/DatePicker/DatePicker";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import { getBreeds } from "@/app/api/breeds";
import { getCities, getCountries } from "@/app/api/locations";
import api from "@/config/axios";
import { Combobox } from "@/app/uikit/form/Combobox/Combobox";
import { Select } from "@/app/uikit/form/Select/Select";

interface RegistrationStepsProps {
  username: string;
  birthDate?: number;
  sex?: string;
  country?: string;
  city?: string;
  breed?: string;
}

const RegistrationSteps = ({
  username,
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
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(breed ?? "");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(city ?? "");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(country ?? "");

  useEffect(() => {
    getBreeds().then(setBreeds);
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    getCities(selectedCountry).then(setCities);
  }, [selectedCountry]);

  const skipRegistration = () => {
    router.push(ROUTES.registrationStepsAvatar);
  };

  const saveChanges = async () => {
    try {
      await api.put(`/user/${username}`, {
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
      <div>
        <div className={styles.tag}>{t("registrationSteps.step")}</div>
      </div>
      <div className={styles.fields}>
        <div>
          <h2 className={styles.title}>{t("registrationSteps.title")}</h2>
          <p className={styles.subtitle}>{t("registrationSteps.subtitle")}</p>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("registrationSteps.sex")}</label>
          {/* TODO */}
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
          <label className={styles.label}>
            {t("registrationSteps.birthday")}
          </label>
          <DatePicker
            value={selectedAge}
            onChange={setSelectedAge}
          ></DatePicker>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            {t("registrationSteps.country")}
          </label>
          <Combobox
            value={selectedCountry}
            onChange={setSelectedCountry}
            options={countries}
            placeholder={t("placeholder.noneSelected")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("registrationSteps.city")}</label>
          <Combobox
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities}
            placeholder={t("placeholder.noneSelected")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("registrationSteps.breed")}</label>
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

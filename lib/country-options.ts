import type { LocaleData } from "i18n-iso-countries";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale as LocaleData);

const raw = countries.getNames("en", { select: "official" });

export const COUNTRY_OPTIONS = Object.entries(raw)
  .map(([code, label]) => ({ code, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "en"));

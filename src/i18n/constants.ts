import { LanguageConfig, SupportedLocale } from "./types.ts"

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "world" },
  { code: "zh_CN", name: "Chinese", nativeName: "简体中文", flag: "CN" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "CZ" },
  { code: "en", name: "English", nativeName: "English", flag: "GB" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "EE" },
  { code: "fil", name: "Filipino", nativeName: "Filipino", flag: "PH" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "FI" },
  { code: "fr", name: "French", nativeName: "Français", flag: "FR" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "DE" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "IN" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "IL" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "HU" },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "ID",
  },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "IT" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "JP" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "KR" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "LV" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "LT" },
  {
    code: "pt_BR",
    name: "Portuguese (Brazil)",
    nativeName: "Português",
    flag: "BR",
  },
  {
    code: "pt_PT",
    name: "Portuguese (Portugal)",
    nativeName: "Português",
    flag: "PT",
  },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "RO" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "RU" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "RS" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "SK" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "ES" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "SE" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "TR" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "UA" },
]

export const DEFAULT_LOCALE: SupportedLocale = "en"

export const RTL_LOCALES: SupportedLocale[] = ["ar", "he"]

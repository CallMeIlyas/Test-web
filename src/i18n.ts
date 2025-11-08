import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// === Import file terjemahan ===
import header_id from "./locales/id/header.json";
import header_en from "./locales/en/header.json";

import hero_id from "./locales/id/hero.json";
import hero_en from "./locales/en/hero.json";

import bestSelling_id from "./locales/id/bestSelling.json";
import bestSelling_en from "./locales/en/bestSelling.json";

import orderSteps_id from "./locales/id/orderSteps.json";
import orderSteps_en from "./locales/en/orderSteps.json";

import gallery_id from "./locales/id/gallery.json"
import gallery_en from "./locales/en/gallery.json"

import footer_id from "./locales/id/footer.json"
import footer_en from "./locales/en/footer.json"


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        translation: {
          header: header_id,
          hero: hero_id,
          bestSelling: bestSelling_id,
          orderSteps: orderSteps_id,
          gallery: gallery_id,
          footer: footer_id
        }
      },
      en: {
        translation: {
          header: header_en,
          hero: hero_en,
          bestSelling: bestSelling_en,
          orderSteps: orderSteps_en,
          gallery: gallery_en,
          footer_en
        }
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "querystring"],
      caches: ["localStorage"]
    }
  });

// 🌏 Auto detect lokasi user (optional)
(async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    // 🇮🇩 Kalau user bukan dari Indonesia → ubah ke English
    if (data.country_code !== "ID") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("id");
    }
  } catch (err) {
    console.warn("Gagal mendeteksi lokasi user:", err);
    i18n.changeLanguage("en");
  }
})();

export default i18n;
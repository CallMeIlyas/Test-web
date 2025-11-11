import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// === Import file terjemahan ===
// home
import header_id from "./locales/id/home/header.json";
import header_en from "./locales/en/home/header.json";

import hero_id from "./locales/id/home/hero.json";
import hero_en from "./locales/en/home/hero.json";

import bestSelling_id from "./locales/id/home/bestSelling.json";
import bestSelling_en from "./locales/en/home/bestSelling.json";

import orderSteps_id from "./locales/id/home/orderSteps.json";
import orderSteps_en from "./locales/en/home/orderSteps.json";

import gallery_id from "./locales/id/home/gallery.json";
import gallery_en from "./locales/en/home/gallery.json";

import footer_id from "./locales/id/home/footer.json";
import footer_en from "./locales/en/home/footer.json";

// product
import side_id from "./locales/id/product/side.json";
import side_en from "./locales/en/product/side.json";

import sort_id from "./locales/id/product/sort.json";
import sort_en from "./locales/en/product/sort.json";

import product_id from "./locales/id/product/product.json";
import product_en from "./locales/en/product/product.json";

import size_id from "./locales/id/sizeguide/size.json";
import size_en from "./locales/en/sizeguide/size.json";

// bg catalog
import sortBg_id from "./locales/id/bg/sortBg.json";
import sortBg_en from "./locales/en/bg/sortBg.json";

import sideBg_id from "./locales/id/bg/sideBg.json";
import sideBg_en from "./locales/en/bg/sideBg.json";

// location
import location_id from "./locales/id/location/location.json";
import location_en from "./locales/en/location/location.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        translation: {
          // home
          header: header_id,
          hero: hero_id,
          bestSelling: bestSelling_id,
          orderSteps: orderSteps_id,
          gallery: gallery_id,
          footer: footer_id,
          // product
          side: side_id,
          sort: sort_id,
          product: product_id,
          size: size_id,
          // bg catalog
          sortBg: sortBg_id,
          sideBg: sideBg_id,
          // location
          location: location_id,
        }
      },
      en: {
        translation: {
          // home
          header: header_en,
          hero: hero_en,
          bestSelling: bestSelling_en,
          orderSteps: orderSteps_en,
          gallery: gallery_en,
          footer: footer_en,
          // product
          side: side_en,
          sort: sort_en,
          product: product_en,
          size: size_en,
          // bg catalog
          sortBg: sortBg_en,
          sideBg: sideBg_en,
          // location 
          location: location_en,
        }
      }
    },
    fallbackLng: "en",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "querystring"],
      caches: ["localStorage"]
    }
  });

// auto detect user location
(async () => {
  const storedLang = localStorage.getItem("i18nextLng");

  if (!storedLang) {
    try {
      const res = await fetch("https://api.country.is/");
      const data = await res.json();

      // Ganti bahasa sesuai lokasi
      if (data.country !== "ID") {
        i18n.changeLanguage("en");
      } else {
        i18n.changeLanguage("id");
      }

      // Simpan hasil deteksi biar gak panggil API terus
      localStorage.setItem("i18nextLng", i18n.language);
    } catch (err) {
      console.warn("Gagal mendeteksi lokasi user:", err);
      i18n.changeLanguage("en");
    }
  }
})();

export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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
import location_en from "./locales/en/location/location.json";

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
          footer: footer_id,
          side: side_id,
          sort: sort_id,
          product: product_id,
          size: size_id,
          sortBg: sortBg_id,
          sideBg: sideBg_id,
          location: location_id
        }
      },
      en: {
        translation: {
          header: header_en,
          hero: hero_en,
          bestSelling: bestSelling_en,
          orderSteps: orderSteps_en,
          gallery: gallery_en,
          footer: footer_en,
          side: side_en,
          sort: sort_en,
          product: product_en,
          size: size_en,
          sortBg: sortBg_en,
          sideBg: sideBg_en,
          location: location_en
        }
      }
    },
    fallbackLng: "en",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    }
  });

// Auto detect country dan set language dengan multiple fallback APIs
const detectAndSetLanguage = async () => {
  // Jika user sudah manual pilih bahasa, jangan override
  const userSelectedLang = localStorage.getItem("i18nextLng");
  const hasUserManuallyChanged = localStorage.getItem("i18n-manual-change");
  
  if (hasUserManuallyChanged === "true") {
    return; // User sudah pernah manual ganti bahasa, jangan auto-detect lagi
  }

  // Coba deteksi dari timezone dulu (quick fallback)
  const detectFromTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Indonesia timezones
    if (timezone.includes("Jakarta") || 
        timezone.includes("Makassar") || 
        timezone.includes("Jayapura") ||
        timezone.includes("Pontianak")) {
      return "id";
    }
    return null;
  };

  const timezoneGuess = detectFromTimezone();

  // API endpoints untuk coba secara berurutan
  const apis = [
    {
      url: "https://ipapi.co/json/",
      parse: (data) => data.country_code === "ID" ? "id" : "en"
    },
    {
      url: "https://api.country.is/",
      parse: (data) => data.country === "ID" ? "id" : "en"
    },
    {
      url: "https://ipwhois.app/json/",
      parse: (data) => data.country_code === "ID" ? "id" : "en"
    }
  ];

  // Coba setiap API sampai ada yang berhasil
  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 detik timeout
      
      const res = await fetch(api.url, { 
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) continue; // Coba API berikutnya
      
      const data = await res.json();
      const detectedLang = api.parse(data);
      
      // Hanya ganti bahasa jika berbeda dengan yang sekarang
      if (i18n.language !== detectedLang) {
        await i18n.changeLanguage(detectedLang);
        localStorage.setItem("i18nextLng", detectedLang);
      }
      
      return; // Berhasil, keluar dari fungsi
    } catch (err) {
      console.warn(`API ${api.url} gagal:`, err.message);
      continue; // Coba API berikutnya
    }
  }

  // Jika semua API gagal, gunakan timezone guess
  if (timezoneGuess) {
    console.log("Menggunakan deteksi timezone sebagai fallback");
    await i18n.changeLanguage(timezoneGuess);
    localStorage.setItem("i18nextLng", timezoneGuess);
  } else if (!userSelectedLang) {
    // Ultimate fallback ke English
    console.log("Menggunakan English sebagai default");
    await i18n.changeLanguage("en");
  }
};

// Jalankan deteksi setelah i18n ready
if (i18n.isInitialized) {
  detectAndSetLanguage();
} else {
  i18n.on("initialized", detectAndSetLanguage);
}

export default i18n;
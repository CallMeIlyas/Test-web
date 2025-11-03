import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Render konten sedikit lebih cepat (biar no blank)
    const timer = setTimeout(() => setShowContent(true), 950);

    // 🚀 Kirim sinyal setelah animasi selesai (durasi 1.8s + sedikit buffer)
    const smootherTrigger = setTimeout(() => {
      window.dispatchEvent(new Event("pageTransition:done"));
    }, 1900); // ⏱️ kirim sinyal setelah overlay benar-benar keluar

    return () => {
      clearTimeout(timer);
      clearTimeout(smootherTrigger);
      setShowContent(false);
    };
  }, [location.pathname]);

  return (
    <div className="relative overflow-hidden">
      {/* 🎥 Overlay Transisi */}
      <AnimatePresence mode="wait">
        {/* Layer bawah (hitam) */}
        <motion.div
          key={location.pathname + "-black"}
          initial={{ y: "100%" }}
          animate={{ y: "-100%" }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 1.6,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="fixed top-0 left-0 w-full h-full bg-black z-[998]"
        />

        {/* Layer atas (beige) */}
        <motion.div
          key={location.pathname + "-beige"}
          initial={{ y: "100%" }}
          animate={{ y: "-100%" }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 1.8,
            ease: [0.77, 0, 0.175, 1],
            delay: 0.15,
          }}
          className="fixed top-0 left-0 w-full h-full bg-[#dcbec1] z-[999]"
        />
      </AnimatePresence>

      {/* 🪄 Konten halaman baru — fade-in smooth */}
      {showContent && (
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.3,
          }}
          className="relative z-0"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
import { motion } from "framer-motion";
import React from "react";

interface SlideUpTransitionProps {
  children: React.ReactNode;
}

const SlideUpTransition: React.FC<SlideUpTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ y: "100vh" }}       // mulai dari luar layar (bawah penuh)
      animate={{ y: 0 }}             // naik ke posisi normal
      exit={{ y: "-20vh", opacity: 0 }} // keluar sedikit ke atas
      transition={{
        duration: 1.6,               // 🕐 agak lebih lama biar lembut
        ease: [0.77, 0, 0.175, 1],   // kurva easing elegan, bukan linear
      }}
      className="min-h-screen w-full bg-white will-change-transform overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

export default SlideUpTransition;
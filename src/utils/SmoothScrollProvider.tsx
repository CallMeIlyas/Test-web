import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    // 🔥 Inisialisasi sekali saja
    if (!smootherRef.current) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 6.5,
        smoothTouch: 1.2,
        inertia: 1.3,
        speed: 0.6,
        normalizeScroll: true,
        ignoreMobileResize: true,
        effects: true,
      });

      gsap.ticker.fps(120);
      gsap.ticker.lagSmoothing(1500, 16);
      ScrollTrigger.refresh(true);
    }

    // 🚀 Refresh halus setiap transisi selesai
    const handleTransitionDone = () => {
      setTimeout(() => {
        smootherRef.current?.refresh();
        smootherRef.current?.scrollTo(0, false);
      }, 100);
    };

    window.addEventListener("pageTransition:done", handleTransitionDone);

    return () => {
      window.removeEventListener("pageTransition:done", handleTransitionDone);
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollProvider;
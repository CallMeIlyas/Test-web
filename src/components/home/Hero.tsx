import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import caricatureLogo from "../../assets/logo/caricature-3d.png";
import pakAndre from "../../assets/karya/pak-andre.jpg";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // ======= Deteksi Mobile / Desktop =======
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);
    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // ======= Animasi ScrollTrigger =======
  useEffect(() => {
  if (isMobile === null) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play none none reverse",
      },
      defaults: { ease: "power3.out" },
      delay: 1.1, // ⏳ sedikit lebih cepat mulai setelah header
    });

    // 🪶 Logo turun lembut dari atas
    tl.from(logoRef.current, {
      opacity: 0,
      y: -60,
      scale: 0.9,
      duration: 1.2, // ⏩ lebih cepat
      ease: "power2.out",
    });

    // ✍️ Teks muncul dari bawah
    tl.from(
      textRef.current,
      {
        opacity: 0,
        y: 35,
        duration: 1.0, // ⏩ lebih cepat
        ease: "power2.out",
      },
      "-=0.6"
    );

    // 🖼️ Gambar fade + parallax
    tl.from(
      imageRef.current,
      {
        opacity: 0,
        scale: 0.96,
        duration: 1.3, // ⏩ lebih cepat
        ease: "power2.out",
      },
      "-=0.7"
    );

    gsap.to(imageRef.current, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.1,
      },
    });
  });

  return () => ctx.revert();
}, [isMobile]);

  if (isMobile === null) return null;

  // ================= Desktop Layout =================
  const DesktopLayout = () => (
    <section
      ref={sectionRef}
      className="flex justify-between px-12 py-14 items-start gap-10"
    >
      <div className="max-w-[500px]">
        <img
          ref={logoRef}
          src={caricatureLogo}
          alt="Little Amora - Caricature 3D Frame"
          className="w-full max-w-[300px] mb-5"
        />
        <p
          ref={textRef}
          className="font-poppinsRegular text-[14px] leading-[1.7] text-[#444] max-w-[310px] text-justify"
        >
          Pop up frames are a type of handicraft that uses stacked paper so it has
          depth or it looks 3D. Starting from making digital caricature from photos,
          designing it with background based on the customer preferences. After that
          we print, cut, and assemble the paper layer by layer. Little Amora
          Caricature established since 2018. Our design characteristic we use is
          vector illustration, the body shown smaller and shorter so the faces can be
          more stand out.
        </p>
      </div>

      <div>
        <img
          ref={imageRef}
          src={pakAndre}
          alt="Caricature Frame"
          className="max-w-[1000px] w-full rounded-[10px]"
        />
      </div>
    </section>
  );

  // ================= Mobile Layout =================
  const MobileLayout = () => (
    <section
      ref={sectionRef}
      className="flex flex-col px-6 py-10 gap-4 items-center"
    >
      <img
        ref={logoRef}
        src={caricatureLogo}
        alt="Little Amora - Caricature 3D Frame"
        className="w-full max-w-[250px] mb-4"
      />
      <p
        ref={textRef}
        className="font-poppinsRegular text-[14px] leading-[1.6] text-[#444] text-justify"
      >
        Pop up frames are a type of handicraft that uses stacked paper so it has
        depth or it looks 3D. Starting from making digital caricature from photos,
        designing it with background based on the customer preferences. After that
        we print, cut, and assemble the paper layer by layer. Little Amora Caricature
        established since 2018. Our design characteristic we use is vector
        illustration, the body shown smaller and shorter so the faces can be more
        stand out.
      </p>
      <img
        ref={imageRef}
        src={pakAndre}
        alt="Caricature Frame"
        className="w-full max-w-[500px] rounded-[10px]"
      />
    </section>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Hero;
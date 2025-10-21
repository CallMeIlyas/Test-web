import { useState, useEffect } from "react";
import caricatureLogo from "../../assets/logo/caricature-3d.png";
import pakAndre from "../../assets/karya/pak-andre.jpg";

const Hero = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Gunakan matchMedia untuk deteksi lebar layar secara akurat
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Set nilai awal
    handleChange(mediaQuery);

    // Event listener (modern browser support)
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Hindari render sebelum status device diketahui
  if (isMobile === null) return null;

  // ================= Desktop Layout =================
  const DesktopLayout = () => (
    <section className="flex justify-between px-12 py-14 items-start gap-10">
      <div className="max-w-[500px]">
        <img
          src={caricatureLogo}
          alt="Little Amora - Caricature 3D Frame"
          className="w-full max-w-[300px] mb-5"
        />
        <p className="font-poppinsRegular text-[14px] leading-[1.7] text-[#444] max-w-[310px] text-justify">
          Pop up frames are a type of handicraft that uses stacked paper so it has depth or it looks 3D.
          Starting from making digital caricature from photos, designing it with background based on the customer preferences.
          After that we print, cut, and assemble the paper layer by layer.
          Little Amora Caricature established since 2018. Our design characteristic we use is vector illustration,
          the body shown smaller and shorter so the faces can be more stand out.
        </p>
      </div>

      <div>
        <img
          src={pakAndre}
          alt="Caricature Frame"
          className="max-w-[1000px] w-full rounded-[10px]"
        />
      </div>
    </section>
  );

  // ================= Mobile Layout =================
  const MobileLayout = () => (
    <section className="flex flex-col px-6 py-10 gap-4 items-center">
      <img
        src={caricatureLogo}
        alt="Little Amora - Caricature 3D Frame"
        className="w-full max-w-[250px] mb-4"
      />
      <p className="font-poppinsRegular text-[14px] leading-[1.6] text-[#444] text-justify">
        Pop up frames are a type of handicraft that uses stacked paper so it has depth or it looks 3D.
        Starting from making digital caricature from photos, designing it with background based on the customer preferences.
        After that we print, cut, and assemble the paper layer by layer.
        Little Amora Caricature established since 2018. Our design characteristic we use is vector illustration,
        the body shown smaller and shorter so the faces can be more stand out.
      </p>
      <img
        src={pakAndre}
        alt="Caricature Frame"
        className="w-full max-w-[500px] rounded-[10px]"
      />
    </section>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Hero;
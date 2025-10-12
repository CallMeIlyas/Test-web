import React from "react";
import Footer from "../components/home/Footer";
import LocationSection from "../components/location/LocationSection";
import JNELogo from "../assets/Icons/address/JNE.png";
import GOJEKLogo from "../assets/Icons/address/GOJEK.png";
import GRABLogo from "../assets/Icons/address/GRAB.png";
import PAXELLogo from "../assets/Icons/address/PAXEL.png";
import RAYSPEEDLogo from "../assets/Icons/address/RAYSPEED.png";

interface LocationData {
  city: string;
  description: string[];
  whatsapp: {
    number: string;
    name: string;
  };
  address: {
    name: string;
    lines: string[];
  };
  shippingMethods: {
    logo: string;
    name: string;
  }[];
}

const Location: React.FC = () => {
  const locations: LocationData[] = [
    {
      city: "Bogor",
      description: [
        "Our original production process based in Bogor.",
        "Currently offline store not available, only online store.",
        "Our team or customer can order courier to pickup from this address below.",
      ],
      whatsapp: {
        name: "Claresta",
        number: "6281373131988",
      },
      address: {
        name: "Little Amora Karikatur Pop Up Frame",
        lines: [
          "Bogor Park Residence no. D27",
          "Jl. R. E. Soemintadiredja, Pamoyanan",
          "Bogor Selatan, Kota Bogor, 16136",
        ],
      },
      shippingMethods: [
        { logo: JNELogo, name: "Regular, YES (Yakin Esok Sampai), Kargo" },
        { logo: GOJEKLogo, name: "Go-send Instant, Bike/Car" },
        { logo: GRABLogo, name: "Grabbike Instant, Bike/Car" },
        { logo: PAXELLogo, name: "Sameday, Instant" },
        { logo: RAYSPEEDLogo, name: "Regular, Express" },
      ],
    },
    {
      city: "Jakarta",
      description: [
        "Our team or customer can order courier to pickup from this address below.",
        "Please note, this address only for small or medium frame size,",
        "maximum 1 pcs 10R or 1 pcs 12R.",
      ],
      whatsapp: {
        name: "Benyamin",
        number: "62895601416518",
      },
      address: {
        name: "WTC Mangga Dua, Sapphire Auto",
        lines: [
          "Bursa Mobil, floor 3A block 63-65",
          "JI. Mangga Dua Raya No.8, RT.11/RW.5, Ancol,",
          "Kec. Pademangan, Jakarta Utara",
          "Daerah Khusus lbukota 14430",
        ],
      },
      shippingMethods: [
        { logo: GOJEKLogo, name: "Go-send Instant, Bike/Car" },
        { logo: GRABLogo, name: "Grabbike Instant, Bike/Car" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Location title with decorative lines */}
        <div className="relative my-10 text-center">
          <h1 className="inline-block px-5 text-4xl md:text-5xl font-nataliecaydence relative z-10">
            Location
          </h1>

          <div className="absolute top-1/2 left-0 w-[20%] border-t-4 border-black transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-[20%] border-t-4 border-black transform -translate-y-1/2"></div>
        </div>

        {locations.map((location, index) => (
          <LocationSection
            key={`${location.city}-${index}`}
            location={location}
            isLast={index === locations.length - 1}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Location;
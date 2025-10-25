import React from "react";
import Footer from "../components/home/Footer";
import LocationSection from "../components/location/LocationSection";

interface LocationData {
  city: string;
  gmapsLink?: string; 
  description: (string | React.ReactNode)[];
  whatsapp: {
    number: string;
    name: string;
  };
  address: {
    name: string;
    lines: string[];
  };
  shippingMethods: {
    courier: string;
    name: string;
  }[];
}

const Location: React.FC = () => {
  const locations: LocationData[] = [
    {
      city: "Bogor",
      gmapsLink: "https://share.google/3NK3xtA32ThyT5hxH",
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
        { courier: "JNE", name: "Regular, YES (Yakin Esok Sampai), Kargo" },
        { courier: "GOJEK", name: "Go-send Instant, Bike/Car" },
        { courier: "GRAB", name: "Grabbike Instant, Bike/Car" },
        { courier: "PAXEL", name: "Sameday, Instant" },
        { courier: "RAYSPEED", name: "Regular, Express" },
      ],
    },
    {
      city: "Jakarta",
      gmapsLink: "https://share.google/12ERghjGjZ2vg6dbK",
      description: [
        "Our team or customer can order courier to pickup from this address below.",
        "Please note, this address only for small or medium frame size,",
        <>
          maximum{" "}
          <span className="font-poppinsSemiBold">1 pcs 10R or 1 pcs 12R.</span>
        </>,
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
          "Daerah Khusus Ibukota 14430",
        ],
      },
      shippingMethods: [
        { courier: "GOJEK", name: "Go-send Instant, Bike" },
        { courier: "GRAB", name: "Grabbike Instant, Bike" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="relative my-8 mb-10 text-center">
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
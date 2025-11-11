import React from "react";
import { useTranslation } from "react-i18next";

import locationIcon from "../../assets/Icons/location.png";
import whatsappIcon from "../../assets/Icons/whatsapp.png";
import gmapsIcon from "../../assets/Icons/GMAPS.png";

import JNELogo from "../../assets/Icons/address/JNE.png";
import GOJEKLogo from "../../assets/Icons/address/GOJEK.png";
import GRABLogo from "../../assets/Icons/address/GRAB.png";
import PAXELLogo from "../../assets/Icons/address/PAXEL.png";
import RAYSPEEDLogo from "../../assets/Icons/address/RAYSPEED.png";

interface LocationSectionProps {
  location: {
    city: string;
    gmapsLink?: string;
    description: (string | React.ReactNode)[];
    whatsapp: {
      name: string;
      number: string;
    };
    address: {
      name: string;
      lines: string[];
    };
    shippingMethods: (string | { courier: string; name: string })[];
  };
  isLast: boolean;
}

const logoMap: Record<string, string> = {
  JNE: JNELogo,
  GOJEK: GOJEKLogo,
  GRAB: GRABLogo,
  PAXEL: PAXELLogo,
  RAYSPEED: RAYSPEEDLogo,
};

const logoSizeMap: Record<
  string,
  { width: string; height: string; translate?: string }
> = {
  JNE: { width: "w-[110px]", height: "h-auto", translate: "translate-x-[41px]" },
  GOJEK: { width: "w-[110px]", height: "h-auto", translate: "translate-x-[28px]" },
  GRAB: { width: "w-[110px]", height: "h-auto", translate: "translate-x-[43px]" },
  PAXEL: { width: "w-[110px]", height: "h-auto", translate: "translate-x-[29px]" },
  RAYSPEED: { width: "w-[150px]", height: "h-auto", translate: "translate-x-[8px]" },
};

const LocationSection: React.FC<LocationSectionProps> = ({ location, isLast }) => {
  const { t } = useTranslation();

  return (
    <div className={`mx-4 md:mx-16 ${!isLast ? "mb-20 pb-10" : "mb-8"}`}>
      {/* 📍 Location Info */}
      <div className="flex items-start gap-3">
        <img
          src={locationIcon}
          alt="Location"
          className="w-[80px] h-auto -mt-5 translate-x-4"
        />
        <div className="mt-1">
          {/* 🌍 Dynamic Language */}
          <div className="font-poppinsRegular text-2xl">
            {t("location.shippingFrom")}{" "}
            <span className="font-poppinsRegular font-semibold">
              {location.city}
            </span>
          </div>

          {/* 📝 Descriptions */}
          {location.description.map((line, index) => (
            <p key={index} className="text-lg my-[1px] leading-snug">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* 📞 Contact & Address */}
      <div className="mt-3 mx-auto w-full max-w-2xl">
        <div className="text-left">
          {/* WhatsApp Contact */}
          <div className="font-poppinsRegular flex items-center gap-2 translate-y-6 translate-x-4 mb-5 ml-32">
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="w-[50px] h-auto translate-x-3"
            />
            <span className="text-lg">
              {location.whatsapp.name} {location.whatsapp.number}
            </span>
          </div>

          {/* Address Block */}
          <div className="flex items-start gap-3">
            <a
              href={location.gmapsLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={gmapsIcon}
                alt="Google Maps"
                className="w-40 h-auto cursor-pointer transition-transform duration-200 hover:scale-105"
              />
            </a>

            <div>
              <span className="font-poppinsSemiBold">{location.address.name}</span>
              {location.address.lines.map((line, index) => (
                <p key={index} className="font-poppinsRegular text-lg">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🚚 Shipping Methods */}
      <div className="border border-gray-600 rounded-[30px] p-4 max-w-xl mt-8 mx-auto">
        {location.shippingMethods.map((method, index) => {
          const courierName =
            typeof method === "string"
              ? method.split(" ")[0].toUpperCase()
              : method.courier.toUpperCase();

          const logoSrc = logoMap[courierName];
          const logoSize = logoSizeMap[courierName] || {
            width: "w-24",
            height: "h-auto",
            translate: "",
          };

          return (
            <div
              key={index}
              className="flex items-center gap-3 mb-[6px] last:mb-0 min-h-[45px]"
            >
              <div className="flex items-center justify-center min-w-[130px] h-[45px]">
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={courierName}
                    className={`${logoSize.width} ${logoSize.height} ${logoSize.translate || ""}`}
                  />
                )}
              </div>
              <span
                className={`font-poppinsRegular text-sm leading-[1] block ${
                  typeof method === "object" && method.name.includes("Regular, Express")
                    ? "translate-x-5"
                    : "translate-x-10"
                }`}
              >
                {typeof method === "object" ? method.name : method}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSection;
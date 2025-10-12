import React from "react";
import locationIcon from "../../assets/Icons/location.png";
import whatsappIcon from "../../assets/Icons/whatsapp.png";
import gmapsIcon from "../../assets/Icons/GMAPS.png";

interface LocationSectionProps {
  location: {
    city: string;
    description: string[];
    whatsapp: {
      name: string;
      number: string;
    };
    address: {
      name: string;
      lines: string[];
    };
    shippingMethods: {
      logo: string;
      name: string;
    }[];
  };
  isLast: boolean;
}

const LocationSection: React.FC<LocationSectionProps> = ({ location, isLast }) => {
  return (
    <div className={`mx-4 md:mx-16 ${!isLast ? "mb-16 pb-16" : "mb-8"}`}>
      {/* Location info */}
      <div className="flex items-start gap-1">
        <img
          src={locationIcon}
          alt="Location"
          className="w-12 h-10 -mt-0.5 ml-10"
        />
        <div>
          <div className="font-poppinsRegular text-2xl">
            Shipped from{" "}
            <span className="font-poppinsBold font-bold">{location.city}</span>
          </div>
          {location.description.map((line, index) => (
            <p key={index} className="text-lg my-1">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div className="mt-8 pl-16 md:pl-32">
        {/* WhatsApp */}
        <div className="font-poppinsRegular flex items-center gap-2 translate-y-6 translate-x-6 mb-5 ml-32">
          <img
            src={whatsappIcon}
            alt="WhatsApp"
            className="w-[43px] h-auto translate-x-3"
          />
          <span className="text-lg">
            {location.whatsapp.name} {location.whatsapp.number}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <img src={gmapsIcon} alt="Google Maps" className="w-40 h-auto" />
          <div>
            <span className="font-poppinsBold font-bold">
              {location.address.name}
            </span>
            {location.address.lines.map((line, index) => (
              <p key={index} className="font-poppinsRegular text-lg">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Shipping methods */}
      <div className="border border-gray-300 rounded-xl p-4 max-w-md mx-auto mt-8">
        {location.shippingMethods.map((method, index) => (
          <div key={index} className="flex items-center gap-3 mb-3 last:mb-0">
            <img
              src={method.logo}
              alt={method.name.split(",")[0].trim()}
              className="w-20 h-auto"
            />
            <span className="font-poppinsRegular text-sm">{method.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSection;
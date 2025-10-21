import React from "react";
import Footer from "../components/home/Footer";
import ShopeeIcon from "../assets/icon-contact/shopee.png";
import GmailIcon from "../assets/icon-contact/gmail.png";
import GMapsIcon from "../assets/icon-contact/gmaps.png";
import IGIcon from "../assets/icon-contact/IG.png";
import TikTokIcon from "../assets/icon-contact/TIKTOK.png";
import WhatsAppIcon from "../assets/icon-contact/whatsapp.png";

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Split Border Title */}
      <div className="relative my-8 mb-10 text-center">
        <h1 className="inline-block px-5 text-4xl md:text-5xl font-nataliecaydence relative z-10">
          Contact Us
        </h1>
        <div className="absolute top-1/2 left-0 w-[20%] border-t-4 border-black transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-[20%] border-t-4 border-black transform -translate-y-1/2"></div>
      </div>

      {/* Main Content */}
      <main className="flex flex-col gap-4 items-center pb-8">
        {/* Shopee */}
        <a
          href="https://id.shp.ee/FGfGHup"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <img src={ShopeeIcon} alt="Shopee Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Shopee</span>
            <span className="font-poppinsRegular">littleamorakarikatur</span>
          </div>
        </a>

        {/* Gmail */}
        <a
          href="mailto:littleamoradesign@gmail.com"
          className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <img src={GmailIcon} alt="Gmail Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Gmail</span>
            <span className="font-poppinsRegular">littleamoradesign@gmail.com</span>
          </div>
        </a>

        {/* Google Maps */}
        <a
          href="https://share.google/3NK3xtA32ThyT5hxH"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <img src={GMapsIcon} alt="Maps Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Google Maps</span>
            <span className="font-poppinsRegular">Little Amora Karikatur</span>
          </div>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/alittleamora"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <img src={IGIcon} alt="Instagram Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Instagram</span>
            <span className="font-poppinsRegular">@alittleamora</span>
          </div>
        </a>

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@alittleamora"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <img src={TikTokIcon} alt="TikTok Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">TikTok</span>
            <span className="font-poppinsRegular">@alittleamora</span>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/6281380340307"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <img src={WhatsAppIcon} alt="WhatsApp Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">WhatsApp</span>
            <span className="font-poppinsRegular">+6281380340307</span>
          </div>
        </a>

        {/* Deskripsi */}
        <div className="font-poppinsRegular text-justify mb-[100px] mt-8 max-w-[700px] text-center leading-relaxed text-[15px]">
          <p className="mb-4">
            <strong>All discussion and order</strong> available on WhatsApp only.  
            Our social media used for gallery purpose. Email or Google Drive used for  
            transferring big size data. Our team do not reply and open discussion on any  
            platform besides WhatsApp.
          </p>

          <p>
            Please note for all payment only on behalf of   
            <strong> Claresta</strong> or <strong>Little Amora Karikatur</strong>, please  
            ensure to copy the payment info directly on the chat that our team gave to the  
            customer. For worldwide shipping our team used Paypal, please contact us for  
            further information.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
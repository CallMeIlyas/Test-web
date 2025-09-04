import React from 'react';
import Footer from '../components/home/Footer';

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Split Border Title */}
      <div className="relative text-center my-5 -translate-y-2.5">
        <h1 className="inline-block px-5 text-4xl font-nataliecaydence whitespace-nowrap relative top-px z-10">
          Contact us
        </h1>
        <div className="absolute top-1/2 left-0 w-[17%] border-t-4 border-black"></div>
        <div className="absolute top-1/2 right-0 w-[17%] border-t-4 border-black"></div>
      </div>

      {/* Main Content */}
      <main className="flex flex-col gap-4 items-center pb-8">
        {/* Shopee */}
        <div className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm">
          <img src="/src/assets/icon-contact/shopee.png" alt="Shopee Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Shopee</span>
            <span className="font-poppinsRegular">littleamorakarikatur</span>
          </div>
        </div>

        {/* Gmail */}
        <div className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm">
          <img src="/src/assets/icon-contact/gmail.png" alt="Gmail Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Gmail</span>
            <span className="font-poppinsRegular">littleamoradesign@gmail.com</span>
          </div>
        </div>

        {/* Google Maps */}
        <div className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm">
          <img src="/src/assets/icon-contact/gmaps.png" alt="Maps Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Google Maps</span>
            <span className="font-poppinsRegular">Little Amora Karikatur</span>
          </div>
        </div>

        {/* Instagram */}
        <div className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm">
          <img src="/src/assets/icon-contact/IG.png" alt="Instagram Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">Instagram</span>
            <span className="font-poppinsRegular">@alittleamora</span>
          </div>
        </div>

        {/* TikTok */}
        <div className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm">
          <img src="/src/assets/icon-contact/TIKTOK.png" alt="TikTok Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">TikTok</span>
            <span className="font-poppinsRegular">@alittleamora</span>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center w-full max-w-[420px] py-1 px-5 border-[1px] border-black rounded-full bg-white shadow-sm">
          <img src="/src/assets/icon-contact/whatsapp.png" alt="WhatsApp Logo" className="w-[80px] h-auto mr-4" />
          <div className="flex flex-col">
            <span className="font-poppinsBold text-[13px]">WhatsApp</span>
            <span className="font-poppinsRegular">+6281380340307</span>
          </div>
        </div>
        
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
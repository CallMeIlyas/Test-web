const Footer = () => {
  return (
    <footer className="w-full py-3 bg-[#dcbec1]">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-10">
        <img 
          src="/src/assets/logo/logo-amora-footer2.png" 
          alt="Little Amora Logo" 
          className="h-[86px] mb-4 md:mb-0"
        />
        <ul className="flex gap-5 md:gap-8 p-0 m-0">
          <li><a href="/terms" className="no-underline text-black font-poppinsBold whitespace-nowrap text-base">Terms of Service</a></li>
          <li><a href="/contact" className="no-underline text-black font-poppinsBold whitespace-nowrap text-base">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
import React, {useEffect, useState, useMemo, useRef } from "react";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";
import BCAIcon from "../assets/icon-bank/bca.png";
import TMRWIcon from "../assets/icon-bank/tmrw.png";
import AladinIcon from "../assets/icon-bank/aladin.png";
import DANAIcon from "../assets/icon-bank/dana.png";
import GopayIcon from "../assets/icon-bank/gopay.png";
import OVOIcon from "../assets/icon-bank/ovo.png";
import ShopeePayIcon from "../assets/icon-bank/shopeepay.png";
import { gsap } from "gsap";
import { generateInvoice } from "../utils/generateInvoice";


interface DateInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, name, placeholder, className }) => {
  const [inputType, setInputType] = useState('text');

  const handleFocus = () => {
    setInputType('date');
  };

  const handleBlur = () => {
    if (!value) {
      setInputType('text');
    }
  };

  return (
    <input
      type={inputType}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      name={name}
      placeholder={placeholder}
      className={className}
    />
  );
};



const ProductImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-16 h-16 rounded-md object-cover" />
);

const ProductName: React.FC<{ name: string }> = ({ name }) => (
  <h3 className="font-poppinsRegular text-[15px] w-[230px] truncate">
    {name}
  </h3>
);
const ProductPrice: React.FC<{ price: number }> = ({ price }) => (
    <span className="font-poppinsSemiBold mr-9">
      Rp{price.toLocaleString("id-ID")}
    </span>
);
// FRAME
const FrameVariantDropdown: React.FC<{ item: any; updateItemVariant: any }> = ({
  item,
  updateItemVariant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(item.variation || item.variationOptions?.[0] || "");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelected(value);
    updateItemVariant(item.cartId, value);
    setIsOpen(false);
  };

  return (
    <div className="w-[200px] ml-20 relative">
      {/* Tombol Variations */}
      <p
        onClick={toggleDropdown}
        className="font-poppinsRegular text-[15px] cursor-pointer select-none"
      >
        Variations:{" "}
        <span
          className={`inline-block text-[12px] transform scale-x-[1.5] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </p>

      {/* Label varian terpilih */}
      <p
        onClick={toggleDropdown}
        className="bg-white outline-none font-poppinsRegular text-[15px] cursor-pointer"
      >
        {selected}
      </p>

      {/* Container dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full mt-1 bg-white rounded-md border border-[#ddd] overflow-hidden z-10">
          <div className="max-h-[120px] overflow-y-auto py-1">
            {item.variationOptions?.map((opt: string) => (
              <p
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-2 py-[2px] cursor-pointer font-poppinsRegular text-[15px] hover:bg-[#f6f6f6] ${
                  opt === selected ? "text-[#a23728] font-poppinsSemiBold" : ""
                }`}
              >
                {opt}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// FACES
const FaceVariantDropdown: React.FC<{ item: any; updateItemVariant: any }> = ({
  item,
  updateItemVariant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(item.variation || "1–9 wajah");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelected(value);
    updateItemVariant(item.cartId, value);
    setIsOpen(false);
  };

  return (
    <div className="w-[200px] ml-20 relative">
      <p
        onClick={toggleDropdown}
        className="font-poppinsRegular text-[15px] cursor-pointer select-none"
      >
        Variations:{" "}
        <span
          className={`inline-block text-[12px] transform scale-x-[1.5] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </p>

      <p
        onClick={toggleDropdown}
        className="bg-white outline-none font-poppinsRegular text-[15px] cursor-pointer"
      >
        {selected}
      </p>

      {isOpen && (
        <div className="absolute left-0 top-full w-full mt-1 bg-white rounded-md border border-[#ddd] overflow-hidden z-10">
          <div className="max-h-[120px] overflow-y-auto py-1">
            {["1–9 wajah", "Di atas 10 wajah"].map((opt) => (
              <p
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-2 py-[2px] cursor-pointer hover:bg-[#f6f6f6] font-poppinsRegular text-[15px] ${
                  opt === selected ? "text-[#a23728] font-poppinsSemiBold" : ""
                }`}
              >
                {opt}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// BACKGROUND
const BackgroundVariantDropdown: React.FC<{ item: any; updateItemVariant: any }> = ({
  item,
  updateItemVariant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [selected, setSelected] = useState(
  item.variation || item.attributes?.backgroundType || "BG Default"
);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelected(value);
    updateItemVariant(item.cartId, value);
    setIsOpen(false);
  };

  return (
    <div className="w-[200px] ml-20 relative">
      <p
        onClick={toggleDropdown}
        className="font-poppinsRegular text-[15px] cursor-pointer select-none"
      >
        Variations:{" "}
        <span
          className={`inline-block text-[12px] transform scale-x-[1.5] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </p>

      <p
        onClick={toggleDropdown}
        className="bg-white outline-none font-poppinsRegular text-[15px] cursor-pointer"
      >
        {selected}
      </p>

      {isOpen && (
        <div className="absolute left-0 top-full w-full mt-1 bg-white rounded-md border border-[#ddd] overflow-hidden z-10">
          <div className="max-h-[100px] overflow-y-auto py-1">
            {["BG Default", "BG Custom"].map((opt) => (
              <p
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-2 py-[2px] cursor-pointer hover:bg-[#f6f6f6] font-poppinsRegular text-[15px] ${
                  opt === selected ? "text-[#a23728] font-poppinsSemiBold" : ""
                }`}
              >
                {opt}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ShoppingCart: React.FC = () => {
  const { cart, updateQuantity, deleteItem, updateItemVariant } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // STATE UNTUK MENGELOLA SEMUA DATA FORM INVOICE
  const [invoiceData, setInvoiceData] = useState({
    companyName: "",
    contactPerson: "",
    orderVia: "",
    paymentDate: "", // State untuk tanggal pembayaran
    estimatedArrival: "",
    paymentMethod: "",
  });

  // Handler generik untuk memperbarui state form
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika untuk submit form, misalnya kirim data ke API
    console.log("Invoice data submitted:", invoiceData);
    alert("Invoice data has been submitted! (Check console)");
  };

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    cart.forEach((item) => {
      const key = item.parentCartId || item.cartId;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [cart]);

  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedItems([]);
    else setSelectedItems(cart.map((item) => item.cartId));
  };

  const totalPrice = cart
    .filter((item) => selectedItems.includes(item.cartId))
    .reduce((total, item) => total + item.price * item.quantity, 0);
    
const [showCheckout, setShowCheckout] = useState(false);
const checkoutRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (showCheckout && checkoutRef.current) {
    gsap.fromTo(
      checkoutRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }
}, [showCheckout]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-6 md:px-16 py-10 space-y-10">
        
        {/* Box Cart */}
        <div className="rounded-[30px] border border-black p-6 bg-white shadow-sm">
        {cart.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            <>
              {/* Select All Atas */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span className="font-poppinsSemiBold">
                  Select All ({cart.length})
                </span>
              </div>
              {Object.values(groupedItems).map((group: any[], idx) => (
                <div key={idx} className="mb-6 pb-6 last:pb-0">
                  {group.map((item) => (
                    <div
                      key={item.cartId}
                      className="flex items-center justify-between py-3"
                    >
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={selectedItems.includes(item.cartId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.cartId]);
                          } else {
                            setSelectedItems(
                              selectedItems.filter((id) => id !== item.cartId)
                            );
                          }
                        }}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <ProductImage src={item.imageUrl} alt={item.name} />
                        <ProductName name={item.name} />
                        {item.attributes?.isFace ? (
                          <FaceVariantDropdown
                            item={item}
                            updateItemVariant={updateItemVariant}
                          />
                        ) : item.attributes?.isBackground ? (
                          <BackgroundVariantDropdown
                            item={item}
                            updateItemVariant={updateItemVariant}
                          />
                        ) : (
                          <FrameVariantDropdown
                            item={item}
                            updateItemVariant={updateItemVariant}
                          />
                        )}
                        <div className="flex-shrink-0 -translate-x-7">
                          <ProductPrice price={item.price} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center rounded-[30px] border border-black overflow-hidden">
                          <button
                            className="px-3 py-[0.1rem] border-r border-black"
                            onClick={() => updateQuantity(item.cartId, -1)}
                          >
                            -
                          </button>
                          <span className="px-4 py-[0.1rem]">
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-[0.1rem] border-l border-black"
                            onClick={() => updateQuantity(item.cartId, 1)}
                          >
                            +
                          </button>
                        </div>
                        <p className="w-28 text-right font-bold text-red-600">
                          Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                        <button
                          className="font-poppinsRegular"
                          onClick={() => deleteItem(item.cartId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                  <span className="font-poppinsSemiBold">
                    Select All ({cart.length})
                  </span>
                </label>
                <div className="text-right">
                  <p className="font-poppinsSemiBold">
                    Total ({selectedItems.length} items):{" "}
                    <span className="font-poppinsBold text-red-500">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section Payment & Invoice */}
        {/* Checkout Section */}
{!showCheckout ? (
  <div className="flex justify-end mt-6">
    <button
      onClick={() => setShowCheckout(true)}
      className="bg-[#dcbec1] text-black font-poppinsSemiBold text-[15px] px-5 py-2 rounded-full shadow-sm hover:opacity-90 transition"
    >
      Checkout
    </button>
  </div>
) : (
  <div ref={checkoutRef} className="grid md:grid-cols-2 gap-8 mt-8">
    {/* Payment Section */}
    <div>
      <h2 className="font-poppinsSemiBold text-[15px] mb-4 bg-[#dcbec1] translate-x-[-25px] px-4 py-2 rounded-full inline-block">Payment</h2>
      <p className="mb-4 font-poppinsRegular">Please make a payment to:</p>
      <ul className="space-y-2">
        <li className="flex items-center gap-3">
          <img src={BCAIcon} alt="BCA" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">7370-2351-33</span>
            <span className="text-[12px] font-poppinsBold">Claresta</span>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <img src={TMRWIcon} alt="TMRW" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">7293-8666-12</span>
            <span className="text-[12px] font-poppinsBold">Claresta</span>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <img src={AladinIcon} alt="Aladin" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">2022-7324-139</span>
            <span className="text-[12px] font-poppinsBold">Claresta</span>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <img src={DANAIcon} alt="DANA" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">0813-7313-1988</span>
            <span className="text-[12px] font-poppinsBold">Claresta/LittleAmoraKarikatur</span>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <img src={GopayIcon} alt="Gopay" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">0813-7313-1988</span>
            <span className="text-[12px] font-poppinsBold">Claresta/LittleAmoraKarikatur</span>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <img src={OVOIcon} alt="OVO" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">0813-7313-1988</span>
            <span className="text-[12px] font-poppinsBold">Claresta/LittleAmoraKarikatur</span>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <img src={ShopeePayIcon} alt="ShopeePay" className="w-[65px] h-auto" />
          <div className="flex flex-col">
            <span className="font-poppinsRegular">0821-6266-2302</span>
            <span className="text-[12px] font-poppinsBold">LittleAmoraKarikatur</span>
          </div>
        </li>
      </ul>
      <div className="mt-6 -space-y-1">
        <p className="text-[12px] font-poppinsItalic text-[#a23728]">*Please give the bank payment receipt to our team via WhatsApp</p>
        <p className="text-[12px] font-poppinsItalic text-[#a23728]">*This invoice is valid and published by Claresta, owner of Little Amora Karikatur</p>
        <p className="text-[12px] font-poppinsItalic text-[#a23728]">*Copying or changing in any form is prohibited</p>
      </div>
    </div>

    {/* Invoice Section */}
    <div className="text-[13px]">
      <h2 className="font-poppinsSemiBold text-[15px] mb-4 bg-[#dcbec1] translate-x-[-25px] px-4 py-2 rounded-full inline-block">
        Get Invoice
      </h2>
      <p className="mb-4 font-poppinsRegular">
        Please fill the data to get the order invoice:
      </p>
      <form onSubmit={handleSubmitInvoice} className="space-y-1 font-poppinsRegular">
        <div className="flex items-center gap-2">
          <label className="w-48">Company name</label>
          <span>:</span>
          <input
            type="text"
            name="companyName"
            value={invoiceData.companyName}
            onChange={handleInvoiceChange}
            className="border border-black rounded-full px-4 py-1 flex-1 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center"
            placeholder="Company name"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-48">Name & Contact Person</label>
          <span>:</span>
          <input
            type="text"
            name="contactPerson"
            value={invoiceData.contactPerson}
            onChange={handleInvoiceChange}
            className="border border-black rounded-full px-4 py-1 flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-48">Order via</label>
          <span>:</span>
          <input
            type="text"
            name="orderVia"
            value={invoiceData.orderVia}
            onChange={handleInvoiceChange}
            className="border border-black rounded-full px-4 py-1 flex-1"
          />
        </div>
              {/*kalender*/}
              <div className="flex items-center gap-2">
                <label className="w-48">Payment date</label>
                <span>:</span>
                <DateInput
                  name="paymentDate"
                  value={invoiceData.paymentDate}
                  onChange={handleInvoiceChange}
                  placeholder="BCA / Gopay / ..."
                  className="border border-black rounded-full px-4 py-1 flex-1 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center"
                />
              </div>

        <div className="flex items-center gap-2">
          <label className="w-48">Estimated Product Arrival</label>
          <span>:</span>
          <DateInput
            name="estimatedArrival"
            value={invoiceData.estimatedArrival}
            onChange={handleInvoiceChange}
            placeholder="Select estimated arrival date"
            className="border border-black rounded-full px-4 py-1 flex-1 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-48">Payment transfer via Bank</label>
          <span>:</span>
          <input
            type="text"
            name="paymentMethod"
            value={invoiceData.paymentMethod}
            onChange={handleInvoiceChange}
            className="border border-black rounded-full px-4 py-1 flex-1"
          />
        </div>

        <button
          type="button"
          className="mt-4 translate-x-[-26px] text-[15px] font-poppinsSemiBold px-6 py-2 bg-[#dcbec1] rounded-full"
          onClick={() => generateInvoice(cart, invoiceData)} 
        >
          Submit to get invoice
        </button>
      </form>
    </div>
  </div>
)}
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingCart;

import React, {useEffect, useState, useMemo, useRef } from "react";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
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
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
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
        {currentLang === "id" ? "Variasi" : "Variations"}:{" "}
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
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(item.variation || (currentLang === "id" ? "1–9 wajah" : "1–9 faces"));

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelected(value);
    updateItemVariant(item.cartId, value);
    setIsOpen(false);
  };

  const options = currentLang === "id" 
    ? ["1–9 wajah", "Di atas 10 wajah"]
    : ["1–9 faces", "Above 10 faces"];

  return (
    <div className="w-[200px] ml-20 relative">
      <p
        onClick={toggleDropdown}
        className="font-poppinsRegular text-[15px] cursor-pointer select-none"
      >
        {currentLang === "id" ? "Variasi" : "Variations"}:{" "}
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
            {options.map((opt) => (
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
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const [isOpen, setIsOpen] = useState(false);
  
  const [selected, setSelected] = useState(
    item.variation || item.attributes?.backgroundType || (currentLang === "id" ? "BG Default" : "BG Default")
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelected(value);
    updateItemVariant(item.cartId, value);
    setIsOpen(false);
  };

  const options = currentLang === "id" 
    ? ["BG Default", "BG Custom"]
    : ["BG Default", "BG Custom"];

  return (
    <div className="w-[200px] ml-20 relative">
      <p
        onClick={toggleDropdown}
        className="font-poppinsRegular text-[15px] cursor-pointer select-none"
      >
        {currentLang === "id" ? "Variasi" : "Variations"}:{" "}
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
            {options.map((opt) => (
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

// SHIPPING COST - VERSI YANG DIMODIFIKASI
const ShippingCostInput: React.FC<{ 
  item: any; 
  updateShippingCost: (cartId: string, cost: number) => void 
}> = ({
  item,
  updateShippingCost,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  return (
    <div className="w-[200px] ml-20">
      {/* Hanya menampilkan label Shipping Cost saja */}
      <p className="font-poppinsRegular text-[15px] select-none">
        {currentLang === "id" ? "Biaya Pengiriman" : "Shipping Cost"}
      </p>
    </div>
  );
};

const ShoppingCart: React.FC = () => {
  const { cart, updateQuantity, deleteItem, updateItemVariant, updateShippingCost } = useCart();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingShippingCost, setEditingShippingCost] = useState<string | null>(null);
  const [tempShippingCost, setTempShippingCost] = useState<string>("");
  
  // STATE UNTUK MENGELOLA SEMUA DATA FORM INVOICE
  const [invoiceData, setInvoiceData] = useState({
    companyName: "",
    contactPerson: "",
    orderVia: "",
    paymentDate: "",
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

  // Handler untuk update shipping cost
  const handleEditShippingClick = (item: any) => {
    setEditingShippingCost(item.cartId);
    setTempShippingCost(item.price > 0 ? item.price.toString() : "");
  };

  const handleSaveShippingCost = (cartId: string) => {
    const costValue = parseInt(tempShippingCost) || 0;
    updateShippingCost(cartId, costValue);
    setEditingShippingCost(null);
  };

  const handleCancelShippingEdit = () => {
    setEditingShippingCost(null);
  };

  const handleShippingCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempShippingCost(e.target.value);
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Invoice data submitted:", invoiceData);
    alert(currentLang === "id" ? "Data invoice telah dikirim! (Lihat console)" : "Invoice data has been submitted! (Check console)");
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
      {/* MOBILE LAYOUT - hanya tampil di mobile */}
      <div className="block md:hidden flex-1">
        <main className="px-4 py-6 space-y-6">
          
          {/* Box Cart - Mobile */}
          <div className="rounded-2xl border border-black p-4 bg-white shadow-sm">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                {currentLang === "id" ? "Keranjang kosong" : "Cart is empty"}
              </p>
            ) : (
              <>
                {/* Select All Atas - Mobile */}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <span className="font-poppinsSemiBold text-sm">
                    {currentLang === "id" ? "Pilih semua" : "Select All"} ({cart.length})
                  </span>
                </div>
                {Object.values(groupedItems).map((group: any[], idx) => (
                  <div key={idx} className="mb-4 pb-4 last:pb-0 border-b border-gray-200 last:border-b-0">
                    {group.map((item) => (
                      <div
                        key={item.cartId}
                        className="flex items-start py-3 space-y-2"
                      >
                        <input
                          type="checkbox"
                          className="mr-3 mt-2 w-4 h-4"
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
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <ProductImage src={item.imageUrl || item.image} alt={item.name} />
                            <div className="flex-1 min-w-0">
                              <ProductName name={item.name} />
                              <div className="mt-1">
                                {item.attributes?.isShipping ? (
                                  <ShippingCostInput
                                    item={item}
                                    updateShippingCost={updateShippingCost}
                                  />
                                ) : item.attributes?.isFace ? (
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
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <ProductPrice price={item.price} />
                            <div className="flex items-center gap-2">
                              {/* Input Shipping Cost untuk mobile */}
                              {item.attributes?.isShipping ? (
                                editingShippingCost === item.cartId ? (
                                  <div className="relative">
                                    <div className="flex items-center rounded-[20px] border border-black overflow-hidden w-[90px]">
                                      <input
                                        type="number"
                                        value={tempShippingCost}
                                        onChange={handleShippingCostChange}
                                        className="px-2 py-1 text-xs w-full text-center font-poppinsRegular outline-none"
                                        placeholder="0"
                                        min="0"
                                        autoFocus
                                      />
                                    </div>
                                    {/* Tombol muncul di bawah input tanpa menggeser layout */}
                                    <div className="absolute top-full left-0 right-0 mt-1 flex items-center gap-2 justify-center">
                                      <button
                                        onClick={() => handleSaveShippingCost(item.cartId)}
                                        className="bg-[#dcbec1] text-black font-poppinsSemiBold text-[10px] px-2 py-1 rounded-full hover:opacity-90 transition shadow-sm"
                                      >
                                        {currentLang === "id" ? "Simpan" : "Save"}
                                      </button>
                                      <button
                                        onClick={handleCancelShippingEdit}
                                        className="bg-[#dcbec1] text-black font-poppinsSemiBold text-[10px] px-2 py-1 rounded-full hover:opacity-90 transition shadow-sm"
                                      >
                                        {currentLang === "id" ? "Batal" : "Cancel"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    className="flex items-center rounded-[20px] border border-black overflow-hidden cursor-pointer hover:bg-gray-50 w-[90px]"
                                    onClick={() => handleEditShippingClick(item)}
                                  >
                                    <span className="px-2 py-1 text-xs font-poppinsRegular w-full text-center">
                                      {item.price > 0 ? `Rp${item.price.toLocaleString("id-ID")}` : "Rp0"}
                                    </span>
                                  </div>
                                )
                              ) : (
                                <div className="flex items-center rounded-[20px] border border-black overflow-hidden">
                                  <button
                                    className="px-2 py-1 border-r border-black text-xs"
                                    onClick={() => updateQuantity(item.cartId, -1)}
                                  >
                                    -
                                  </button>
                                  <span className="px-2 py-1 text-xs">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="px-2 py-1 border-l border-black text-xs"
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                              <p className="text-sm font-bold text-red-600">
                                Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                              </p>
                              <button
                                className="font-poppinsRegular text-xs text-red-500"
                                onClick={() => deleteItem(item.cartId)}
                              >
                                {currentLang === "id" ? "Hapus" : "Delete"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                    <span className="font-poppinsSemiBold text-sm">
                      {currentLang === "id" ? "Pilih semua" : "Select All"} ({cart.length})
                    </span>
                  </label>
                  <div className="text-right">
                    <p className="font-poppinsSemiBold text-sm">
                      {currentLang === "id" ? "Total" : "Total"} ({selectedItems.length} {currentLang === "id" ? "item" : "items"}):{" "}
                      <span className="font-poppinsBold text-red-500">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout Section - Mobile */}
          {!showCheckout ? (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-[#dcbec1] text-black font-poppinsSemiBold text-sm px-6 py-2 rounded-full shadow-sm hover:opacity-90 transition w-full max-w-[200px]"
              >
                {currentLang === "id" ? "Checkout" : "Checkout"}
              </button>
            </div>
          ) : (
            <div ref={checkoutRef} className="space-y-6 mt-6">
              {/* Payment Section - Mobile */}
              <div className="bg-white rounded-2xl border border-black p-4">
                <h2 className="font-poppinsSemiBold text-sm mb-3 bg-[#dcbec1] px-3 py-1 rounded-full inline-block">
                  {currentLang === "id" ? "Pembayaran" : "Payment"}
                </h2>
                <p className="mb-3 font-poppinsRegular text-sm">
                  {currentLang === "id" ? "Mohon melakukan pembayaran ke:" : "Please make a payment to:"}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <img src={BCAIcon} alt="BCA" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">7370-2351-33</span>
                      <span className="text-xs font-poppinsBold">Claresta</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={TMRWIcon} alt="TMRW" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">7293-8666-12</span>
                      <span className="text-xs font-poppinsBold">Claresta</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={AladinIcon} alt="Aladin" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">2022-7324-139</span>
                      <span className="text-xs font-poppinsBold">Claresta</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={DANAIcon} alt="DANA" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">0813-7313-1988</span>
                      <span className="text-xs font-poppinsBold">Claresta/LittleAmoraKarikatur</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={GopayIcon} alt="Gopay" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">0813-7313-1988</span>
                      <span className="text-xs font-poppinsBold">Claresta/LittleAmoraKarikatur</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={OVOIcon} alt="OVO" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">0813-7313-1988</span>
                      <span className="text-xs font-poppinsBold">Claresta/LittleAmoraKarikatur</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <img src={ShopeePayIcon} alt="ShopeePay" className="w-12 h-auto" />
                    <div className="flex flex-col">
                      <span className="font-poppinsRegular text-sm">0821-6266-2302</span>
                      <span className="text-xs font-poppinsBold">LittleAmoraKarikatur</span>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-poppinsItalic text-[#a23728]">
                    {currentLang === "id" 
                      ? "*Silahkan screenshoot bukti bayar dan kirim ke WhatsApp admin kami"
                      : "*Please give the bank payment receipt to our team via WhatsApp"
                    }
                  </p>
                  <p className="text-xs font-poppinsItalic text-[#a23728]">
                    {currentLang === "id" 
                      ? "*Kwitansi ini valid dan dibuat oleh Claresta, pemilik dari Little Amora Karikatur"
                      : "*This invoice is valid and published by Claresta, owner of Little Amora Karikatur"
                    }
                  </p>
                  <p className="text-xs font-poppinsItalic text-[#a23728]">
                    {currentLang === "id" 
                      ? "*Dilarang menyalin dan merubah kwitansi ini dalam bentuk apapun"
                      : "*Copying or changing in any form is prohibited"
                    }
                  </p>
                </div>
              </div>

              {/* Invoice Section - Mobile */}
              <div className="bg-white rounded-2xl border border-black p-4 text-xs">
                <h2 className="font-poppinsSemiBold text-sm mb-3 bg-[#dcbec1] px-3 py-1 rounded-full inline-block">
                  {currentLang === "id" ? "Isi Kwitansi" : "Get Invoice"}
                </h2>
                <p className="mb-3 font-poppinsRegular text-sm">
                  {currentLang === "id" 
                    ? "Silahkan isi data berikut untuk mendapatkan kwitansi"
                    : "Please fill the data to get the order invoice:"
                  }
                </p>
                <form onSubmit={handleSubmitInvoice} className="space-y-2 font-poppinsRegular">
                  <div className="flex flex-col gap-1">
                    <label className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Nama perusahaan" : "Company name"}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={invoiceData.companyName}
                      onChange={handleInvoiceChange}
                      className="border border-black rounded-full px-3 py-2 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center text-sm"
                      placeholder={currentLang === "id" ? "Nama perusahaan" : "Company name"}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Nama dan Nomor Kontak" : "Name & Contact Person"}
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={invoiceData.contactPerson}
                      onChange={handleInvoiceChange}
                      className="border border-black rounded-full px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Order melalui" : "Order via"}
                    </label>
                    <input
                      type="text"
                      name="orderVia"
                      value={invoiceData.orderVia}
                      onChange={handleInvoiceChange}
                      className="border border-black rounded-full px-3 py-2 text-sm"
                    />
                  </div>
                  {/*kalender*/}
                  <div className="flex flex-col gap-1">
                    <label className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Tanggal bayar" : "Payment date"}
                    </label>
                    <DateInput
                      name="paymentDate"
                      value={invoiceData.paymentDate}
                      onChange={handleInvoiceChange}
                      placeholder={currentLang === "id" ? "BCA / Gopay / ..." : "BCA / Gopay / ..."}
                      className="border border-black rounded-full px-3 py-2 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Estimasi barang sampai" : "Estimated Product Arrival"}
                    </label>
                    <DateInput
                      name="estimatedArrival"
                      value={invoiceData.estimatedArrival}
                      onChange={handleInvoiceChange}
                      placeholder={currentLang === "id" ? "Pilih tanggal estimasi sampai" : "Select estimated arrival date"}
                      className="border border-black rounded-full px-3 py-2 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Bayar melalui" : "Payment transfer via Bank"}
                    </label>
                    <input
                      type="text"
                      name="paymentMethod"
                      value={invoiceData.paymentMethod}
                      onChange={handleInvoiceChange}
                      className="border border-black rounded-full px-3 py-2 text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full text-sm font-poppinsSemiBold px-6 py-3 bg-[#dcbec1] rounded-full"
                    onClick={() => generateInvoice(cart, invoiceData)} 
                  >
                    {currentLang === "id" ? "Kirim untuk mendapatkan kwitansi" : "Submit to get invoice"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DESKTOP LAYOUT - hanya tampil di desktop */}
      <div className="hidden md:block flex-1">
        <main className="px-6 md:px-16 py-10 space-y-10">
          
          {/* Box Cart */}
          <div className="rounded-[30px] border border-black p-6 bg-white shadow-sm">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">
                {currentLang === "id" ? "Keranjang kosong" : "Cart is empty"}
              </p>
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
                    {currentLang === "id" ? "Pilih semua" : "Select All"} ({cart.length})
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
                          {item.attributes?.isShipping ? (
                            <ShippingCostInput
                              item={item}
                              updateShippingCost={updateShippingCost}
                            />
                          ) : item.attributes?.isFace ? (
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
                        {/* Input Shipping Cost untuk desktop */}
                        {item.attributes?.isShipping ? (
                          editingShippingCost === item.cartId ? (
                            <div className="relative">
                              <div className="flex items-center rounded-[30px] border border-black overflow-hidden w-[108px]">
                                <input
                                  type="number"
                                  value={tempShippingCost}
                                  onChange={handleShippingCostChange}
                                  className="px-4 py-1 text-sm w-full text-center font-poppinsRegular outline-none"
                                  placeholder="0"
                                  min="0"
                                  autoFocus
                                />
                              </div>
                              {/* Tombol muncul di bawah input tanpa menggeser layout */}
                              <div className="absolute top-full left-0 right-0 mt-1 flex items-center gap-2 justify-center">
                                <button
                                  onClick={() => handleSaveShippingCost(item.cartId)}
                                  className="bg-[#dcbec1] text-black font-poppinsSemiBold text-xs px-3 py-1 rounded-full hover:opacity-90 transition shadow-sm"
                                >
                                  {currentLang === "id" ? "Simpan" : "Save"}
                                </button>
                                <button
                                  onClick={handleCancelShippingEdit}
                                  className="bg-[#dcbec1] text-black font-poppinsSemiBold text-xs px-3 py-1 rounded-full hover:opacity-90 transition shadow-sm"
                                >
                                  {currentLang === "id" ? "Batal" : "Cancel"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="flex items-center rounded-[30px] border border-black overflow-hidden cursor-pointer hover:bg-gray-50 w-[108px]"
                              onClick={() => handleEditShippingClick(item)}
                            >
                              <span className="px-4 py-1 text-sm font-poppinsRegular w-full text-center">
                                {item.price > 0 ? `Rp${item.price.toLocaleString("id-ID")}` : "Rp0"}
                              </span>
                            </div>
                          )
                        ) : (
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
                        )}
                          <p className="w-28 text-right font-bold text-red-600">
                            Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                          </p>
                          <button
                            className="font-poppinsRegular text-red-500"
                            onClick={() => deleteItem(item.cartId)}
                          >
                            {currentLang === "id" ? "Hapus" : "Delete"}
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
                      {currentLang === "id" ? "Pilih semua" : "Select All"} ({cart.length})
                    </span>
                  </label>
                  <div className="text-right">
                    <p className="font-poppinsSemiBold">
                      {currentLang === "id" ? "Total" : "Total"} ({selectedItems.length} {currentLang === "id" ? "item" : "items"}):{" "}
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
                {currentLang === "id" ? "Checkout" : "Checkout"}
              </button>
            </div>
          ) : (
            <div ref={checkoutRef} className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Payment Section */}
              <div>
                <h2 className="font-poppinsSemiBold text-[15px] mb-4 bg-[#dcbec1] translate-x-[-25px] px-4 py-2 rounded-full inline-block">
                  {currentLang === "id" ? "Pembayaran" : "Payment"}
                </h2>
                <p className="mb-4 font-poppinsRegular">
                  {currentLang === "id" ? "Mohon melakukan pembayaran ke:" : "Please make a payment to:"}
                </p>
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
                  <p className="text-[12px] font-poppinsItalic text-[#a23728]">
                    {currentLang === "id" 
                      ? "*Silahkan screenshoot bukti bayar dan kirim ke WhatsApp admin kami"
                      : "*Please give the bank payment receipt to our team via WhatsApp"
                    }
                  </p>
                  <p className="text-[12px] font-poppinsItalic text-[#a23728]">
                    {currentLang === "id" 
                      ? "*Kwitansi ini valid dan dibuat oleh Claresta, pemilik dari Little Amora Karikatur"
                      : "*This invoice is valid and published by Claresta, owner of Little Amora Karikatur"
                    }
                  </p>
                  <p className="text-[12px] font-poppinsItalic text-[#a23728]">
                    {currentLang === "id" 
                      ? "*Dilarang menyalin dan merubah kwitansi ini dalam bentuk apapun"
                      : "*Copying or changing in any form is prohibited"
                    }
                  </p>
                </div>
              </div>

              {/* Invoice Section */}
              <div className="text-[13px]">
                <h2 className="font-poppinsSemiBold text-[15px] mb-4 bg-[#dcbec1] translate-x-[-25px] px-4 py-2 rounded-full inline-block">
                  {currentLang === "id" ? "Isi Kwitansi" : "Get Invoice"}
                </h2>
                <p className="mb-4 font-poppinsRegular">
                  {currentLang === "id" 
                    ? "Silahkan isi data berikut untuk mendapatkan kwitansi"
                    : "Please fill the data to get the order invoice:"
                  }
                </p>
                <form onSubmit={handleSubmitInvoice} className="space-y-1 font-poppinsRegular">
                  <div className="flex items-center gap-2">
                    <label className="w-48">
                      {currentLang === "id" ? "Nama perusahaan" : "Company name"}
                    </label>
                    <span>:</span>
                    <input
                      type="text"
                      name="companyName"
                      value={invoiceData.companyName}
                      onChange={handleInvoiceChange}
                      className="border border-black rounded-full px-4 py-1 flex-1 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center"
                      placeholder={currentLang === "id" ? "Nama perusahaan" : "Company name"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-48">
                      {currentLang === "id" ? "Nama dan Nomor Kontak" : "Name & Contact Person"}
                    </label>
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
                    <label className="w-48">
                      {currentLang === "id" ? "Order melalui" : "Order via"}
                    </label>
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
                    <label className="w-48">
                      {currentLang === "id" ? "Tanggal bayar" : "Payment date"}
                    </label>
                    <span>:</span>
                    <DateInput
                      name="paymentDate"
                      value={invoiceData.paymentDate}
                      onChange={handleInvoiceChange}
                      placeholder={currentLang === "id" ? "BCA / Gopay / ..." : "BCA / Gopay / ..."}
                      className="border border-black rounded-full px-4 py-1 flex-1 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="w-48">
                      {currentLang === "id" ? "Estimasi barang sampai" : "Estimated Product Arrival"}
                    </label>
                    <span>:</span>
                    <DateInput
                      name="estimatedArrival"
                      value={invoiceData.estimatedArrival}
                      onChange={handleInvoiceChange}
                      placeholder={currentLang === "id" ? "Pilih tanggal estimasi sampai" : "Select estimated arrival date"}
                      className="border border-black rounded-full px-4 py-1 flex-1 placeholder-red-500 placeholder:font-poppinsSemiBoldItalic placeholder:text-center"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-48">
                      {currentLang === "id" ? "Bayar melalui" : "Payment transfer via Bank"}
                    </label>
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
                    {currentLang === "id" ? "Kirim untuk mendapatkan kwitansi" : "Submit to get invoice"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShoppingCart;
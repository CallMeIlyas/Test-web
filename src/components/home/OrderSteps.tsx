import { useState, useEffect } from "react";
import peopleIcon from "../../assets/Icons/people.png";
import frameIcon from "../../assets/Icons/frame.png";
import sizeIcon from "../../assets/Icons/size.png";
import locationIcon from "../../assets/Icons/location.png";
import calendarIcon from "../../assets/Icons/calendar.png";
import whatsappIcon from "../../assets/Icons/whatsapp.png";
import useScrollFloat from "../../utils/scrollFloat"; 

// 💡 Komponen input tanggal
const DateInput = ({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div className="relative inline-block w-48">
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="text-center rounded-full border border-gray-300 px-6 py-2 outline-none bg-white w-full"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          textAlignLast: "center",
        }}
      />
      {!value && (
        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-poppinsSemiBoldItalic pointer-events-none">
          {placeholder}
        </span>
      )}
    </div>
  );
};

const OrderSteps = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState({
    faces: "",
    frames: "",
    size: "",
    city: "",
    deadline: "",
  });

  // 🌀 Terapkan animasi scroll
  useScrollFloat(".scroll-float", {
    yIn: 50,
    yOut: 40,
    blurOut: 6,
    inDuration: 1.1,
    stagger: 0.15,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    { number: 1, icon: peopleIcon, text: "How many faces on the frame?", key: "faces" },
    { number: 2, icon: frameIcon, text: "How many frame that you need?", key: "frames" },
    { number: 3, icon: sizeIcon, text: "Pick the frame size", key: "size" },
    { number: 4, icon: locationIcon, text: "Fill subdistrict and city for estimated shipping fee", key: "city" },
    { number: 5, icon: calendarIcon, text: "Fill the deadline date and month", key: "deadline" },
    { number: 6, icon: whatsappIcon, text: "Give the format order to our admin", special: true },
  ];

  const waNumber = "6281380340307";
  const waMessage = `
Caricature amount on 1 frame = ${form.faces}
Frame Quantity = ${form.frames}
Frame Size = ${form.size}
Subdistrict & City = ${form.city}
Deadline date & month = ${form.deadline}
  `.trim();
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const handleStepClick = (step: any) => {
    if (step.number === 6) {
      window.open(waLink, "_blank");
      return;
    }
    if (step.number === 5) return; // kalender input
    const answer = prompt(step.text, form[step.key as keyof typeof form] || "");
    if (answer !== null) {
      setForm((prev) => ({ ...prev, [step.key]: answer }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, deadline: e.target.value }));
  };

  const renderStepCard = (step: any) => (
  <div
    key={step.number}
    onClick={() => handleStepClick(step)}
    className="float-item bg-white rounded-xl p-5 relative flex flex-col items-center justify-between h-full cursor-pointer transition-transform hover:-translate-y-1 shadow-none group hover:shadow-hover hover:scale-110 transition-all duration-300"
  >
    {/* Nomor Step */}
    <div
      className={`absolute -top-3 left-5 text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold ${
        step.special ? "bg-red-500" : "bg-black"
      } text-white`}
    >
      {step.number}
    </div>

    <img
      src={step.icon}
      alt={`Step ${step.number}`}
      className="!w-[170px] !h-[170px] object-contain group-hover:scale-110 transition-transform duration-500"
    />

    <p className="font-poppinsRegular text-sm text-gray-600 text-center min-h-[36px] flex items-center justify-center">
      {step.text}
    </p>

    {/* Step 5: Deadline (Kalender) */}
    {step.number === 5 && (
      <div className="flex items-center gap-2 mt-3 w-full justify-center">
        <DateInput
          name="deadline"
          value={form.deadline}
          onChange={handleDateChange}
          placeholder="Select date"
          className="text-sm text-gray-700 w-4/5"
        />
      </div>
    )}

    {/* Tampilkan hasil input */}
    {form[step.key as keyof typeof form] && step.number !== 5 && step.number !== 6 && (
      <p className="text-xs mt-2 text-green-600 italic">✓ {form[step.key as keyof typeof form]}</p>
    )}
  </div>
);

  return (
 <>
    {/*border*/}
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>
      
      
          <section className={isMobile ? "py-8" : "py-16"}>
        <h2
          className={`scroll-float font-nataliecaydence text-center text-black ${
            isMobile ? "text-3xl mb-8" : "text-[46px] mb-20"
          }`}
        >
          Format Order
        </h2>
      
        {isMobile ? (
          <div
            data-scroll-group="true"
            className="scroll-float flex flex-col gap-4 px-4 max-w-md mx-auto"
          >
            {steps.map(renderStepCard)}
          </div>
        ) : (
          <div
            data-scroll-group="true"
            className="scroll-float grid grid-cols-3 grid-rows-2 gap-6 max-w-5xl mx-auto px-5"
          >
            {steps.map(renderStepCard)}
          </div>
        )}
      </section>
</>
  );
};

export default OrderSteps;
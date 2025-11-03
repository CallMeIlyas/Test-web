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

  // 🔹 State untuk modal prompt
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<any>(null);
  const [promptValue, setPromptValue] = useState("");

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
    setActiveStep(step);
    setPromptValue(form[step.key as keyof typeof form] || "");
    setIsPromptOpen(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, deadline: e.target.value }));
  };

  const handlePromptSave = () => {
    if (activeStep) {
      setForm((prev) => ({
        ...prev,
        [activeStep.key]: promptValue.trim(),
      }));
    }
    setIsPromptOpen(false);
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
          />
        </div>
      )}

      {/* Tampilkan hasil input */}
      {form[step.key as keyof typeof form] && step.number !== 5 && step.number !== 6 && (
        <p className="text-lg mt-2 text-black italic">
          ✓ {form[step.key as keyof typeof form]}
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Border */}
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

      {/* 🪟 Modal Prompt */}
      {isPromptOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg text-center animate-fadeIn">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              {activeStep?.text}
            </h3>
            <input
              type="text"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full border border-gray-300 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setIsPromptOpen(false)}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePromptSave}
                className="px-4 py-2 rounded-full bg-[#dcbec1] text-black hover:bg-[#c7a9ac] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSteps;
import peopleIcon from "../../assets/Icons/people.png";
import frameIcon from "../../assets/Icons/frame.png";
import sizeIcon from "../../assets/Icons/size.png";
import locationIcon from "../../assets/Icons/location.png";
import calendarIcon from "../../assets/Icons/calendar.png";
import whatsappIcon from "../../assets/Icons/whatsapp.png";

const OrderSteps = () => {
  const steps = [
    { number: 1, icon: peopleIcon, text: "How many faces on the frame?" },
    { number: 2, icon: frameIcon, text: "How many frame that you need?" },
    { number: 3, icon: sizeIcon, text: "Pick the frame size" },
    { number: 4, icon: locationIcon, text: "Fill subdistrict and city for estimated shipping fee" },
    { number: 5, icon: calendarIcon, text: "Fill the deadline date and month" },
    { number: 6, icon: whatsappIcon, text: "Give the format order to our admin", special: true },
  ];

  return (
    <>
      {/* Border */}
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>

      <section className="py-16">
        <h2 className="font-nataliecaydence text-[46px] text-center mb-20 text-black">
          Format Order
        </h2>

        <div className="grid grid-cols-3 grid-rows-2 gap-6 max-w-5xl mx-auto px-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl p-5 relative flex flex-col items-center justify-between h-full"
            >
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
                className="w-[120px] h-[120px] object-contain"
              />

              <p className="font-poppinsRegular text-sm text-gray-600 text-center min-h-[36px] flex items-center">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default OrderSteps;
import React from 'react';
import Footer from '../components/home/Footer';
const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Split Border Title */}
<div className="relative text-center mt-10 my-5">
  <h1 className="inline-block px-5 text-4xl font-nataliecaydence whitespace-nowrap relative z-10">
    Terms of Service
  </h1>
  {/* garis kiri */}
  <div className="absolute top-[65%] left-0 w-[20%] border-t-4 border-black"></div>
  {/* garis kanan */}
  <div className="absolute top-[65%] right-0 w-[20%] border-t-4 border-black"></div>
</div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="flex flex-col gap-0">
          
          {/* Payment Section */}
          <section className="-mb-[60px] last:mb-0">
            <div className="relative h-px my-10">
              <div className="absolute top-2 left-0.5 h-full w-[15%] border-t-2 border-black translate-y-7"></div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-6 pb-6">
              <div className="font-sans font-semibold pl-16 mb-2">
                <p className="font-poppinsSemiBold text-[11px] m-0 text-black -ml-16">Regarding</p>
                <h3 className="font-poppinsSemiBold m-0 text-[14px] -ml-16">Payment</h3>
              </div>
          
              <div>
                <ul className="font-poppinsRegular m-0 pl-5 -ml-[17%] list-disc text-[14px]">
                  <li className="mb-2 leading-relaxed -translate-y-16">
                    All customer must fill the order format
                  </li>
                  <li className="mb-6 leading-relaxed -mt-[5%]">
                    Full payment for order below Rp. 5.000.000,-
                  </li>
                  <li className="mb-2 leading-relaxed text-justify">
                    Terms of Down Payment:<br />
                    First Down Payment = when customer make an order<br />
                    Final Down Payment = after the customer accept the preview design, then customer can make the final payment.  
                    The second payment is not made after the goods arrive as we are making a handmade products.
                  </li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Design Revision Section */}
          <section className="-mb-[60px] last:mb-0">
          <div className="relative h-px my-10">
            <div className="absolute top-2 left-0.5 h-full w-[15%] border-t-2 border-black translate-y-7"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-6 pb-6">
            <div className="font-sans font-semibold pl-16 mb-2">
              <p className="font-poppinsSemiBold text-[11px] m-0 text-black -ml-16">Regarding</p>
              <h3 className="font-poppinsSemiBold m-0 text-[14px] -ml-16">Design Revision</h3>
            </div>
            <div>
              <ul className="font-poppinsRegular m-0 pl-5 -ml-[17%] list-disc text-[14px]">
                <li className="mb-5 leading-relaxed">
                  We accept minor revision for 2 times, customer can't change the background if our team already give a design preview.
                  Please tell the brief design at the beginning, customer can send us background photos references or rough sketch to show the people order position, logo, greetings, and other objects placement.<br/>
                   </li>
                   <li className="mb-2 leading-relaxed text-justify">
                     If customer has a deadline time, please consider in giving the number of the design revision, as our team
                      already make the design based on the first brief that customer give. We can not guarantee to fulfil the deadline
                      time, if the customer give us revision more than 3 times. Please understand that we already handling and
                      arrange all order based on the process time which customer and our team have agreed from the beginning.
                   </li>
              </ul>
            </div>
          </div>
          </section>
          
          {/* Caricature Section */}
          <section className="-mb-[60px] last:mb-0">
          <div className="relative h-px my-10">
            <div className="absolute top-2 left-0.5 h-full w-[15%] border-t-2 border-black translate-y-7"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-6 pb-6">
            <div className="font-sans font-semibold pl-16 mb-2">
              <p className="font-poppinsSemiBold text-[11px] m-0 text-black -ml-16">Regarding</p>
              <h3 className="font-poppinsSemiBold m-0 text-[14px] -ml-16">Caricature</h3>
            </div>
            <div>
              <ul className="font-poppinsRegular m-0 pl-5 -ml-[17%] list-disc text-[14px]">
                <li className="mb-2 leading-relaxed text-justify">
                  The caricature face made from the same face line from the original photos, our team make it as vector
                  illustration, we do not use Al to make the caricature face.
                  If customer want to change to other photos, customers are subject to additional charges per 1 face caricature,
                  and 1 day additional process time added.
                </li>
                <li className="mb-2 leading-relaxed text-justify">
                   Our team is not obliged to report any of the progress to the customer, we already give the date of the design
                    preview, customer must wait until we give the design preview. Please understand that we are handling more
                    than one order, this system was made so our team can achive more focus in making the products and making less error in the process.
                </li>
              </ul>
            </div>
          </div>
          </section>
          
          {/* Shipping & Delivery Section */}
          <section className="-mb-[60px] last:mb-0">
          <div className="relative h-px my-10">
            <div className="absolute top-2 left-0.5 h-full w-[15%] border-t-2 border-black translate-y-7"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-6 pb-6">
            <div className="font-sans font-semibold pl-16 mb-2">
              <p className="font-poppinsSemiBold text-[11px] m-0 text-black -ml-16">Regarding</p>
              <h3 className="font-poppinsSemiBold m-0 text-[14px] -ml-16">Shipping & Delivery</h3>
            </div>
            <div>
              <ul className="font-poppinsRegular m-0 pl-5 -ml-[17%] list-disc text-[14px]">
                <li className="mb-2 leading-relaxed text-justify">
                   Please share the precise address for the receiver locations and details for example office hour, drop zone, etc.
                      We won't take any responsibility if the product sent to a mistaken locations due to lack of informations and detail
                      given by customer, or customer missed a call from the driver during the delivery process.
                </li>
                <li className="mb-2 leading-relaxed text-justify">
                  For shipping process, our team can order the Grab Express or Gosend, please note that we already give the
                    customer data, such as address, note, and phone number on the application. Sometimes there is an issue
                    about the application notification do not show up or do not pop up on the customer's phone. Therefore we give
                    the customer's WhatsApp number to the driver. If there is issues about the delivery process, we can help to
                    report the driver via Gojek or Grab application. This is the farthest assistance we could provide for the customer,
                    so customer must pay attention with their phone when our team order the delivery from the application.
                </li>
              </ul>
            </div>
          </div>
          </section>
          
          {/* Defect Product Section */}
          <section className="-mb-[60px] last:mb-0">
          <div className="relative h-px my-10">
            <div className="absolute top-2 left-0.5 h-full w-[15%] border-t-2 border-black translate-y-7"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-6 pb-6">
            <div className="font-sans font-semibold pl-16 mb-2">
              <p className="font-poppinsSemiBold text-[11px] m-0 text-black -ml-16">Regarding</p>
              <h3 className="font-poppinsSemiBold m-0 text-[14px] -ml-16">Defect Product</h3>
            </div>
            <div>
              <ul className="font-poppinsRegular m-0 pl-5 -ml-[17%] list-disc text-[14px]">
                <li className="mb-2 leading-relaxed text-justify">
                  Our team already make the best effort to cover packaging of the products with bubblewrap inside and outside
                  the box, using airbag to wrap big sized frame, put the fragile sticker, and position sticker on top of the front wrap.
                  From our experience, there is a very small chance the products will break or defect, but if it happen, we can
                  report it to the courier services. Please make a video unboxing before customer open the packaging, if the
                  products defect or break, we can help to recreate and reship the new frame, with an additional fee of 40% of the
                  original price. This is the best our team can do to provide the customer's need.
                </li>
              </ul>
            </div>
          </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
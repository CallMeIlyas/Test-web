import Footer from '../components/home/Footer';
import FAQItem from '../components/faq/FAQItem';
import { Link } from "react-router-dom";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="relative text-center my-5 -translate-y-2.5 mt-16">
        <h1 className="inline-block px-5 text-4xl font-[Nataliecaydence-regular] whitespace-nowrap relative top-1.5 z-10">
          Frequently Ask Question
        </h1>
        <div className="before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[20%] before:border-t-4 before:border-black" />
        <div className="after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-[20%] after:border-t-4 after:border-black" />
      </div>
      
      <div className="font-poppinsRegular text-[16px] text-justify max-w-[620px] mx-auto my-0.5 leading-[1.2] whitespace-nowrap">
        <p>The format order from customer determine the process time and total price.</p>
        <p>Here is the information for non-express process and other detail regarding</p>
        <p>our services and products. For express process please contact our team.</p>
      </div>
      
      <main className="max-w-[700px] mx-auto py-12 px-5 font-sans flex-1">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-3 font-s">
            <FAQItem 
              question="How long the process time for 1 frame 1 face caricature?"
              answer={
                <>
                  Normal process for frame
                  <br />
                  4R, 15cm, 6R, 20cm, 8R, 108, 12R = 3 - 4 days<br />
                  A2, A1, A0 = 4 - 5 days
                  <br />
                  <br />
                  Express process for frame<br />
                  4R, 15cm, 6R, 20cm, 8R, 10R, 12R = 1-2 days<br />
                  A2, A1, A0 = 2 - 3 days<br />
                  <br />
                  The process time <span className="text-red-500 font-bold italic">not include</span> revision time from customer and courier shipping time.  
                  We can proceed the express process as long as the quota is available.
                </>
              }
            />
            
            <FAQItem 
              question="Which city are the products shipped from?"
              answer={
                <Link to="/location" className="block mx-auto mt-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-[#333] no-underline rounded-full font-bold text-center transition-all hover:bg-[#e8b9b8] hover:scale-105">
                  Click here to see the location
                </Link>
              }
            />
            
            <FAQItem 
              question="What is pop up frame? Why 3D frame is special?"
              answer="Pop up frames are a type of handicraft that uses stacked paper so it has depth or it looks 3D. Starting from making digital caricature from photos, designing it with background based on the customer preferences. After that we print, cut, and assembling the paper layer by layer. Little Amora Caricature established since 2018. Our design characteristic we use is vector illustration, the body shown smaller and shorter so the faces can be more stand out."
            />
            
            <FAQItem 
              question="Can customer get the design before payment?"
              answer={
                <>
                  <p>No, the customer can't get the design before payment. For our design and frame portfolio, customer can check the gallery and video, and also the background catalog here.</p>
                  
                  <a 
                    href="https://www.instagram.com/alittleamora?igsh=MXZ4emVlcnk5dm1mdw==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mx-auto mt-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-[#333] no-underline rounded-full font-bold text-center transition-all hover:bg-[#e8b9b8] hover:scale-105"
                  >
                    Photo Gallery
                  </a>
                  
                  <a 
                    href="https://www.tiktok.com/@alittleamora?_t=ZS-8yeIkqZXx8G&_r=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mx-auto mt-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-[#333] no-underline rounded-full font-bold text-center transition-all hover:bg-[#e8b9b8] hover:scale-105"
                  >
                    Video Gallery
                  </a>
                  
                  
                  <Link to="/background-catalog" className="block mx-auto mt-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-[#333] no-underline rounded-full font-bold text-center transition-all hover:bg-[#e8b9b8] hover:scale-105">
                    Background Catalog
                  </Link>
                </>
              }
            />
            
            <FAQItem 
              question="Can customer choose the frame using glass or acrylic?"
              answer={
                <>
                  Yes, customer can choose whether to use glass or acrylic. Please purchase the additional fees for changing glass to acrylic.
                  <br />
                  <br />
                  Mostly, for safety needs, acrylic frame are used to send big frame size like A2, A1, and A0 using JNE cargo courier or sending to worldwide using Rayspeed.
                  <br />
                  <br />
                  Below A2 size like A3, 10R, 8R, 6R, 20cm, 15cm, 4R don't need to use acrylic.
                </>
              }
            />
            
            <FAQItem 
              question="What makes Little Amora special than the other shop?"
              answer="Our vector caricature, the way we pop up the element on the frame, and the whole design that makes Little Amora has it's own characteristic in this handcraft field."
            />
            
            <FAQItem 
              question="Can customer pick up the frame on the site?"
              answer="Yes, customer can pick the order from the location in Bogor or Jakarta, depend on the size frame."
            />
            
            <FAQItem 
              question="Any discount if customer order more than 1 frame?"
              answer="Discount for frames are for order more than 25 pcs, as this is a handcraft products, each design and caricature needs time, effort and attention to give the best result for customers."
            />
            
            <FAQItem 
              question="Can customer change logo, product or element in free background catalog?"
              answer={
                <>
                  Yes, customer can change anything from the free background catalog.
                  <br />
                  <br />
                  Please remind, the background can't be change after the design preview is given.
                </>
              }
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-3">
            <FAQItem 
              question="How long the process time for 1 frame 2-10 faces caricature?"
              answer={
                <>
                  Normal process for frame <br />
                  10R, 12R = 5–7 days <br />
                  A2, A1, A0 = 7–10 days <br />
                  <br />
                  Express process for frame <br />
                  10R, 12R = 4–5 days <br />
                  A2, A1, A0 = 5–7 days <br />
                  <br />
                  The process time <span className="text-red-500 font-bold italic">not include</span> revision time from customer and courier shipping time.  
                  We can proceed the express process as long as the quota is available.
                </>
              }
            />
            
            <FAQItem 
              question="What is the procedure for order the frame?"
              answer={
                <>
                  <ul className="list-disc pl-5">
                    <li>How many faces on the frame?</li>
                    <li>How many frame that you need?</li>
                    <li>Pick the frame size</li>
                    <li>Fill subdistrict and city for estimated shipping fee</li>
                    <li>Fill the deadline date and month</li>
                  </ul>
                    <a 
                      href="https://wa.me/6281380340307?text=fo1%20(kode%20jangan%20dihapus)%0A%0A%E2%80%A2%20Berapa%20wajah%20dalam%201%20frame%20=%0A%E2%80%A2%20Jumlah%20frame%20yang%20akan%20diorder%20=%0A%E2%80%A2%20Ukuran%20frame%20=%0A%E2%80%A2%20Background%20=%20free%20/%20custom%3F%0A%E2%80%A2%20Kecamatan%20%26%20kota%20pengiriman%20=%0A%E2%80%A2%20Tanggal-bulan%20barang%20harus%20sampai%20="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mx-auto mt-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-black no-underline rounded-full font-bold text-xs whitespace-nowrap text-center transition-all hover:bg-[#e8b9b8] hover:scale-105"
                    >
                      Give the format order to our team
                    </a>
                </>
              }
            />
            
            <FAQItem 
              question="What is the difference between 2D and 3D frame?"
              answer={
                <>
                  2D frame is an ordinary photo frame made from wood and glass, it has no depth.
                  <br />
                  <br />
                  While 3D frame has it's depth, we can put anything inside based on our creativity. Usually the crafter around the world make a pop up frame using 3D frame, add a lamp or clock, or even add some miniature inside. Some of them can add artificial flower or even sand, and many more elements to create the 3D frame looks alive.
                </>
              }
            />
            
            <FAQItem 
              question="Is the packaging safe for delivery?"
              answer={
                <>
                  All our frame packed with bubblewrap inside and outside the box. For big size frame, we use airbag and card box packaging.
                  <br />
                  <br />
                  If you are concern about the packaging, please order an Instant Delivery using bike or car.
                  <br />
                  <br />
                  If the packaging was broken by the courier, our team can help customer to complain about the issues to the courier, and if customer ask us to recreate the frame, customer can pay the fee by only 70% of the original frame price, don't need to pay the additional faces and background custom.
                </>
              }
            />
            
            <FAQItem 
              question="Can customer add lamp or gold plate on the frame?"
              answer={
                <>
                  Currently, adding lamp or gold plate still not available in Little Amora Caricature Frame.
                  <br />
                  <br />
                  If customer want to add, customers can open the MDF on the back of the frame, and paste it using glue gun.
                </>
              }
            />
            
            <FAQItem 
              question="How many revision for the design?"
              answer={
                <>
                  Maximum design is 2x minor revision, customer can't change background after the preview design.
                  <br />
                  <br />
                  Please give us the detail information when customer make an order.
                </>
              }
            />
            
            <FAQItem 
              question="What if the caricature not similar than the photo?"
              answer={
                <>
                  The face character on every person is different on angle variant. Our team make the caricature based from their face line on the original photos.
                  <br />
                  <br />
                  Customer must pay attention to the original photos that they send to our team. To remake the caricature, customer can re-submit the photo with different angle than the first one, additional fee included as our illustrator make the caricature manually digital, we don't use Al to make the caricature.
                </>
              }
            />
            
            <FAQItem 
              question="What is the difference between manual and digital illustration?"
              answer={
                <>
                  Generally, illustrator make an illustration using pen tablet to draw manual drawing. Pen tablet referred to digital drawing. Many illustrators too, still using mouse and laptop or PC to draw, it called vectoring. Vectoring an image is what we are doing here, by following the face line or photo line to create an illustration.
                  <br />
                  <br />
                  Manual drawing is using pencil, pen or tools to draw a picture or painting.
                </>
              }
            />
            
            <FAQItem 
              question="Can customer request to change the illustration style into 3D or semi realism?"
              answer={
                <>
                  Currently, our team make a vector illustration for all the caricature and the design.
                  <br />
                  <br />
                  For semi realism, our illustrator is available to do the request. Requires additional costs.
                  <br />
                  <br />
                  For now, our team is not available for making into a 3D yet, but we can use Al to make it 3D, requires additional fee too.
                </>
              }
            />
          </div>
        </div>
        
        {/* Custom FAQ Item */}
<div className="max-w-[430px] mx-auto my-7.5 p-5 font-sans">
  <FAQItem 
    question="Place your question here, our team will answer you soon"
    answer={
      <>
        <a 
          href="https://wa.me/6281380340307?text=fo1%20(kode%20jangan%20dihapus)%0A%0A%E2%80%A2%20Berapa%20wajah%20dalam%201%20frame%20=%0A%E2%80%A2%20Jumlah%20frame%20yang%20akan%20diorder%20=%0A%E2%80%A2%20Ukuran%20frame%20=%0A%E2%80%A2%20Background%20=%20free%20/%20custom%3F%0A%E2%80%A2%20Kecamatan%20%26%20kota%20pengiriman%20=%0A%E2%80%A2%20Tanggal-bulan%20barang%20harus%20sampai%20="
          target="_blank"
          rel="noopener noreferrer"
          className="block mx-auto mt-3 w-fit px-8 py-2.5 bg-[#d69ca0] text-white no-underline rounded-full font-bold text-sm whitespace-nowrap text-center transition-all hover:bg-[#c17f84 ] hover:scale-105"
        >
          Chat via WhatsApp
        </a>
      </>
    }
    isCustom={true}
  />
</div>
      </main>
      
      <Footer />
    </div>
  );
}
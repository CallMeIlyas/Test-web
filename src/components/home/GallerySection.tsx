import type { VideoItem } from '../../types/types';

const GallerySection = () => {
  const videos: VideoItem[] = [
    { id: 1, video: "/src/assets/karya/vid-1.mp4", poster: "/karya/poster-1.jpg" },
    { id: 2, video: "/src/assets/karya/vid-2.mp4", poster: "/karya/poster-2.jpg" },
    { id: 3, video: "/src/assets/karya/vid-3.mp4", poster: "/karya/poster-3.jpg" }
  ];

  return (
        <>
      {/* border */}
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>

    <section className="py-16 bg-white px-5">
      <h2 className="font-nataliecaydence text-[46px] text-center mb-10 text-black">Our Gallery</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
        {/* Instagram Button */}
        <div className="social-wrapper">
          <span className="social-title">Photo Gallery</span>
          <a 
            href="https://www.instagram.com/alittleamora" 
            className="social-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/src/assets/Icons/IG.png" alt="Instagram" className="w-full h-full object-contain" />
          </a>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {videos.map(video => (
            <div 
              key={video.id} 
              className="aspect-[9/16] overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 bg-black hover:scale-[1.03]"
            >
              <video 
                controls 
                poster={video.poster}
                className="w-full h-full object-cover"
              >
                <source src={video.video} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        {/* TikTok Button */}
        <div className="social-wrapper">
          <span className="social-title">Video Gallery</span>
          <a 
            href="https://www.tiktok.com/@alittleamora" 
            className="social-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/src/assets/Icons/TIKTOD2.png" alt="TikTok" className="w-full h-full object-contain" />
          </a>
        </div>
      </div>
    </section>
    </>
  );
};

export default GallerySection;
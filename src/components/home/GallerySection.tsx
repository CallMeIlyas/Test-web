import { useState, type FC } from "react";
import type { VideoItem } from "../../types/types";

import IGIcon from "../../assets/Icons/IG.png";
import TikTokIcon from "../../assets/Icons/TIKTOD2.png";

import video1 from "../../assets/karya/vid-1.mp4";
import video2 from "../../assets/karya/vid-2.mp4";
import video3 from "../../assets/karya/vid-3.mp4";

import foto1 from "../../assets/karya/foto/foto1.jpeg";
import foto2 from "../../assets/karya/foto/foto2.jpeg";
import foto3 from "../../assets/karya/foto/foto3.jpeg";

const GallerySection: FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const videos: VideoItem[] = [
    { id: 1, video: video1},
    { id: 2, video: video2},
    { id: 3, video: video3},
  ];

  const photos = [
    { id: 1, image: foto1 },
    { id: 2, image: foto2 },
    { id: 3, image: foto3 },
  ];

  return (
    <>
      {/* Border */}
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>

      <section className="py-16 bg-white px-5">
        <h2 className="font-nataliecaydence text-[46px] text-center mb-10 text-black">
          Our Gallery
        </h2>

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
              <img
                src={IGIcon}
                alt="Instagram"
                className="w-full h-full object-contain"
              />
            </a>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {videos.map((video) => (
              <div
                key={video.id}
                className="aspect-[9/16] overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 bg-black hover:scale-[1.03]"
              >
                <video controls className="w-full h-full object-cover">
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
              <img
                src={TikTokIcon}
                alt="TikTok"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
        </div>

        {/* Photo Grid Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-[9/16] overflow-hidden rounded-xl shadow-md transition-transform duration-300 bg-gray-100 scale-90 hover:scale-100 cursor-pointer"
                onClick={() => setSelectedImage(photo.image)}
              >
                <img
                  src={photo.image}
                  alt={`Gallery photo ${photo.id}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default GallerySection;
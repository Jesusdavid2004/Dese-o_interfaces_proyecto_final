"use client";

import { useState, ReactNode } from "react";

export type Photo = {
  id: string;
  src: string;
  alt: string;
};

export type Hobby = {
  id: string;
  icon: ReactNode;
  label: string;
  photos: Photo[];
};

interface InteractiveCircleProps {
  hobbies: Hobby[];
  title?: string;
  description?: string;
}

export default function InteractiveCircle({
  hobbies,
  title = "A Little About Me",
  description = "Click on your favorite hobby to explore",
}: InteractiveCircleProps) {
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(
    hobbies[0] || null
  );
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const currentPhotos = selectedHobby?.photos || [];
  const currentPhoto = currentPhotos[currentPhotoIndex];

  const handleHobbyClick = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % currentPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length
      );
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-4xl font-extrabold text-center mb-12">{title}</h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Central Circle */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
          {currentPhoto ? (
            <>
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-center font-semibold">
                  {selectedHobby?.label}
                </p>
                <p className="text-gray-300 text-center text-sm">
                  {currentPhotoIndex + 1} of {currentPhotos.length}
                </p>
              </div>

              {/* Left Arrow */}
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/70 hover:bg-white dark:hover:bg-black rounded-full p-2 transition-all duration-200 shadow-lg z-10"
                aria-label="Previous photo"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/70 hover:bg-white dark:hover:bg-black rounded-full p-2 transition-all duration-200 shadow-lg z-10"
                aria-label="Next photo"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                Click on a hobby to see photos
              </p>
            </div>
          )}
        </div>

        {/* Floating Text Side */}
        <div className="flex flex-col gap-8 lg:w-80">
          {/* Title Text */}
          <div className="token-float">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedHobby?.label || "Select a hobby"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Hobby Buttons Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {hobbies.map((hobby) => (
              <button
                key={hobby.id}
                onClick={() => handleHobbyClick(hobby)}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl transition-all duration-300 card ${
                  selectedHobby?.id === hobby.id
                    ? "ring-2 ring-blue-500 scale-105 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30"
                    : "hover:scale-105"
                }`}
              >
                <div className="text-gray-700 dark:text-gray-300 text-lg">
                  {hobby.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {hobby.label}
                </span>
              </button>
            ))}
          </div>

          {/* Photo Counter */}
          {currentPhotos.length > 0 && (
            <div className="text-center token-float" style={{ animationDelay: "0.2s" }}>
              <p className="text-lg font-semibold text-blue-500">
                {currentPhotoIndex + 1}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                of {currentPhotos.length} photos
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

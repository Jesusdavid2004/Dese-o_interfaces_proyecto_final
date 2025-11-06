"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getLangFromSearch, t, Lang } from "@/lib/i18n";

export type Song = {
  id: string;
  title: string;
  src: string;
};

export type Photo = {
  id: string;
  src: string;
  alt: string;
  songs?: Song[];
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
  title,
  description,
}: InteractiveCircleProps) {
  const sp = useSearchParams();
  const lang: Lang = getLangFromSearch(sp?.toString() || "");

  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(hobbies[0] || null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentPhotos = selectedHobby?.photos || [];
  const currentPhoto = currentPhotos[currentPhotoIndex];
  const currentSongs =
    currentPhoto?.songs && currentPhoto.songs.length > 0 ? currentPhoto.songs : [];
  const currentSong = currentSongs.length > 0 ? currentSongs[currentSongIndex] : null;

  const handleHobbyClick = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setCurrentPhotoIndex(0);
    setCurrentSongIndex(0);
    setIsPlaying(false);
  };

  const nextPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % currentPhotos.length);
      setCurrentSongIndex(0);
      setIsPlaying(false);
    }
  };

  const prevPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length);
      setCurrentSongIndex(0);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((err) => console.error("Error:", err));
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && currentSong?.src) {
      audioRef.current.src = currentSong.src;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Error:", err));
      }
    }
  }, [currentSong, isPlaying]);

  const hasSongs = currentSongs.length > 0;

  // Textos i18n para UI
  const i18n = {
    heading: title ?? t(lang, "hobbies_title"),
    sub: description ?? t(lang, "hobbies_intro"),
    play: lang === "en" ? "Play" : "Reproducir",
    pause: lang === "en" ? "Pause" : "Pausar",
    mute: lang === "en" ? "Mute" : "Silenciar",
    unmute: lang === "en" ? "Unmute" : "Activar sonido",
    prevPhoto: lang === "en" ? "Previous photo" : "Foto anterior",
    nextPhoto: lang === "en" ? "Next photo" : "Siguiente foto",
    selectOne: lang === "en" ? "Pick a hobby to see photos" : "Haz clic en un pasatiempo para ver fotos",
    noneSelected: lang === "en" ? "Select a hobby" : "Selecciona un pasatiempo",
    ofPhotos: lang === "en" ? "of photos" : "de fotos",
  };

  return (
    <section className="mt-8">
      <h2 className="text-4xl font-extrabold text-center mb-12">{i18n.heading}</h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
          {currentPhoto ? (
            <>
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                className="w-full h-full object-cover transition-all duration-500"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${
                  hasSongs ? "opacity-100" : "opacity-0 hover:opacity-100"
                }`}
              >
                <p className="text-white text-center font-semibold mb-2">
                  {selectedHobby?.label}
                </p>
                <p className="text-gray-300 text-center text-sm mb-4">
                  {currentPhotoIndex + 1} {lang === "en" ? "of" : "de"} {currentPhotos.length}
                </p>

                {hasSongs && currentSong && (
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 space-y-2">
                    <p className="text-white text-xs font-medium text-center truncate">
                      {currentSong.title}
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
                        aria-label={isPlaying ? i18n.pause : i18n.play}
                        title={isPlaying ? i18n.pause : i18n.play}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
                        aria-label={isMuted ? i18n.unmute : i18n.mute}
                        title={isMuted ? i18n.unmute : i18n.mute}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-1 justify-center">
                      {currentSongs.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => changeSong(index)}
                          className={`px-2 py-1 rounded text-xs transition-all ${
                            index === currentSongIndex
                              ? "bg-white text-black"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                          aria-label={`${lang === "en" ? "Track" : "Pista"} ${index + 1}`}
                          title={`${lang === "en" ? "Track" : "Pista"} ${index + 1}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <audio ref={audioRef} crossOrigin="anonymous" />

              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/70 hover:bg-white dark:hover:bg-black rounded-full p-2 transition-all duration-200 shadow-lg z-10"
                aria-label={i18n.prevPhoto}
                title={i18n.prevPhoto}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/70 hover:bg-white dark:hover:bg-black rounded-full p-2 transition-all duration-200 shadow-lg z-10"
                aria-label={i18n.nextPhoto}
                title={i18n.nextPhoto}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                {i18n.selectOne}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:w-80">
          <div className="token-float">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedHobby?.label || i18n.noneSelected}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {i18n.sub}
            </p>
          </div>

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
                aria-pressed={selectedHobby?.id === hobby.id}
                title={hobby.label}
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

          {currentPhotos.length > 0 && (
            <div className="text-center token-float" style={{ animationDelay: "0.2s" }}>
              <p className="text-lg font-semibold text-blue-500">
                {currentPhotoIndex + 1}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {lang === "en" ? "of" : "de"} {currentPhotos.length} {i18n.ofPhotos}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

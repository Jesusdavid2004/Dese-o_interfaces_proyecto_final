"use client";

import { Camera, Music, Plane, UtensilsCrossed, Gamepad2, Dog } from "lucide-react";
import InteractiveCircle, { Hobby } from "@/components/InteractiveCircle";

const HOBBIES: Hobby[] = [
  {
    id: "photography",
    icon: <Camera size={32} />,
    label: "Fotografía",
    photos: [
      { id: "1", src: "/images/photo1.jpg", alt: "Fotografía 1" },
      { id: "2", src: "/images/photo2.jpg", alt: "Fotografía 2" },
      { id: "3", src: "/images/photo3.jpg", alt: "Fotografía 3" },
    ],
  },
  {
    id: "music",
    icon: <Music size={32} />,
    label: "Música",
    photos: [
      {
        id: "4",
        src: "/images/music1.jpg",
        alt: "Álbum 1",
        songs: [
          { id: "s1", title: "Canción 1 - Álbum 1", src: "/music/album1/song1.mp3" },
          { id: "s2", title: "Canción 2 - Álbum 1", src: "/music/album1/song2.mp3" },
        ],
      },
      {
        id: "5",
        src: "/images/music2.jpg",
        alt: "Álbum 2",
        songs: [
          { id: "s3", title: "Canción 1 - Álbum 2", src: "/music/album2/song3.mp3" },
          { id: "s4", title: "Canción 2 - Álbum 2", src: "/music/album2/song4.mp3" },
        ],
      },
      {
        id: "6",
        src: "/images/music3.jpg",
        alt: "Álbum 3",
        songs: [
          { id: "s5", title: "Canción 1 - Álbum 3", src: "/music/album3/song5.mp3" },
          { id: "s6", title: "Canción 2 - Álbum 3", src: "/music/album3/song6.mp3" },
        ],
      },
    ],
  },
  {
    id: "travel",
    icon: <Plane size={32} />,
    label: "Viajes",
    photos: [
      { id: "7", src: "/images/travel1.jpg", alt: "Viaje 1" },
      { id: "8", src: "/images/travel2.jpg", alt: "Viaje 2" },
      { id: "9", src: "/images/travel3.jpg", alt: "Viaje 3" },
    ],
  },
  {
    id: "food",
    icon: <UtensilsCrossed size={32} />,
    label: "Comida",
    photos: [
      { id: "10", src: "/images/food1.jpg", alt: "Comida 1" },
      { id: "11", src: "/images/food2.jpg", alt: "Comida 2" },
      { id: "12", src: "/images/food3.jpg", alt: "Comida 3" },
    ],
  },
  {
    id: "gaming",
    icon: <Gamepad2 size={32} />,
    label: "Videojuegos",
    photos: [
      { id: "13", src: "/images/gaming1.jpg", alt: "Videojuegos 1" },
      { id: "14", src: "/images/gaming2.jpg", alt: "Videojuegos 2" },
      { id: "15", src: "/images/gaming3.jpg", alt: "Videojuegos 3" },
    ],
  },
  {
    id: "pets",
    icon: <Dog size={32} />,
    label: "Mascotas",
    photos: [
      { id: "16", src: "/images/pets1.jpg", alt: "Mascotas 1" },
      { id: "17", src: "/images/pets2.jpg", alt: "Mascotas 2" },
      { id: "18", src: "/images/pets3.jpg", alt: "Mascotas 3" },
    ],
  },
];

export default function PasatiemposPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
      <InteractiveCircle
        hobbies={HOBBIES}
        title="Un Poco Sobre Mí"
        description="Haz clic en para conocerme un poco"
      />
    </main>
  );
}

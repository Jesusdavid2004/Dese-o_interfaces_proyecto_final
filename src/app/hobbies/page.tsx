"use client";

import { Camera, Music, Plane, Coffee, Gamepad2, Dog } from "lucide-react";
import InteractiveCircle, { Hobby } from "@/components/InteractiveCircle";

const HOBBIES: Hobby[] = [
  {
    id: "photography",
    icon: <Camera size={32} />,
    label: "Photography",
    photos: [
      { id: "1", src: "/images/photo1.jpg", alt: "Photography 1" },
      { id: "2", src: "/images/photo2.jpg", alt: "Photography 2" },
      { id: "3", src: "/images/photo3.jpg", alt: "Photography 3" },
    ],
  },
  {
    id: "music",
    icon: <Music size={32} />,
    label: "Music",
    photos: [
      { id: "4", src: "/images/music1.jpg", alt: "Music 1" },
      { id: "5", src: "/images/music2.jpg", alt: "Music 2" },
    ],
  },
  {
    id: "travel",
    icon: <Plane size={32} />,
    label: "Travel",
    photos: [
      { id: "6", src: "/images/travel1.jpg", alt: "Travel 1" },
      { id: "7", src: "/images/travel2.jpg", alt: "Travel 2" },
    ],
  },
  {
    id: "coffee",
    icon: <Coffee size={32} />,
    label: "Coffee",
    photos: [
      { id: "8", src: "/images/coffee1.jpg", alt: "Coffee 1" },
      { id: "9", src: "/images/coffee2.jpg", alt: "Coffee 2" },
    ],
  },
  {
    id: "gaming",
    icon: <Gamepad2 size={32} />,
    label: "Gaming",
    photos: [
      { id: "10", src: "/images/gaming1.jpg", alt: "Gaming 1" },
      { id: "11", src: "/images/gaming2.jpg", alt: "Gaming 2" },
    ],
  },
  {
    id: "pets",
    icon: <Dog size={32} />,
    label: "Pets",
    photos: [
      { id: "12", src: "/images/pets1.jpg", alt: "Pets 1" },
      { id: "13", src: "/images/pets2.jpg", alt: "Pets 2" },
    ],
  },
];

export default function HobbiesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
      <InteractiveCircle hobbies={HOBBIES} title="A Little About Me" />
    </main>
  );
}

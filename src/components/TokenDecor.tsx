/* ------------- TokenDecor (debe quedar en /components/TokenDecor.tsx) ------------- */
"use client";
import { CSSProperties } from "react";

type Props = {
  color: "red" | "blue" | "yellow" | "green";
  size?: number;
  style?: CSSProperties;
  className?: string;
  label?: string;
};

const COLORS = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
};

export default function TokenDecor({ color, size = 48, style, className = "", label }: Props) {
  return (
    <div
      className={`rounded-full shadow-soft ring-2 ring-black/10 dark:ring-white/10 ${COLORS[color]} ${className} token-bounce`}
      style={{ width: size, height: size, ...style }}
      title={label}
    />
  );
}

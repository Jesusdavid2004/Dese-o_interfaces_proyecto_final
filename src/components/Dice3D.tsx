"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onRoll?: (n: number) => void;
  /** Espera (ms) tras mostrar la cara final antes de notificar onRoll */
  delayMs?: number;
  /** Desactiva el dado (no responde a clicks) */
  disabled?: boolean;
  /** Tamaño en px del dado (opcional) */
  size?: number;
};

/** Rotaciones para dejar cada cara al frente (sistema de ejes coherente) */
const FACE_TRANSFORM: Record<number, string> = {
  1: "rotateX(0deg) rotateY(0deg) rotateZ(0deg)", // front
  2: "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)", // top
  3: "rotateX(0deg) rotateY(90deg) rotateZ(0deg)", // right
  4: "rotateX(0deg) rotateY(-90deg) rotateZ(0deg)", // left
  5: "rotateX(90deg) rotateY(0deg) rotateZ(0deg)", // bottom
  6: "rotateX(180deg) rotateY(0deg) rotateZ(0deg)", // back
};

/** Baraja in-place con Fisher–Yates */
function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Dice3D({
  onRoll,
  delayMs = 480,
  disabled = false,
  size = 120,
}: Props) {
  const [mounted, setMounted] = useState(false);

  // clases de animación para el wrapper (definidas en globals.css)
  const [spinClass, setSpinClass] = useState<string>(""); // "spin-a" | "spin-b" | "spin-c"
  const [phaseClass, setPhaseClass] = useState<string>(""); // "spinning" | "finish-pop" | "wobble"

  // cara actual visible
  const [face, setFace] = useState<number>(1);

  // Cola del ciclo actual (1–5 barajados, luego 6 al final)
  const cycleRef = useRef<number[]>([]);
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    refillCycle();
    return () => {
      if (t1.current) clearTimeout(t1.current);
      if (t2.current) clearTimeout(t2.current);
      if (t3.current) clearTimeout(t3.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Genera un nuevo ciclo: [1..5] aleatorio + 6 al final */
  function refillCycle() {
    const firstFive = shuffle([1, 2, 3, 4, 5]);
    cycleRef.current = [...firstFive, 6];
  }

  /** Toma la siguiente cara según la cola; evita repetir la actual */
  function nextFaceDistinct(current: number): number {
    if (cycleRef.current.length === 0) refillCycle();
    let next = cycleRef.current.shift()!;
    if (next === current) {
      if (cycleRef.current.length === 0) refillCycle();
      cycleRef.current.push(next);
      next = cycleRef.current.shift()!;
    }
    return next;
  }

  const transform = useMemo(() => FACE_TRANSFORM[face] ?? FACE_TRANSFORM[1], [face]);

  const roll = () => {
    if (disabled || phaseClass.includes("spinning")) return;

    // estilo de giro aleatorio por tirada
    const spins = ["spin-a", "spin-b", "spin-c"];
    setSpinClass(spins[Math.floor(Math.random() * spins.length)]);

    // “respiración” de sombra mientras gira
    setPhaseClass("spinning");

    const spinDuration = 650; // debe matchear los keyframes (.65s)

    // IMPORTANTE: NO desmontamos el cubo; solo cambiamos su transform
    t1.current = setTimeout(() => {
      const next = nextFaceDistinct(face);
      setFace(next);

      // pequeño “pop” y luego wobble elástico
      setPhaseClass("finish-pop");
      t2.current = setTimeout(() => setPhaseClass("wobble"), 120);

      // notificar un poquito después del wobble
      t3.current = setTimeout(() => {
        setPhaseClass("");
        onRoll?.(next);
      }, delayMs);
    }, spinDuration);
  };

  // Preparar style con variable CSS custom sin usar "any"
  const cssVar = { ["--dice-size"]: `${size}px` } as React.CSSProperties;

  // Evita saltos de hidratación: mostrar cubo estático mientras no está montado
  if (!mounted) {
    return (
      <button
        onClick={roll}
        aria-label="Lanzar dado"
        className={`dice-3d ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        style={cssVar}
        disabled={disabled}
      >
        <div className="dice-anim-wrap">
          <div className="dice-cube" style={{ transform: FACE_TRANSFORM[1] }}>
            <DiceFaces />
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={roll}
      aria-label="Lanzar dado"
      className={`dice-3d ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      style={cssVar}
      disabled={disabled}
    >
      {/* El wrapper anima. El cubo solo mantiene la rotación final de la cara */}
      <div className={`dice-anim-wrap ${spinClass} ${phaseClass}`}>
        <div className="dice-cube" style={{ transform }}>
          <DiceFaces />
        </div>
      </div>
    </button>
  );
}

function DiceFaces() {
  return (
    <>
      {/* 1 (front) */}
      <div className="dice-face dice-f1">
        <div className="dice-pip mc" />
      </div>
      {/* 2 (top) */}
      <div className="dice-face dice-f2">
        <div className="dice-pip tl" />
        <div className="dice-pip br" />
      </div>
      {/* 3 (right) */}
      <div className="dice-face dice-f3">
        <div className="dice-pip tl" />
        <div className="dice-pip mc" />
        <div className="dice-pip br" />
      </div>
      {/* 4 (left) */}
      <div className="dice-face dice-f4">
        <div className="dice-pip tl" />
        <div className="dice-pip tr" />
        <div className="dice-pip bl" />
        <div className="dice-pip br" />
      </div>
      {/* 5 (bottom) */}
      <div className="dice-face dice-f5">
        <div className="dice-pip tl" />
        <div className="dice-pip tr" />
        <div className="dice-pip mc" />
        <div className="dice-pip bl" />
        <div className="dice-pip br" />
      </div>
      {/* 6 (back) */}
      <div className="dice-face dice-f6">
        <div className="dice-pip tl" />
        <div className="dice-pip ml" />
        <div className="dice-pip bl" />
        <div className="dice-pip tr" />
        <div className="dice-pip mr" />
        <div className="dice-pip br" />
      </div>
    </>
  );
}

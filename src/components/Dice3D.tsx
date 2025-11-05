"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onRoll?: (n: number) => void;
  delayMs?: number;
  disabled?: boolean;
  size?: number;
};

const FACE_TRANSFORM: Record<number, string> = {
  1: "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
  2: "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)",
  3: "rotateX(0deg) rotateY(90deg) rotateZ(0deg)",
  4: "rotateX(0deg) rotateY(-90deg) rotateZ(0deg)",
  5: "rotateX(90deg) rotateY(0deg) rotateZ(0deg)",
  6: "rotateX(180deg) rotateY(0deg) rotateZ(0deg)",
};

function shuffle<T>(arr: T[]): T[] {
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
  const [spinClass, setSpinClass] = useState<string>("");
  const [phaseClass, setPhaseClass] = useState<string>("");
  const [face, setFace] = useState<number>(1);

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
  }, []);

  function refillCycle(): void {
    const firstFive = shuffle([1, 2, 3, 4, 5]);
    cycleRef.current = [...firstFive, 6];
  }

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

  const transform = useMemo(
    () => FACE_TRANSFORM[face] ?? FACE_TRANSFORM[1],
    [face]
  );

  const roll = (): void => {
    if (disabled || phaseClass.includes("spinning")) return;

    const spins = ["spin-a", "spin-b", "spin-c"];
    setSpinClass(spins[Math.floor(Math.random() * spins.length)]);
    setPhaseClass("spinning");

    const spinDuration = 650;

    t1.current = setTimeout(() => {
      const next = nextFaceDistinct(face);
      setFace(next);
      setPhaseClass("finish-pop");

      t2.current = setTimeout(() => {
        setPhaseClass("wobble");
      }, 120);

      t3.current = setTimeout(() => {
        setPhaseClass("");
        onRoll?.(next);
      }, delayMs);
    }, spinDuration);
  };

  const cssVar = { ["--dice-size"]: `${size}px` } as React.CSSProperties;

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
      {/* Cara 1: Un pip */}
      <div className="dice-face dice-f1">
        <div className="dice-pip mc" />
      </div>

      {/* Cara 2: Dos pips */}
      <div className="dice-face dice-f2">
        <div className="dice-pip tl" />
        <div className="dice-pip br" />
      </div>

      {/* Cara 3: Tres pips */}
      <div className="dice-face dice-f3">
        <div className="dice-pip tl" />
        <div className="dice-pip mc" />
        <div className="dice-pip br" />
      </div>

      {/* Cara 4: Cuatro pips */}
      <div className="dice-face dice-f4">
        <div className="dice-pip tl" />
        <div className="dice-pip tr" />
        <div className="dice-pip bl" />
        <div className="dice-pip br" />
      </div>

      {/* Cara 5: Cinco pips */}
      <div className="dice-face dice-f5">
        <div className="dice-pip tl" />
        <div className="dice-pip tr" />
        <div className="dice-pip mc" />
        <div className="dice-pip bl" />
        <div className="dice-pip br" />
      </div>

      {/* Cara 6: Seis pips */}
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

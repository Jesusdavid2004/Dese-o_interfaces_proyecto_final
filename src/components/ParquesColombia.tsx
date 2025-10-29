"use client";

import { useMemo, useState } from "react";
import Dice3D from "@/components/Dice3D";

/* ================== Tipos / Constantes ================== */

type ColorKey = "red" | "blue" | "green" | "yellow";
type Token = { pos: number }; // -1 patio; 0..51 anillo; 100..105 recta; 999 llegada
type Player = { color: ColorKey; tokens: Token[] };

const COLORS: Record<ColorKey, { hex: string; label: string }> = {
  red:    { hex: "#e53935", label: "ROJO" },
  blue:   { hex: "#1e88e5", label: "AZUL" },
  green:  { hex: "#43a047", label: "VERDE" },
  yellow: { hex: "#f6c946", label: "AMARILLO" },
};

const START_INDEX: Record<ColorKey, number> = {
  red: 0, blue: 13, green: 26, yellow: 39,
};
const ENTRY_INDEX: Record<ColorKey, number> = {
  red: 50, blue: 11, green: 24, yellow: 37,
};
const FINAL_BASE: Record<ColorKey, number> = {
  red: 100, blue: 110, green: 120, yellow: 130,
};

// “Seguros” estándar
const SAFE_SET = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

/* Utilidad */
const isFinal = (p: number) => p >= 100 && p < 140;
const adv = (p: number, s: number) => (p + s) % 52;
const nextPlayer = (p: ColorKey): ColorKey =>
  p === "red" ? "blue" : p === "blue" ? "green" : p === "green" ? "yellow" : "red";

/* ================== Componente Raíz ================== */

export default function ParquesColombia() {
  const [players, setPlayers] = useState<Player[]>([
    { color: "red", tokens: [{ pos: -1 }, { pos: -1 }] },
    { color: "blue", tokens: [{ pos: -1 }, { pos: -1 }] },
    { color: "green", tokens: [{ pos: -1 }, { pos: -1 }] },
    { color: "yellow", tokens: [{ pos: -1 }, { pos: -1 }] },
  ]);
  const [turn, setTurn] = useState<ColorKey>("red");
  const [roll, setRoll] = useState<number | null>(null);
  const [hint, setHint] = useState("Tira el dado para comenzar");

  const current = useMemo(() => players.find((p) => p.color === turn)!, [players, turn]);

  function handleRoll(n: number) {
    setRoll(n);
    setHint(`Obtuviste ${n}. Elige una ficha ${COLORS[turn].label}.`);
  }

  function commit(state: Player[], extra: boolean) {
    setPlayers(state); // << guarda el nuevo estado
    setRoll(null);
    if (extra) {
      setHint("Sacaste 6: tiras de nuevo.");
    } else {
      const nxt = nextPlayer(turn);
      setTurn(nxt);
      setHint(`Turno de ${COLORS[nxt].label}`);
    }
  }

  function eatIfPossible(state: Player[], me: ColorKey, pos: number) {
    if (SAFE_SET.has(pos)) return;
    state.forEach((p) => {
      if (p.color === me) return;
      p.tokens.forEach((t) => { if (t.pos === pos) t.pos = -1; });
    });
  }

  function moveToken(i: number) {
    if (roll == null) return;
    const n = roll;
    const isSix = n === 6;

    const next = players.map((p) => ({ ...p, tokens: p.tokens.map((t) => ({ ...t })) }));
    const me   = next.find((p) => p.color === turn)!;
    const tok  = me.tokens[i];

    // Salida con 5
    if (tok.pos === -1) {
      if (n !== 5) { setHint("Para salir del patio necesitas un 5."); return; }
      tok.pos = START_INDEX[turn];
      eatIfPossible(next, turn, tok.pos);
      commit(next, false);
      return;
    }

    // Anillo
    if (!isFinal(tok.pos)) {
      let steps = n;
      let p = tok.pos;

      while (steps > 0) {
        p = adv(p, 1);
        steps--;
        if (p === ENTRY_INDEX[turn]) {
          if (steps > 0) {
            const base = FINAL_BASE[turn];
            const toFinal = Math.min(steps, 6);
            tok.pos = base + (toFinal - 1);
            steps = 0;
          } else {
            tok.pos = p;
          }
        }
      }
      if (!isFinal(tok.pos)) {
        tok.pos = p;
        eatIfPossible(next, turn, tok.pos);
      }
      commit(next, isSix);
      return;
    }

    // Recta final
    const base   = FINAL_BASE[turn];
    const offset = tok.pos - base; // 0..5
    const target = offset + n;

    if (target < 6) {
      tok.pos = base + target;
      commit(next, isSix);
    } else if (target === 6) {
      tok.pos = 999;         // llegada
      setHint("¡Llegada! 🎉");
      commit(next, isSix);
    } else {
      setHint("No puedes exceder la llegada.");
      commit(next, isSix);
    }
  }

  return (
    <div className="w-full">
      {/* Turno */}
      <div className="flex items-center justify-center mb-2">
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold bg-zinc-900/90 text-white ring-1"
          style={{ boxShadow: `0 0 0 2px ${COLORS[turn].hex}55` }}
        >
          <span className="opacity-80 mr-1">Turno:</span>
          <span style={{ color: COLORS[turn].hex }}>{COLORS[turn].label}</span>
        </span>
      </div>
      <p className="text-center text-zinc-300 mb-3">{hint}</p>

      {/* Layout compacto */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_120px] gap-6 items-center justify-items-center">
        <BoardSVG
          players={players}
          turn={turn}
          onClickToken={(i) => moveToken(i)}
          className="w-[300px] sm:w-[360px] lg:w-[420px]"
        />
        <div className="flex flex-col items-center">
          <div style={{ ["--dice-size" as any]: "96px" }}>
            <Dice3D onRoll={handleRoll} />
          </div>
          <p className="text-xs text-zinc-400 mt-2">Haz clic para tirar</p>
        </div>
      </div>
    </div>
  );
}

/* ================== SVG Deluxe ================== */

function BoardSVG({
  players, turn, onClickToken, className,
}: {
  players: Player[]; turn: ColorKey; onClickToken: (i: number) => void; className?: string;
}) {
  const S = 560;     // tamaño del viewBox
  const N = 15;
  const unit = S / N;
  const C = (n: number) => n * unit;

  const RED = "#E53935", BLUE = "#1E88E5", GREEN = "#43A047", YELLOW = "#F6C946";

  // tokens: color + pos + índice de token dentro del jugador
  const tokens = players.flatMap((p) => p.tokens.map((t, ti) => ({ color: p.color, pos: t.pos, idx: ti })));

  // anillo 0..51 -> celda superior-izq
  function ringXY(pos: number) {
    const side = Math.floor(pos / 13), off = pos % 13;
    if (side === 0) return { x: C(1 + off), y: C(5) };
    if (side === 1) return { x: C(9), y: C(1 + off) };
    if (side === 2) return { x: C(13 - off), y: C(9) };
    return { x: C(5), y: C(13 - off) };
  }

  // coordenadas centro de ficha
  function tokenXY(color: ColorKey, pos: number) {
    if (pos === -1) {
      if (color === "red")   return { x: C(2.5),  y: C(2.5)  };
      if (color === "blue")  return { x: C(12.5), y: C(2.5)  };
      if (color === "green") return { x: C(2.5),  y: C(12.5) };
      return { x: C(12.5), y: C(12.5) };
    }
    if (pos === 999) return { x: C(7.5), y: C(7.5) };

    if (pos >= 100 && pos < 140) {
      const d = Math.min(pos % 10, 5);
      if (color === "red")   return { x: C(7),     y: C(5 + d) };
      if (color === "blue")  return { x: C(9 - d), y: C(7)     };
      if (color === "green") return { x: C(7),     y: C(9 - d) };
      return { x: C(5 + d), y: C(7) };
    }
    const r = ringXY(pos);
    return { x: r.x + unit / 2, y: r.y + unit / 2 };
  }

  return (
    <div className={["aspect-square rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,.5)]", className || ""].join(" ")}>
      <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Madera rica */}
          <linearGradient id="wood1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#cda46b"/>
            <stop offset="50%"  stopColor="#d9b277"/>
            <stop offset="100%" stopColor="#b48649"/>
          </linearGradient>
          <linearGradient id="wood2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#e2bf85"/>
            <stop offset="100%" stopColor="#c89b58"/>
          </linearGradient>

          {/* Fieltro profundo */}
          <radialGradient id="felt" cx="35%" cy="30%" r="80%">
            <stop offset="0%"  stopColor="#115c3a" />
            <stop offset="60%" stopColor="#0d4a2f" />
            <stop offset="100%" stopColor="#0a3a24" />
          </radialGradient>
          <radialGradient id="feltGlow" cx="35%" cy="30%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,.16)"/>
            <stop offset="60%"  stopColor="rgba(255,255,255,.07)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>

          {/* Sombra de fichas */}
          <filter id="tok" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.38"/>
          </filter>
        </defs>

        {/* Marco madera doble */}
        <rect x="0" y="0" width={S} height={S} rx={32} fill="url(#wood1)"/>
        <rect x="10" y="10" width={S-20} height={S-20} rx={28} fill="url(#wood2)"/>
        {/* Fondo fieltro */}
        <rect x="18" y="18" width={S-36} height={S-36} rx={24} fill="url(#felt)"/>
        <rect x="18" y="18" width={S-36} height={S-36} rx={24} fill="url(#feltGlow)"/>
        <rect x="18" y="18" width={S-36} height={S-36} rx={24} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={2}/>

        {/* Patios con brillo */}
        <Patio x={C(0)}  y={C(0)}  size={C(5)} color={RED}/>
        <Patio x={C(10)} y={C(0)}  size={C(5)} color={BLUE}/>
        <Patio x={C(0)}  y={C(10)} size={C(5)} color={GREEN}/>
        <Patio x={C(10)} y={C(10)} size={C(5)} color={YELLOW}/>

        {/* Cuadrícula en cruz (camino) */}
        {Array.from({ length: 13 }).map((_, r) =>
          Array.from({ length: 13 }).map((_, c) => {
            const i = c + 1, j = r + 1;
            const inCross = (i >= 5 && i <= 9) || (j >= 5 && j <= 9);
            const inCenter = i >= 5 && i <= 9 && j >= 5 && j <= 9;
            if (!(inCross && !inCenter)) return null;
            return (
              <rect key={`g-${r}-${c}`} x={C(i)} y={C(j)} width={unit} height={unit}
                fill="rgba(255,255,255,.055)" stroke="rgba(255,255,255,.23)" strokeWidth={0.6}/>
            );
          })
        )}

        {/* Entradas curvas estilo colombiano */}
        <EntryCurve C={C} side="left"   color={RED}/>
        <EntryCurve C={C} side="top"    color={BLUE}/>
        <EntryCurve C={C} side="bottom" color={GREEN}/>
        <EntryCurve C={C} side="right"  color={YELLOW}/>

        {/* Roseta central premium */}
        <g transform={`translate(${C(5)}, ${C(5)})`}>
          <circle cx={C(2.5)} cy={C(2.5)} r={C(2.45)} fill="rgba(0,0,0,.35)"/>
          <circle cx={C(2.5)} cy={C(2.5)} r={C(2.34)} fill="#0c3823"/>
          <circle cx={C(2.5)} cy={C(2.5)} r={C(2.3)} fill="#fff" opacity=".06"/>
          <path d={`M ${C(2.5)} ${C(2.5)} L ${C(2.5)} 0 A ${C(2.5)} ${C(2.5)} 0 0 1 ${C(5)} ${C(2.5)} Z`} fill={RED}/>
          <path d={`M ${C(2.5)} ${C(2.5)} L ${C(5)} ${C(2.5)} A ${C(2.5)} ${C(2.5)} 0 0 1 ${C(2.5)} ${C(5)} Z`} fill={BLUE}/>
          <path d={`M ${C(2.5)} ${C(2.5)} L ${C(2.5)} ${C(5)} A ${C(2.5)} ${C(2.5)} 0 0 1 0 ${C(2.5)} Z`} fill={GREEN}/>
          <path d={`M ${C(2.5)} ${C(2.5)} L 0 ${C(2.5)} A ${C(2.5)} ${C(2.5)} 0 0 1 ${C(2.5)} 0 Z`} fill={YELLOW}/>
          <circle cx={C(2.5)} cy={C(2.5)} r={C(0.9)} fill="#fff" opacity=".9"/>
        </g>

        {/* Seguros */}
        {[0,8,13,21,26,34,39,47].map((p) => {
          const side = Math.floor(p / 13), off = p % 13;
          let x=0, y=0;
          if (side===0){x=C(1+off); y=C(5)}
          else if (side===1){x=C(9); y=C(1+off)}
          else if (side===2){x=C(13-off); y=C(9)}
          else {x=C(5); y=C(13-off)}
          return <circle key={`s-${p}`} cx={x + unit/2} cy={y + unit/2} r={6} fill="#fff" opacity=".55"/>;
        })}

        {/* Etiquetas */}
        <Labels C={C} />

        {/* Fichas con halo si es el turno */}
        {tokens.map((t, idx) => {
          const { x, y } = tokenXY(t.color as ColorKey, t.pos);
          const hex = COLORS[t.color as ColorKey].hex;
          const isMine = t.color === turn;
          return (
            <g key={`tok-${idx}`} filter="url(#tok)"
               onClick={() => isMine && onClickToken(t.idx)}
               style={{ cursor: isMine ? "pointer" : "default" }}>
              {isMine && (
                <circle cx={x} cy={y} r={18}
                        fill={hex} opacity=".20">
                  <animate attributeName="opacity" values="0.20;0.45;0.20" dur="1.8s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle cx={x} cy={y} r={14} fill={hex}/>
              <circle cx={x-5} cy={y-6} r={6} fill="rgba(255,255,255,.70)"/>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ============ Partes visuales reutilizables ============ */

function Patio({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const id = `p-${color.replace("#","")}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(color, 0.10)}/>
          <stop offset="100%" stopColor={shade(color, -0.08)}/>
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={size} height={size} rx={16} fill={`url(#${id})`} />
      <rect x={x} y={y} width={size} height={size} rx={16} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={1}/>
      <circle cx={x + size*0.26} cy={y + size*0.26} r={size*0.06} fill="rgba(255,255,255,.75)"/>
    </g>
  );
}

/** Curvas de entrada tipo “abanico” */
function EntryCurve({ C, side, color }:{
  C:(n:number)=>number; side:"top"|"bottom"|"left"|"right"; color:string;
}) {
  const steps = [0,1,2,3,4,5];
  return (
    <g opacity=".95">
      {steps.map((i) => {
        const f = shade(color, 0.18 - i*0.03);
        if (side==="top") {
          // curva hacia el centro desde arriba
          const x1 = C(6+i), y1 = C(5), x2 = C(7.5), y2 = C(7.5);
          return <path key={i} d={`M ${x1} ${y1} Q ${C(7.5)} ${C(5+i*0.25)} ${x2} ${y2}`} stroke={f} strokeWidth={unit()} fill="none"/>;
        }
        if (side==="bottom") {
          const x1 = C(6+i), y1 = C(10), x2 = C(7.5), y2 = C(7.5);
          return <path key={i} d={`M ${x1} ${y1} Q ${C(7.5)} ${C(10 - i*0.25)} ${x2} ${y2}`} stroke={f} strokeWidth={unit()} fill="none"/>;
        }
        if (side==="left") {
          const x1 = C(5), y1 = C(6+i), x2 = C(7.5), y2 = C(7.5);
          return <path key={i} d={`M ${x1} ${y1} Q ${C(5 + i*0.25)} ${C(7.5)} ${x2} ${y2}`} stroke={f} strokeWidth={unit()} fill="none"/>;
        }
        // right
        const x1 = C(10), y1 = C(6+i), x2 = C(7.5), y2 = C(7.5);
        return <path key={i} d={`M ${x1} ${y1} Q ${C(10 - i*0.25)} ${C(7.5)} ${x2} ${y2}`} stroke={f} strokeWidth={unit()} fill="none"/>;
      })}
    </g>
  );

  function unit() { return C(1) - C(0) - 1.2; }
}

function Labels({ C }:{ C:(n:number)=>number }) {
  const txt = (x:number,y:number,rot:number,str:string)=>(
    <text x={x} y={y} transform={`rotate(${rot}, ${x}, ${y})`}
          fontSize="12" fontWeight={800} fill="#fff" opacity=".95" textAnchor="middle">
      {str}
    </text>
  );
  return (
    <g>
      {txt(C(2.5),  C(4.7), 0, "SALIDA")}
      {txt(C(12.5), C(4.7), 0, "SALIDA")}
      {txt(C(2.5),  C(10.6), 0, "SEGURO")}
      {txt(C(12.5), C(10.6), 0, "SEGURO")}
      {txt(C(7.5),  C(2.7), 0, "SEGURO")}
      {txt(C(7.5),  C(12.8), 0, "SEGURO")}
      {txt(C(7.5),  C(7.9), 0, "LLEGADA")}
    </g>
  );
}

/* ===== util: aclarar/oscurecer color ===== */
function shade(hex: string, amt: number) {
  const h = hex.replace("#",""); const n = parseInt(h,16);
  let r = (n>>16)&255, g = (n>>8)&255, b = n&255;
  r = Math.max(0, Math.min(255, Math.round(r + 255*amt)));
  g = Math.max(0, Math.min(255, Math.round(g + 255*amt)));
  b = Math.max(0, Math.min(255, Math.round(b + 255*amt)));
  return `rgb(${r},${g},${b})`;
}

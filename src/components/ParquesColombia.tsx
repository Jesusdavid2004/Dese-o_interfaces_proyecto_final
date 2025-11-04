"use client";

import { useState } from "react";
import Dice3D from "@/components/Dice3D";
/* eslint-disable @typescript-eslint/no-explicit-any */

/* ================== Tipos / Constantes ================== */

type ColorKey = "red" | "blue" | "green" | "yellow";
type Token = { pos: number };
type Player = { color: ColorKey; tokens: Token[] };

const COLORS: Record<ColorKey, { hex: string; label: string }> = {
  red:    { hex: "#ef4444", label: "ROJO" },
  blue:   { hex: "#3b82f6", label: "AZUL" },
  green:  { hex: "#22c55e", label: "VERDE" },
  yellow: { hex: "#fbbf24", label: "AMARILLO" },
};

const START_POS: Record<ColorKey, number> = {
  red: 5, green: 22, yellow: 39, blue: 56
};

const SAFE_CELLS = new Set([5, 12, 22, 29, 39, 46, 56, 63]);

const nextPlayer = (p: ColorKey): ColorKey =>
  p === "red" ? "green" : p === "green" ? "yellow" : p === "yellow" ? "blue" : "red";

/* ================== Componente Principal ================== */

export default function ParquesColombia() {
  const [players, setPlayers] = useState<Player[]>([
    { color: "red", tokens: [{ pos: -1 }, { pos: -1 }, { pos: -1 }, { pos: -1 }] },
    { color: "green", tokens: [{ pos: -1 }, { pos: -1 }, { pos: -1 }, { pos: -1 }] },
    { color: "yellow", tokens: [{ pos: -1 }, { pos: -1 }, { pos: -1 }, { pos: -1 }] },
    { color: "blue", tokens: [{ pos: -1 }, { pos: -1 }, { pos: -1 }, { pos: -1 }] },
  ]);
  
  const [turn, setTurn] = useState<ColorKey>("red");
  const [dice1, setDice1] = useState<number>(0);
  const [dice2, setDice2] = useState<number>(0);
  const [usedDice, setUsedDice] = useState<[boolean, boolean]>([false, false]);
  const [hint, setHint] = useState("Lanza los dados para comenzar");

  const currentPlayer = players.find(p => p.color === turn)!;

  function handleDice1Roll(value: number) {
    if (dice1 > 0) return;
    
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice1(value);
    setDice2(d2);
    setUsedDice([false, false]);
    
    if (value === d2) {
      setHint(`¡Pares! ${value} y ${d2}. Mueve y tira de nuevo.`);
    } else {
      setHint(`Dados: ${value} y ${d2}. Mueve tus fichas.`);
    }
  }

  function handleTokenClick(tokenIdx: number) {
    if (dice1 === 0) {
      setHint("Primero lanza los dados");
      return;
    }

    // Lógica simplificada de movimiento
    const token = currentPlayer.tokens[tokenIdx];
    const diceToUse = !usedDice[0] ? dice1 : dice2;
    
    // Salir de la cárcel con 5
    if (token.pos === -1) {
      if (dice1 !== 5 && dice2 !== 5 && dice1 + dice2 !== 5) {
        setHint("Necesitas un 5 para salir");
        return;
      }
      moveToken(tokenIdx, START_POS[turn]);
      markDiceUsed();
      return;
    }

    // Movimiento normal
    const newPos = (token.pos + diceToUse) % 68;
    moveToken(tokenIdx, newPos);
    markDiceUsed();
  }

  function moveToken(tokenIdx: number, newPos: number) {
    const newPlayers = [...players];
    const playerIdx = newPlayers.findIndex(p => p.color === turn);
    newPlayers[playerIdx].tokens[tokenIdx].pos = newPos;
    setPlayers(newPlayers);
  }

  function markDiceUsed() {
    const newUsed: [boolean, boolean] = [...usedDice];
    if (!newUsed[0]) newUsed[0] = true;
    else if (!newUsed[1]) newUsed[1] = true;
    setUsedDice(newUsed);

    // Si ambos dados están usados
    if (newUsed[0] && newUsed[1]) {
      // Si sacó pares, sigue jugando
      if (dice1 === dice2) {
        setDice1(0);
        setDice2(0);
        setUsedDice([false, false]);
        setHint("¡Pares! Lanza de nuevo");
      } else {
        // Cambiar turno
        setTimeout(() => {
          const next = nextPlayer(turn);
          setTurn(next);
          setDice1(0);
          setDice2(0);
          setUsedDice([false, false]);
          setHint(`Turno de ${COLORS[next].label}`);
        }, 500);
      }
    }
  }

  return (
    <div className="w-full">
      {/* Header con turno */}
      <div className="text-center mb-3">
        <div 
          className="inline-block px-5 py-2 rounded-full border-2 backdrop-blur-sm mb-2"
          style={{ 
            borderColor: COLORS[turn].hex,
            backgroundColor: `${COLORS[turn].hex}15`
          }}
        >
          <span className="text-base font-bold" style={{ color: COLORS[turn].hex }}>
            Turno: {COLORS[turn].label}
          </span>
        </div>
        <p className="text-xs text-gray-400">{hint}</p>
        {(dice1 > 0 || dice2 > 0) && (
          <p className="text-xs text-gray-500 mt-1">
            Dados: {dice1} {usedDice[0] ? "✓" : "○"} | {dice2} {usedDice[1] ? "✓" : "○"}
          </p>
        )}
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-4">
        
        {/* Tablero */}
        <BoardSVG 
          players={players}
          turn={turn}
          onTokenClick={handleTokenClick}
        />

        {/* Dados */}
        <div className="flex lg:flex-col gap-3">
          <DiceContainer 
            value={dice1}
            used={usedDice[0]}
            onRoll={handleDice1Roll}
            label="Dado 1"
          />
          <DiceContainer 
            value={dice2}
            used={usedDice[1]}
            onRoll={() => {}}
            label="Dado 2"
            disabled
          />
        </div>
      </div>
    </div>
  );
}

/* ================== Componente Dado ================== */

function DiceContainer({ 
  value, 
  used,
  onRoll, 
  label,
  disabled = false
}: { 
  value: number; 
  used: boolean;
  onRoll: (v: number) => void; 
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <div 
        className={`relative w-20 h-20 rounded-xl shadow-xl border-2 border-gray-700 bg-zinc-900/90 backdrop-blur flex items-center justify-center transition-opacity ${
          used ? 'opacity-40' : ''
        }`}
      >
        {value === 0 && !disabled ? (
          <div style={{ ["--dice-size" as any]: "72px" }}>
            <Dice3D onRoll={onRoll} size={72} />
          </div>
        ) : value > 0 ? (
          <DiceFace value={value} />
        ) : (
          <div className="text-2xl text-gray-600">?</div>
        )}
      </div>
      {!disabled && value === 0 && <p className="text-xs text-gray-500">Click aquí</p>}
    </div>
  );
}

function DiceFace({ value }: { value: number }) {
  const dots: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]],
  };

  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12">
      {dots[value]?.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" fill="#ffffff" />
      ))}
    </svg>
  );
}

/* ================== Tablero SVG ================== */

function BoardSVG({
  players,
  turn,
  onTokenClick,
}: {
  players: Player[];
  turn: ColorKey;
  onTokenClick: (idx: number) => void;
}) {
  const size = 560;
  const cell = size / 15;

  // Posiciones de fichas en patios (cárceles)
  const jailPositions: Record<ColorKey, [number, number][]> = {
    red: [
      [cell * 10.8, cell * 1.2], [cell * 12.2, cell * 1.2],
      [cell * 10.8, cell * 2.6], [cell * 12.2, cell * 2.6]
    ],
    blue: [
      [cell * 1.2, cell * 1.2], [cell * 2.6, cell * 1.2],
      [cell * 1.2, cell * 2.6], [cell * 2.6, cell * 2.6]
    ],
    green: [
      [cell * 1.2, cell * 10.8], [cell * 2.6, cell * 10.8],
      [cell * 1.2, cell * 12.2], [cell * 2.6, cell * 12.2]
    ],
    yellow: [
      [cell * 10.8, cell * 10.8], [cell * 12.2, cell * 10.8],
      [cell * 10.8, cell * 12.2], [cell * 12.2, cell * 12.2]
    ],
  };

  function getTokenXY(color: ColorKey, pos: number, idx: number): [number, number] {
    if (pos === -1) {
      return jailPositions[color][idx];
    }
    
    // Posiciones del tablero circular simplificado
    const angle = (pos / 68) * Math.PI * 2 - Math.PI / 2;
    const radius = cell * 4;
    const x = cell * 7.5 + Math.cos(angle) * radius;
    const y = cell * 7.5 + Math.sin(angle) * radius;
    
    return [x, y];
  }

  const allTokens = players.flatMap((p, pidx) =>
    p.tokens.map((t, tidx) => ({
      color: p.color,
      pos: t.pos,
      playerIdx: pidx,
      tokenIdx: tidx,
    }))
  );

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className="w-full max-w-[500px] drop-shadow-2xl rounded-2xl"
      style={{ background: '#fce4ec' }}
    >
      {/* Patios/Cárceles en las 4 esquinas */}
      <rect x={cell * 9.5} y={cell * 0.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.red.hex} stroke="#000" strokeWidth="2" rx="12" />
      <rect x={cell * 0.5} y={cell * 0.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="2" rx="12" />
      <rect x={cell * 0.5} y={cell * 9.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.green.hex} stroke="#000" strokeWidth="2" rx="12" />
      <rect x={cell * 9.5} y={cell * 9.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="2" rx="12" />

      {/* Caminos (simplificados) */}
      <rect x={cell * 4.5} y={0} width={cell * 3} height={cell * 5} 
            fill="#87ceeb" stroke="#000" strokeWidth="1.5" />
      <rect x={cell * 7.5} y={0} width={cell * 2} height={cell * 5} 
            fill="#ffb6c1" stroke="#000" strokeWidth="1.5" />
      
      <rect x={0} y={cell * 4.5} width={cell * 5} height={cell * 3} 
            fill="#90ee90" stroke="#000" strokeWidth="1.5" />
      <rect x={0} y={cell * 7.5} width={cell * 5} height={cell * 2} 
            fill="#87ceeb" stroke="#000" strokeWidth="1.5" />
      
      <rect x={cell * 9.5} y={cell * 4.5} width={cell * 5} height={cell * 3} 
            fill="#ffeb99" stroke="#000" strokeWidth="1.5" />
      <rect x={cell * 9.5} y={cell * 7.5} width={cell * 5} height={cell * 2} 
            fill="#ffb6c1" stroke="#000" strokeWidth="1.5" />
      
      <rect x={cell * 4.5} y={cell * 9.5} width={cell * 3} height={cell * 5} 
            fill="#90ee90" stroke="#000" strokeWidth="1.5" />
      <rect x={cell * 7.5} y={cell * 9.5} width={cell * 2} height={cell * 5} 
            fill="#ffeb99" stroke="#000" strokeWidth="1.5" />

      {/* Centro (Llegada) */}
      <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 2.2} 
              fill="#fff" stroke="#000" strokeWidth="3" />
      
      {/* Triángulos de llegada */}
      <path d={`M ${cell * 7.5} ${cell * 5.3} L ${cell * 6} ${cell * 7.5} L ${cell * 9} ${cell * 7.5} Z`}
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="2" />
      <path d={`M ${cell * 9.7} ${cell * 7.5} L ${cell * 7.5} ${cell * 6} L ${cell * 7.5} ${cell * 9} Z`}
            fill={COLORS.red.hex} stroke="#000" strokeWidth="2" />
      <path d={`M ${cell * 7.5} ${cell * 9.7} L ${cell * 6} ${cell * 7.5} L ${cell * 9} ${cell * 7.5} Z`}
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="2" />
      <path d={`M ${cell * 5.3} ${cell * 7.5} L ${cell * 7.5} ${cell * 6} L ${cell * 7.5} ${cell * 9} Z`}
            fill={COLORS.green.hex} stroke="#000" strokeWidth="2" />

      <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 0.6} 
              fill="#ffd700" stroke="#000" strokeWidth="2" />

      {/* Grid */}
      {Array.from({ length: 15 }).map((_, i) => (
        <g key={`grid-${i}`}>
          <line x1={i * cell} y1={0} x2={i * cell} y2={size} 
                stroke="#000" strokeWidth="0.5" opacity="0.2" />
          <line x1={0} y1={i * cell} x2={size} y2={i * cell} 
                stroke="#000" strokeWidth="0.5" opacity="0.2" />
        </g>
      ))}

      {/* Fichas */}
      {allTokens.map((t, idx) => {
        const isMine = t.color === turn;
        const [x, y] = getTokenXY(t.color, t.pos, t.tokenIdx);

        return (
          <g
            key={`token-${idx}`}
            onClick={() => isMine && onTokenClick(t.tokenIdx)}
            style={{ cursor: isMine ? "pointer" : "default" }}
          >
            {isMine && (
              <circle
                cx={x}
                cy={y}
                r={cell * 0.5}
                fill={COLORS[t.color].hex}
                opacity="0.3"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.6;0.2"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={cell * 0.35}
              fill={COLORS[t.color].hex}
              stroke="#000"
              strokeWidth="2"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
            />
            <circle
              cx={x - cell * 0.12}
              cy={y - cell * 0.12}
              r={cell * 0.12}
              fill="rgba(255,255,255,0.6)"
            />
          </g>
        );
      })}
    </svg>
  );
}

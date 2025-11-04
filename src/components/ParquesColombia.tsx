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
  const [diceRolled, setDiceRolled] = useState(false);
  const [hint, setHint] = useState("Lanza los dados para comenzar");

  const currentPlayer = players.find(p => p.color === turn)!;

  function handleDice1Roll(value: number) {
    if (diceRolled) return;
    setDice1(value);
  }

  function handleDice2Roll(value: number) {
    if (diceRolled) return;
    setDice2(value);
    
    // Cuando el segundo dado termine de girar, evaluamos
    setDiceRolled(true);
    setUsedDice([false, false]);
    
    if (dice1 === value) {
      setHint(`¡Pares! ${dice1} y ${value}. Mueve y tira de nuevo.`);
    } else {
      setHint(`Dados: ${dice1} y ${value}. Mueve tus fichas.`);
    }
  }

  function handleTokenClick(tokenIdx: number) {
    if (!diceRolled) {
      setHint("Primero lanza ambos dados");
      return;
    }

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

    if (newUsed[0] && newUsed[1]) {
      if (dice1 === dice2) {
        resetDice();
        setHint("¡Pares! Lanza de nuevo");
      } else {
        setTimeout(() => {
          const next = nextPlayer(turn);
          setTurn(next);
          resetDice();
          setHint(`Turno de ${COLORS[next].label}`);
        }, 500);
      }
    }
  }

  function resetDice() {
    setDice1(0);
    setDice2(0);
    setUsedDice([false, false]);
    setDiceRolled(false);
  }

  return (
    <div className="w-full">
      {/* Header con turno */}
      <div className="text-center mb-4">
        <div 
          className="inline-block px-6 py-2.5 rounded-full border-2 backdrop-blur-sm mb-2"
          style={{ 
            borderColor: COLORS[turn].hex,
            backgroundColor: `${COLORS[turn].hex}20`
          }}
        >
          <span className="text-lg font-bold" style={{ color: COLORS[turn].hex }}>
            Turno: {COLORS[turn].label}
          </span>
        </div>
        <p className="text-sm text-gray-300 dark:text-gray-400">{hint}</p>
        {diceRolled && (
          <p className="text-xs text-gray-400 mt-1">
            Dados: {dice1} {usedDice[0] ? "✓" : "○"} | {dice2} {usedDice[1] ? "✓" : "○"}
          </p>
        )}
      </div>

      {/* Layout principal - MÁS GRANDE */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
        
        {/* Tablero - Más grande */}
        <div className="flex-shrink-0">
          <BoardSVG 
            players={players}
            turn={turn}
            onTokenClick={handleTokenClick}
          />
        </div>

        {/* Dados - Ambos con Dice3D */}
        <div className="flex flex-row lg:flex-col gap-4">
          <DiceContainer 
            value={dice1}
            used={usedDice[0]}
            onRoll={handleDice1Roll}
            label="Dado 1"
            disabled={diceRolled}
          />
          <DiceContainer 
            value={dice2}
            used={usedDice[1]}
            onRoll={handleDice2Roll}
            label="Dado 2"
            disabled={diceRolled || dice1 === 0}
          />
        </div>
      </div>
    </div>
  );
}

/* ================== Componente Dado - MEJORADO ================== */

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
      <p className="text-xs text-gray-300 dark:text-gray-400 font-medium">{label}</p>
      <div 
        className={`relative w-24 h-24 rounded-xl shadow-xl border-2 border-gray-700 dark:border-gray-600 bg-gray-900/80 backdrop-blur flex items-center justify-center transition-all ${
          used ? 'opacity-40' : ''
        } ${disabled && value === 0 ? 'opacity-50' : ''}`}
      >
        {value === 0 ? (
          <div style={{ ["--dice-size" as any]: "88px" }}>
            <Dice3D onRoll={onRoll} size={88} disabled={disabled} />
          </div>
        ) : (
          <DiceFace value={value} />
        )}
      </div>
      {!disabled && value === 0 && (
        <p className="text-xs text-gray-400">Click aquí</p>
      )}
      {disabled && value === 0 && dice1 === 0 && (
        <p className="text-xs text-gray-500">Esperando...</p>
      )}
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
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      {dots[value]?.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="#ffffff" />
      ))}
    </svg>
  );
}

/* ================== Tablero SVG - MÁS GRANDE ================== */

function BoardSVG({
  players,
  turn,
  onTokenClick,
}: {
  players: Player[];
  turn: ColorKey;
  onTokenClick: (idx: number) => void;
}) {
  const size = 680; // Aumentado de 560 a 680
  const cell = size / 15;

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
      className="w-full max-w-[680px] drop-shadow-2xl rounded-2xl"
      style={{ background: '#fce4ec' }}
    >
      {/* Patios/Cárceles */}
      <rect x={cell * 9.5} y={cell * 0.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.red.hex} stroke="#000" strokeWidth="3" rx="16" />
      <rect x={cell * 0.5} y={cell * 0.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="3" rx="16" />
      <rect x={cell * 0.5} y={cell * 9.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.green.hex} stroke="#000" strokeWidth="3" rx="16" />
      <rect x={cell * 9.5} y={cell * 9.5} width={cell * 4} height={cell * 4} 
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="3" rx="16" />

      {/* Caminos */}
      <rect x={cell * 4.5} y={0} width={cell * 3} height={cell * 5} 
            fill="#87ceeb" stroke="#000" strokeWidth="2" />
      <rect x={cell * 7.5} y={0} width={cell * 2} height={cell * 5} 
            fill="#ffb6c1" stroke="#000" strokeWidth="2" />
      
      <rect x={0} y={cell * 4.5} width={cell * 5} height={cell * 3} 
            fill="#90ee90" stroke="#000" strokeWidth="2" />
      <rect x={0} y={cell * 7.5} width={cell * 5} height={cell * 2} 
            fill="#87ceeb" stroke="#000" strokeWidth="2" />
      
      <rect x={cell * 9.5} y={cell * 4.5} width={cell * 5} height={cell * 3} 
            fill="#ffeb99" stroke="#000" strokeWidth="2" />
      <rect x={cell * 9.5} y={cell * 7.5} width={cell * 5} height={cell * 2} 
            fill="#ffb6c1" stroke="#000" strokeWidth="2" />
      
      <rect x={cell * 4.5} y={cell * 9.5} width={cell * 3} height={cell * 5} 
            fill="#90ee90" stroke="#000" strokeWidth="2" />
      <rect x={cell * 7.5} y={cell * 9.5} width={cell * 2} height={cell * 5} 
            fill="#ffeb99" stroke="#000" strokeWidth="2" />

      {/* Centro (Llegada) */}
      <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 2.3} 
              fill="#fff" stroke="#000" strokeWidth="3" />
      
      {/* Triángulos */}
      <path d={`M ${cell * 7.5} ${cell * 5.2} L ${cell * 5.8} ${cell * 7.5} L ${cell * 9.2} ${cell * 7.5} Z`}
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="2" />
      <path d={`M ${cell * 9.8} ${cell * 7.5} L ${cell * 7.5} ${cell * 5.8} L ${cell * 7.5} ${cell * 9.2} Z`}
            fill={COLORS.red.hex} stroke="#000" strokeWidth="2" />
      <path d={`M ${cell * 7.5} ${cell * 9.8} L ${cell * 5.8} ${cell * 7.5} L ${cell * 9.2} ${cell * 7.5} Z`}
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="2" />
      <path d={`M ${cell * 5.2} ${cell * 7.5} L ${cell * 7.5} ${cell * 5.8} L ${cell * 7.5} ${cell * 9.2} Z`}
            fill={COLORS.green.hex} stroke="#000" strokeWidth="2" />

      <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 0.65} 
              fill="#ffd700" stroke="#000" strokeWidth="2" />

      {/* Textos "Salida" */}
      <text x={cell * 2.5} y={cell * 2.5} fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>
      <text x={cell * 12} y={cell * 2.5} fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>
      <text x={cell * 2.5} y={cell * 12} fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>
      <text x={cell * 12} y={cell * 12} fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>

      {/* Grid */}
      {Array.from({ length: 15 }).map((_, i) => (
        <g key={`grid-${i}`}>
          <line x1={i * cell} y1={0} x2={i * cell} y2={size} 
                stroke="#000" strokeWidth="0.8" opacity="0.25" />
          <line x1={0} y1={i * cell} x2={size} y2={i * cell} 
                stroke="#000" strokeWidth="0.8" opacity="0.25" />
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
                r={cell * 0.55}
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
              r={cell * 0.38}
              fill={COLORS[t.color].hex}
              stroke="#000"
              strokeWidth="2.5"
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
            />
            <circle
              cx={x - cell * 0.13}
              cy={y - cell * 0.13}
              r={cell * 0.13}
              fill="rgba(255,255,255,0.65)"
            />
          </g>
        );
      })}
    </svg>
  );
}

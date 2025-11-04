"use client";

import { useState, useEffect } from "react";
import Dice3D from "@/components/Dice3D";
/* eslint-disable @typescript-eslint/no-explicit-any */

/* ================== Tipos / Constantes ================== */

type ColorKey = "red" | "blue" | "green" | "yellow";
type Token = { pos: number; id: string };
type Player = { 
  color: ColorKey; 
  name: string;
  tokens: Token[];
  turnsWithoutPairs: number;
  finished: number;
};

type GamePhase = "order" | "playing";

const COLORS: Record<ColorKey, { hex: string; label: string }> = {
  red:    { hex: "#ef4444", label: "ROJO" },
  blue:   { hex: "#3b82f6", label: "AZUL" },
  green:  { hex: "#22c55e", label: "VERDE" },
  yellow: { hex: "#fbbf24", label: "AMARILLO" },
};

// 100 casillas en total (68 exteriores + 8 recta final por jugador)
const BOARD_CELLS = 68;

// Posiciones de salida de cárcel
const START_POS: Record<ColorKey, number> = {
  red: 5, blue: 22, green: 39, yellow: 56
};

// Casilla donde entran a la recta final
const FINAL_ENTRY: Record<ColorKey, number> = {
  red: 68, blue: 17, green: 34, yellow: 51
};

// Primera casilla de recta final (8 casillas: 100-107, 110-117, etc.)
const FINAL_START: Record<ColorKey, number> = {
  red: 100, blue: 110, green: 120, yellow: 130
};

// Casillas seguras (8 en total)
const SAFE_CELLS = new Set([5, 12, 22, 29, 39, 46, 56, 63]);

// Posiciones de salida (también son seguras)
const EXIT_CELLS = new Set([5, 22, 39, 56]);

const nextPlayer = (p: ColorKey): ColorKey =>
  p === "red" ? "blue" : p === "blue" ? "green" : p === "green" ? "yellow" : "red";

/* ================== Componente Principal ================== */

export default function ParquesColombia() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("order");
  const [players, setPlayers] = useState<Player[]>([
    { 
      color: "red", 
      name: "Jugador 1",
      tokens: [
        { pos: -1, id: "r1" }, 
        { pos: -1, id: "r2" },
        { pos: -1, id: "r3" },
        { pos: -1, id: "r4" }
      ],
      turnsWithoutPairs: 0,
      finished: 0
    },
    { 
      color: "blue", 
      name: "Jugador 2",
      tokens: [
        { pos: -1, id: "b1" }, 
        { pos: -1, id: "b2" },
        { pos: -1, id: "b3" },
        { pos: -1, id: "b4" }
      ],
      turnsWithoutPairs: 0,
      finished: 0
    },
    { 
      color: "green", 
      name: "Jugador 3",
      tokens: [
        { pos: -1, id: "g1" }, 
        { pos: -1, id: "g2" },
        { pos: -1, id: "g3" },
        { pos: -1, id: "g4" }
      ],
      turnsWithoutPairs: 0,
      finished: 0
    },
    { 
      color: "yellow", 
      name: "Jugador 4",
      tokens: [
        { pos: -1, id: "y1" }, 
        { pos: -1, id: "y2" },
        { pos: -1, id: "y3" },
        { pos: -1, id: "y4" }
      ],
      turnsWithoutPairs: 0,
      finished: 0
    },
  ]);
  
  const [playerOrder, setPlayerOrder] = useState<ColorKey[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice1, setDice1] = useState<number>(0);
  const [dice2, setDice2] = useState<number>(0);
  const [usedDice, setUsedDice] = useState<[boolean, boolean]>([false, false]);
  const [diceRolled, setDiceRolled] = useState(false);
  const [hint, setHint] = useState("Determinar orden: Cada jugador lanza los dados");
  const [orderRolls, setOrderRolls] = useState<{ color: ColorKey; sum: number }[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [pairAttempts, setPairAttempts] = useState(0);

  const currentColor = playerOrder[currentPlayerIndex] || "red";
  const currentPlayer = players.find(p => p.color === currentColor)!;

  // Determinar orden inicial
  function handleOrderRoll(value: number) {
    if (gamePhase !== "order" || diceRolled) return;
    
    setDice1(value);
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice2(d2);
    setDiceRolled(true);

    const sum = value + d2;
    const playerColor = ["red", "blue", "green", "yellow"][orderRolls.length] as ColorKey;
    
    const newRolls = [...orderRolls, { color: playerColor, sum }];
    setOrderRolls(newRolls);

    if (newRolls.length === 4) {
      // Ordenar de mayor a menor
      const sorted = [...newRolls].sort((a, b) => b.sum - a.sum);
      const order = sorted.map(r => r.color);
      setPlayerOrder(order);
      setGamePhase("playing");
      setHint(`Comienza ${COLORS[order[0]].label}. Lanza los dados para intentar sacar pares.`);
      
      setTimeout(() => {
        setDice1(0);
        setDice2(0);
        setDiceRolled(false);
      }, 2000);
    } else {
      setHint(`${COLORS[playerColor].label}: ${sum}. Siguiente jugador.`);
      setTimeout(() => {
        setDice1(0);
        setDice2(0);
        setDiceRolled(false);
      }, 1500);
    }
  }

  function handleDice1Roll(value: number) {
    if (gamePhase === "order") {
      handleOrderRoll(value);
      return;
    }

    if (diceRolled) return;
    setDice1(value);
  }

  function handleDice2Roll(value: number) {
    if (gamePhase === "order") return;
    if (diceRolled) return;
    
    setDice2(value);
    setDiceRolled(true);
    setUsedDice([false, false]);
    
    const isPair = dice1 === value;
    
    // Revisar si todas las fichas están en la cárcel
    const allInJail = currentPlayer.tokens.every(t => t.pos === -1);
    
    if (allInJail) {
      if (isPair) {
        setHint(`¡Pares! ${dice1} y ${value}. Saca una ficha de la cárcel.`);
        setPairAttempts(0);
      } else {
        const newAttempts = pairAttempts + 1;
        setPairAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setHint(`3 intentos sin pares. Turno del siguiente jugador.`);
          setTimeout(() => passTurn(), 2000);
        } else {
          setHint(`No sacaste pares (${3 - newAttempts} intentos restantes). Intenta de nuevo.`);
          setTimeout(() => {
            setDice1(0);
            setDice2(0);
            setDiceRolled(false);
          }, 1500);
        }
      }
    } else {
      if (isPair) {
        setHint(`¡Pares! ${dice1} y ${value}. Mueve y vuelve a tirar.`);
      } else {
        setHint(`Dados: ${dice1} y ${value}. Mueve tus fichas.`);
      }
    }
  }

  function handleTokenClick(tokenIdx: number) {
    if (!diceRolled || gamePhase !== "playing") {
      setHint("Primero lanza los dados");
      return;
    }

    const token = currentPlayer.tokens[tokenIdx];
    const diceToUse = !usedDice[0] ? dice1 : dice2;
    const isPair = dice1 === dice2;
    
    // Salir de la cárcel solo con pares
    if (token.pos === -1) {
      if (!isPair) {
        setHint("Solo puedes salir con pares");
        return;
      }
      
      moveToken(tokenIdx, START_POS[currentColor]);
      markDiceUsed();
      return;
    }

    // Movimiento normal
    let newPos = token.pos;
    
    // Si está en el tablero exterior (1-68)
    if (token.pos < 100) {
      newPos = token.pos + diceToUse;
      
      // Verificar entrada a recta final
      const entryPoint = FINAL_ENTRY[currentColor];
      if (token.pos < entryPoint && newPos >= entryPoint) {
        const remaining = newPos - entryPoint;
        newPos = FINAL_START[currentColor] + remaining;
      } else if (newPos > BOARD_CELLS) {
        newPos = newPos % BOARD_CELLS || BOARD_CELLS;
      }
    } else {
      // Está en recta final (100+)
      const finalStart = FINAL_START[currentColor];
      const currentOffset = token.pos - finalStart;
      const newOffset = currentOffset + diceToUse;
      
      if (newOffset === 8) {
        // ¡Llegó!
        newPos = 999; // Posición de llegada
      } else if (newOffset < 8) {
        newPos = finalStart + newOffset;
      } else {
        setHint("Debes caer exactamente en la llegada");
        return;
      }
    }

    moveToken(tokenIdx, newPos);
    markDiceUsed();
  }

  function moveToken(tokenIdx: number, newPos: number) {
    const newPlayers = [...players];
    const playerIdx = newPlayers.findIndex(p => p.color === currentColor);
    
    // Captura solo si no es zona segura
    if (newPos >= 1 && newPos <= BOARD_CELLS && !SAFE_CELLS.has(newPos)) {
      for (let i = 0; i < newPlayers.length; i++) {
        if (i === playerIdx) continue;
        
        newPlayers[i].tokens.forEach(t => {
          if (t.pos === newPos) {
            t.pos = -1; // Enviar a cárcel
            setHint(`¡Captura! Enviaste una ficha a la cárcel.`);
          }
        });
      }
    }
    
    if (newPos === 999) {
      // Llegó a la meta
      newPlayers[playerIdx].finished++;
      newPlayers[playerIdx].tokens.splice(tokenIdx, 1);
      
      if (newPlayers[playerIdx].tokens.length === 0) {
        setWinner(newPlayers[playerIdx].name);
      } else {
        setHint(`¡Ficha en meta! Te quedan ${newPlayers[playerIdx].tokens.length} fichas.`);
      }
    } else {
      newPlayers[playerIdx].tokens[tokenIdx].pos = newPos;
    }
    
    setPlayers(newPlayers);
  }

  function markDiceUsed() {
    const newUsed: [boolean, boolean] = [...usedDice];
    if (!newUsed[0]) newUsed[0] = true;
    else if (!newUsed[1]) newUsed[1] = true;
    setUsedDice(newUsed);

    if (newUsed[0] && newUsed[1]) {
      const isPair = dice1 === dice2;
      
      if (isPair) {
        setTimeout(() => {
          setDice1(0);
          setDice2(0);
          setUsedDice([false, false]);
          setDiceRolled(false);
          setHint("¡Pares! Lanza de nuevo");
        }, 800);
      } else {
        setTimeout(() => passTurn(), 1000);
      }
    }
  }

  function passTurn() {
    const nextIndex = (currentPlayerIndex + 1) % playerOrder.length;
    setCurrentPlayerIndex(nextIndex);
    setPairAttempts(0);
    setDice1(0);
    setDice2(0);
    setUsedDice([false, false]);
    setDiceRolled(false);
    
    const nextColor = playerOrder[nextIndex];
    setHint(`Turno de ${COLORS[nextColor].label}`);
  }

  if (winner) {
    return (
      <div className="w-full text-center py-12">
        <h1 className="text-5xl font-bold mb-4 text-yellow-400">
          🏆 ¡{winner} GANÓ! 🏆
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-lg"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header con información del juego */}
      <div className="text-center mb-4">
        {gamePhase === "order" ? (
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 backdrop-blur-sm mb-2">
            <span className="text-lg font-bold text-purple-300">
              🎲 Determinando Orden de Juego
            </span>
          </div>
        ) : (
          <div 
            className="inline-block px-6 py-3 rounded-full border-2 backdrop-blur-sm mb-2"
            style={{ 
              borderColor: COLORS[currentColor].hex,
              backgroundColor: `${COLORS[currentColor].hex}25`
            }}
          >
            <span className="text-lg font-bold" style={{ color: COLORS[currentColor].hex }}>
              Turno: {currentPlayer?.name} ({COLORS[currentColor].label})
            </span>
          </div>
        )}
        
        <p className="text-sm text-gray-300 dark:text-gray-400 mb-1">{hint}</p>
        
        {gamePhase === "playing" && (
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span>Fichas en meta: {currentPlayer?.finished || 0}/4</span>
            {pairAttempts > 0 && <span>Intentos: {pairAttempts}/3</span>}
          </div>
        )}
        
        {diceRolled && (
          <p className="text-xs text-gray-400 mt-1">
            Dados: {dice1} {usedDice[0] ? "✓" : "○"} | {dice2} {usedDice[1] ? "✓" : "○"}
          </p>
        )}
      </div>

      {/* Layout principal - MÁS GRANDE */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
        
        {/* Tablero más grande */}
        <div className="flex-shrink-0">
          <BoardSVG 
            players={players}
            currentColor={currentColor}
            onTokenClick={handleTokenClick}
            gamePhase={gamePhase}
          />
        </div>

        {/* Dados */}
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
            waitingForFirst={dice1 === 0}
          />
        </div>
      </div>

      {/* Orden de jugadores */}
      {gamePhase === "playing" && playerOrder.length > 0 && (
        <div className="mt-6 flex justify-center gap-2">
          {playerOrder.map((color, idx) => (
            <div 
              key={color}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                idx === currentPlayerIndex 
                  ? 'scale-110 shadow-lg' 
                  : 'opacity-50'
              }`}
              style={{ 
                borderColor: COLORS[color].hex,
                backgroundColor: `${COLORS[color].hex}20`
              }}
            >
              <span className="text-sm font-bold" style={{ color: COLORS[color].hex }}>
                {idx + 1}º {COLORS[color].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================== Componente Dado ================== */

function DiceContainer({ 
  value, 
  used,
  onRoll, 
  label,
  disabled = false,
  waitingForFirst = false
}: { 
  value: number; 
  used: boolean;
  onRoll: (v: number) => void; 
  label: string;
  disabled?: boolean;
  waitingForFirst?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-300 dark:text-gray-400 font-semibold">{label}</p>
      <div 
        className={`relative w-28 h-28 rounded-xl shadow-2xl border-3 border-gray-700 dark:border-gray-600 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur flex items-center justify-center transition-all ${
          used ? 'opacity-40' : ''
        } ${disabled && value === 0 ? 'opacity-50' : ''}`}
      >
        {value === 0 ? (
          <div style={{ ["--dice-size" as any]: "100px" }}>
            <Dice3D onRoll={onRoll} size={100} disabled={disabled} />
          </div>
        ) : (
          <DiceFace value={value} />
        )}
      </div>
      {!disabled && value === 0 && (
        <p className="text-xs text-green-400 font-medium">🎲 Click aquí</p>
      )}
      {waitingForFirst && (
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
    <svg viewBox="0 0 100 100" className="w-18 h-18">
      {dots[value]?.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9" fill="#ffffff" />
      ))}
    </svg>
  );
}

/* ================== Tablero SVG - MÁS GRANDE ================== */

function BoardSVG({
  players,
  currentColor,
  onTokenClick,
  gamePhase,
}: {
  players: Player[];
  currentColor: ColorKey;
  onTokenClick: (idx: number) => void;
  gamePhase: GamePhase;
}) {
  const size = 750; // Aumentado significativamente
  const cell = size / 15;

  const jailPositions: Record<ColorKey, [number, number][]> = {
    red: [
      [cell * 10.7, cell * 1.3], [cell * 12.3, cell * 1.3],
      [cell * 10.7, cell * 2.7], [cell * 12.3, cell * 2.7]
    ],
    blue: [
      [cell * 1.3, cell * 1.3], [cell * 2.7, cell * 1.3],
      [cell * 1.3, cell * 2.7], [cell * 2.7, cell * 2.7]
    ],
    green: [
      [cell * 1.3, cell * 10.7], [cell * 2.7, cell * 10.7],
      [cell * 1.3, cell * 12.3], [cell * 2.7, cell * 12.3]
    ],
    yellow: [
      [cell * 10.7, cell * 10.7], [cell * 12.3, cell * 10.7],
      [cell * 10.7, cell * 12.3], [cell * 12.3, cell * 12.3]
    ],
  };

  function getTokenXY(color: ColorKey, pos: number, idx: number): [number, number] {
    if (pos === -1) {
      return jailPositions[color][idx];
    }
    
    if (pos === 999) {
      // En la meta
      return [cell * 7.5, cell * 7.5];
    }
    
    // Recta final (100-107, 110-117, etc.)
    if (pos >= 100) {
      const base = FINAL_START[color];
      const offset = pos - base;
      
      if (color === "red") return [cell * 7.5, cell * (6 - offset * 0.7)];
      if (color === "blue") return [cell * (6 - offset * 0.7), cell * 7.5];
      if (color === "green") return [cell * 7.5, cell * (9 + offset * 0.7)];
      return [cell * (9 + offset * 0.7), cell * 7.5];
    }
    
    // Tablero circular
    const angle = (pos / BOARD_CELLS) * Math.PI * 2 - Math.PI / 2;
    const radius = cell * 4.2;
    const x = cell * 7.5 + Math.cos(angle) * radius;
    const y = cell * 7.5 + Math.sin(angle) * radius;
    
    return [x, y];
  }

  const allTokens = players.flatMap((p, pidx) =>
    p.tokens.map((t, tidx) => ({
      color: p.color,
      pos: t.pos,
      id: t.id,
      playerIdx: pidx,
      tokenIdx: tidx,
    }))
  );

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className="w-full max-w-[750px] drop-shadow-2xl rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #ffd1dc 100%)' }}
    >
      {/* Patios/Cárceles */}
      <rect x={cell * 9.5} y={cell * 0.5} width={cell * 4.5} height={cell * 4.5} 
            fill={COLORS.red.hex} stroke="#000" strokeWidth="4" rx="20" />
      <rect x={cell * 0.5} y={cell * 0.5} width={cell * 4.5} height={cell * 4.5} 
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="4" rx="20" />
      <rect x={cell * 0.5} y={cell * 9.5} width={cell * 4.5} height={cell * 4.5} 
            fill={COLORS.green.hex} stroke="#000" strokeWidth="4" rx="20" />
      <rect x={cell * 9.5} y={cell * 9.5} width={cell * 4.5} height={cell * 4.5} 
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="4" rx="20" />

      {/* Caminos */}
      <rect x={cell * 5} y={0} width={cell * 2.5} height={cell * 5.5} 
            fill="#87ceeb" stroke="#000" strokeWidth="2.5" />
      <rect x={cell * 7.5} y={0} width={cell * 2} height={cell * 5.5} 
            fill="#ffb6c1" stroke="#000" strokeWidth="2.5" />
      
      <rect x={0} y={cell * 5} width={cell * 5.5} height={cell * 2.5} 
            fill="#90ee90" stroke="#000" strokeWidth="2.5" />
      <rect x={0} y={cell * 7.5} width={cell * 5.5} height={cell * 2} 
            fill="#87ceeb" stroke="#000" strokeWidth="2.5" />
      
      <rect x={cell * 9.5} y={cell * 5} width={cell * 5.5} height={cell * 2.5} 
            fill="#ffeb99" stroke="#000" strokeWidth="2.5" />
      <rect x={cell * 9.5} y={cell * 7.5} width={cell * 5.5} height={cell * 2} 
            fill="#ffb6c1" stroke="#000" strokeWidth="2.5" />
      
      <rect x={cell * 5} y={cell * 9.5} width={cell * 2.5} height={cell * 5.5} 
            fill="#90ee90" stroke="#000" strokeWidth="2.5" />
      <rect x={cell * 7.5} y={cell * 9.5} width={cell * 2} height={cell * 5.5} 
            fill="#ffeb99" stroke="#000" strokeWidth="2.5" />

      {/* Centro (Llegada) */}
      <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 2.5} 
              fill="#fff" stroke="#000" strokeWidth="4" />
      
      {/* Triángulos */}
      <path d={`M ${cell * 7.5} ${cell * 5} L ${cell * 5.5} ${cell * 7.5} L ${cell * 9.5} ${cell * 7.5} Z`}
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="3" />
      <path d={`M ${cell * 10} ${cell * 7.5} L ${cell * 7.5} ${cell * 5.5} L ${cell * 7.5} ${cell * 9.5} Z`}
            fill={COLORS.red.hex} stroke="#000" strokeWidth="3" />
      <path d={`M ${cell * 7.5} ${cell * 10} L ${cell * 5.5} ${cell * 7.5} L ${cell * 9.5} ${cell * 7.5} Z`}
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="3" />
      <path d={`M ${cell * 5} ${cell * 7.5} L ${cell * 7.5} ${cell * 5.5} L ${cell * 7.5} ${cell * 9.5} Z`}
            fill={COLORS.green.hex} stroke="#000" strokeWidth="3" />

      <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 0.8} 
              fill="#ffd700" stroke="#000" strokeWidth="3" />

      {/* Textos */}
      <text x={cell * 2.5} y={cell * 2.8} fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>
      <text x={cell * 12} y={cell * 2.8} fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>
      <text x={cell * 2.5} y={cell * 12.2} fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>
      <text x={cell * 12} y={cell * 12.2} fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Salida</text>

      {/* Círculos de seguros */}
      {[5, 12, 22, 29, 39, 46, 56, 63].map((pos) => {
        const angle = (pos / BOARD_CELLS) * Math.PI * 2 - Math.PI / 2;
        const radius = cell * 4.2;
        const x = cell * 7.5 + Math.cos(angle) * radius;
        const y = cell * 7.5 + Math.sin(angle) * radius;
        
        return (
          <circle 
            key={`safe-${pos}`}
            cx={x} 
            cy={y} 
            r={cell * 0.3} 
            fill="rgba(255,255,255,0.7)" 
            stroke="#000" 
            strokeWidth="2"
          />
        );
      })}

      {/* Fichas */}
      {allTokens.map((t, idx) => {
        const isMine = t.color === currentColor && gamePhase === "playing";
        const [x, y] = getTokenXY(t.color, t.pos, t.tokenIdx);

        return (
          <g
            key={`token-${t.id}`}
            onClick={() => isMine && onTokenClick(t.tokenIdx)}
            style={{ cursor: isMine ? "pointer" : "default" }}
          >
            {isMine && (
              <circle
                cx={x}
                cy={y}
                r={cell * 0.6}
                fill={COLORS[t.color].hex}
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values={`${cell * 0.5};${cell * 0.65};${cell * 0.5}`}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={cell * 0.42}
              fill={COLORS[t.color].hex}
              stroke="#000"
              strokeWidth="3"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
            />
            <circle
              cx={x - cell * 0.15}
              cy={y - cell * 0.15}
              r={cell * 0.15}
              fill="rgba(255,255,255,0.7)"
            />
          </g>
        );
      })}
    </svg>
  );
}

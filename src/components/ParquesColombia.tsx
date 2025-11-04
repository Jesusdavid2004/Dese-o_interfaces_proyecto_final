"use client";

import { useState } from "react";
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

// Total: 100 casillas
// 68 en anillo exterior + 8 rectas finales × 4 colores = 100

const START_POS: Record<ColorKey, number> = {
  red: 5, blue: 22, green: 39, yellow: 56
};

const FINAL_ENTRY: Record<ColorKey, number> = {
  red: 68, blue: 26, green: 40, yellow: 54
};

const SAFE_CELLS = new Set([5, 12, 22, 29, 39, 46, 56, 63]);

const nextPlayer = (p: ColorKey): ColorKey =>
  p === "red" ? "blue" : p === "blue" ? "green" : p === "green" ? "yellow" : "red";

/* ================== Componente Principal (mantener igual) ================== */

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
      const sorted = [...newRolls].sort((a, b) => b.sum - a.sum);
      const order = sorted.map(r => r.color);
      setPlayerOrder(order);
      setGamePhase("playing");
      setHint(`Comienza ${COLORS[order[0]].label}. Lanza para sacar pares.`);
      
      setTimeout(() => {
        setDice1(0);
        setDice2(0);
        setDiceRolled(false);
      }, 2000);
    } else {
      setHint(`${COLORS[playerColor].label}: ${sum}. Siguiente.`);
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
    const allInJail = currentPlayer.tokens.every(t => t.pos === -1);
    
    if (allInJail) {
      if (isPair) {
        setHint(`¡Pares! ${dice1}=${value}. Saca ficha.`);
        setPairAttempts(0);
      } else {
        const newAttempts = pairAttempts + 1;
        setPairAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setHint(`3 intentos. Pasa turno.`);
          setTimeout(() => passTurn(), 2000);
        } else {
          setHint(`Sin pares. ${3 - newAttempts} intentos.`);
          setTimeout(() => {
            setDice1(0);
            setDice2(0);
            setDiceRolled(false);
          }, 1500);
        }
      }
    } else {
      if (isPair) {
        setHint(`¡Pares! Mueve y tira de nuevo.`);
      } else {
        setHint(`${dice1} y ${value}. Mueve.`);
      }
    }
  }

  function handleTokenClick(tokenIdx: number) {
    if (!diceRolled || gamePhase !== "playing") return;

    const token = currentPlayer.tokens[tokenIdx];
    const diceToUse = !usedDice[0] ? dice1 : dice2;
    const isPair = dice1 === dice2;
    
    if (token.pos === -1) {
      if (!isPair) {
        setHint("Solo sales con pares");
        return;
      }
      moveToken(tokenIdx, START_POS[currentColor]);
      markDiceUsed();
      return;
    }

    let newPos = token.pos;
    
    if (token.pos < 100) {
      newPos = token.pos + diceToUse;
      
      const entryPoint = FINAL_ENTRY[currentColor];
      if (token.pos < entryPoint && newPos >= entryPoint) {
        const remaining = newPos - entryPoint;
        const finalStart = 100 + (["red", "blue", "green", "yellow"].indexOf(currentColor) * 8);
        newPos = finalStart + remaining;
      } else if (newPos > 68) {
        newPos = ((newPos - 1) % 68) + 1;
      }
    } else {
      const finalStart = 100 + (["red", "blue", "green", "yellow"].indexOf(currentColor) * 8);
      const currentOffset = token.pos - finalStart;
      const newOffset = currentOffset + diceToUse;
      
      if (newOffset === 8) {
        newPos = 999;
      } else if (newOffset < 8) {
        newPos = finalStart + newOffset;
      } else {
        setHint("Debes caer exacto");
        return;
      }
    }

    moveToken(tokenIdx, newPos);
    markDiceUsed();
  }

  function moveToken(tokenIdx: number, newPos: number) {
    const newPlayers = [...players];
    const playerIdx = newPlayers.findIndex(p => p.color === currentColor);
    
    if (newPos >= 1 && newPos <= 68 && !SAFE_CELLS.has(newPos)) {
      for (let i = 0; i < newPlayers.length; i++) {
        if (i === playerIdx) continue;
        newPlayers[i].tokens.forEach(t => {
          if (t.pos === newPos) {
            t.pos = -1;
            setHint(`¡Captura!`);
          }
        });
      }
    }
    
    if (newPos === 999) {
      newPlayers[playerIdx].finished++;
      newPlayers[playerIdx].tokens.splice(tokenIdx, 1);
      
      if (newPlayers[playerIdx].tokens.length === 0) {
        setWinner(newPlayers[playerIdx].name);
      } else {
        setHint(`¡Meta! ${4 - newPlayers[playerIdx].tokens.length}/4`);
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
          setHint("¡Pares! Tira de nuevo");
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
    setHint(`Turno: ${COLORS[nextColor].label}`);
  }

  if (winner) {
    return (
      <div className="w-full text-center py-12">
        <h1 className="text-5xl font-bold mb-4 text-yellow-400">
          🏆 {winner} GANÓ! 🏆
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg shadow-lg"
        >
          Nueva partida
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        {gamePhase === "order" ? (
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 backdrop-blur-sm">
            <span className="text-lg font-bold text-purple-300">🎲 Orden</span>
          </div>
        ) : (
          <div 
            className="inline-block px-6 py-3 rounded-full border-2 backdrop-blur-sm"
            style={{ 
              borderColor: COLORS[currentColor].hex,
              backgroundColor: `${COLORS[currentColor].hex}25`
            }}
          >
            <span className="text-lg font-bold" style={{ color: COLORS[currentColor].hex }}>
              {currentPlayer?.name} ({COLORS[currentColor].label})
            </span>
          </div>
        )}
        
        <p className="text-sm text-gray-300 mb-1">{hint}</p>
        
        {gamePhase === "playing" && (
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span>Meta: {currentPlayer?.finished || 0}/4</span>
            {pairAttempts > 0 && <span>{pairAttempts}/3</span>}
          </div>
        )}
        
        {diceRolled && (
          <p className="text-xs text-gray-400 mt-1">
            {dice1} {usedDice[0] ? "✓" : "○"} | {dice2} {usedDice[1] ? "✓" : "○"}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
        <div className="flex-shrink-0">
          <BoardSVG 
            players={players}
            currentColor={currentColor}
            onTokenClick={handleTokenClick}
            gamePhase={gamePhase}
          />
        </div>

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

      {gamePhase === "playing" && playerOrder.length > 0 && (
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {playerOrder.map((color, idx) => (
            <div 
              key={color}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                idx === currentPlayerIndex ? 'scale-110' : 'opacity-50'
              }`}
              style={{ 
                borderColor: COLORS[color].hex,
                backgroundColor: `${COLORS[color].hex}20`
              }}
            >
              <span className="text-sm font-bold" style={{ color: COLORS[color].hex }}>
                {idx + 1}° {COLORS[color].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================== Dados (mantener igual) ================== */

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
      <p className="text-xs text-gray-400 font-semibold">{label}</p>
      <div 
        className={`relative w-28 h-28 rounded-xl shadow-2xl border-3 border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center ${
          used ? 'opacity-40' : ''
        }`}
      >
        {value === 0 ? (
          <div style={{ ["--dice-size" as any]: "100px" }}>
            <Dice3D onRoll={onRoll} size={100} disabled={disabled} />
          </div>
        ) : (
          <DiceFace value={value} />
        )}
      </div>
      {!disabled && value === 0 && <p className="text-xs text-green-400">🎲</p>}
      {waitingForFirst && <p className="text-xs text-gray-500">...</p>}
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
        <circle key={i} cx={x} cy={y} r="9" fill="#fff" />
      ))}
    </svg>
  );
}

/* ================== Tablero SVG CON CASILLAS RECTANGULARES ALARGADAS ================== */

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
  const size = 800;
  const patioSize = 180;
  const cellWidth = 40; // Ancho de casilla
  const cellHeight = 70; // Alto de casilla (más alargado)

  // Función para obtener posición de casilla
  function getCellPosition(pos: number): { x: number; y: number; width: number; height: number; rotation: number } {
    // Patios (-1)
    if (pos === -1) return { x: 0, y: 0, width: 0, height: 0, rotation: 0 };
    
    // Centro (999)
    if (pos === 999) return { x: size / 2, y: size / 2, width: 0, height: 0, rotation: 0 };

    // Anillo exterior (1-68)
    if (pos >= 1 && pos <= 68) {
      // Lado superior derecho (5-12) - ROJO
      if (pos >= 5 && pos <= 12) {
        const offset = pos - 5;
        return {
          x: patioSize + 60 + (offset * cellWidth),
          y: patioSize,
          width: cellWidth,
          height: cellHeight,
          rotation: 0
        };
      }
      
      // Lado derecho vertical (13-21) - AZUL
      if (pos >= 13 && pos <= 21) {
        const offset = pos - 13;
        return {
          x: size - patioSize - cellHeight,
          y: patioSize + 60 + (offset * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 90
        };
      }
      
      // Salida AZUL (22)
      if (pos === 22) {
        return {
          x: size - patioSize - cellHeight,
          y: patioSize + 60 + (9 * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 90
        };
      }
      
      // Lado derecho hasta esquina inferior (23-29)
      if (pos >= 23 && pos <= 29) {
        const offset = pos - 23;
        return {
          x: size - patioSize - cellHeight,
          y: patioSize + 60 + ((9 + offset) * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 90
        };
      }
      
      // Lado inferior derecho (30-38) - VERDE
      if (pos >= 30 && pos <= 38) {
        const offset = 38 - pos;
        return {
          x: patioSize + 60 + (offset * cellWidth),
          y: size - patioSize - cellHeight,
          width: cellWidth,
          height: cellHeight,
          rotation: 180
        };
      }
      
      // Salida VERDE (39)
      if (pos === 39) {
        return {
          x: patioSize - cellWidth,
          y: size - patioSize - cellHeight,
          width: cellWidth,
          height: cellHeight,
          rotation: 180
        };
      }
      
      // Lado izquierdo vertical (40-46)
      if (pos >= 40 && pos <= 46) {
        const offset = 46 - pos;
        return {
          x: patioSize - cellHeight,
          y: patioSize + 60 + (offset * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 270
        };
      }
      
      // Lado izquierdo hasta esquina superior (47-55)
      if (pos >= 47 && pos <= 55) {
        const offset = 55 - pos;
        return {
          x: patioSize - cellHeight,
          y: 60 + (offset * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 270
        };
      }
      
      // Salida AMARILLO (56)
      if (pos === 56) {
        return {
          x: patioSize - cellHeight,
          y: 60,
          width: cellHeight,
          height: cellWidth,
          rotation: 270
        };
      }
      
      // Completar hasta llegar a 5 (57-68)
      if (pos >= 57 && pos <= 68) {
        const offset = 68 - pos;
        return {
          x: patioSize + 60 + (offset * cellWidth),
          y: 60,
          width: cellWidth,
          height: cellHeight,
          rotation: 0
        };
      }
    }

    // Rectas finales (100-131)
    if (pos >= 100 && pos < 132) {
      const colorOffset = Math.floor((pos - 100) / 8);
      const cellOffset = (pos - 100) % 8;
      
      // ROJO (100-107)
      if (colorOffset === 0) {
        return {
          x: size / 2 + 60 + (cellOffset * cellWidth),
          y: size / 2 - cellHeight / 2,
          width: cellWidth,
          height: cellHeight,
          rotation: 0
        };
      }
      
      // AZUL (108-115)
      if (colorOffset === 1) {
        return {
          x: size / 2 - cellHeight / 2,
          y: size / 2 + 60 + (cellOffset * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 90
        };
      }
      
      // VERDE (116-123)
      if (colorOffset === 2) {
        return {
          x: size / 2 - 60 - ((cellOffset + 1) * cellWidth),
          y: size / 2 - cellHeight / 2,
          width: cellWidth,
          height: cellHeight,
          rotation: 180
        };
      }
      
      // AMARILLO (124-131)
      if (colorOffset === 3) {
        return {
          x: size / 2 - cellHeight / 2,
          y: size / 2 - 60 - ((cellOffset + 1) * cellWidth),
          width: cellHeight,
          height: cellWidth,
          rotation: 270
        };
      }
    }

    return { x: 0, y: 0, width: 0, height: 0, rotation: 0 };
  }

  const jailPositions: Record<ColorKey, [number, number][]> = {
    green: [
      [50, 50], [120, 50],
      [50, 120], [120, 120]
    ],
    red: [
      [size - 170, 50], [size - 100, 50],
      [size - 170, 120], [size - 100, 120]
    ],
    yellow: [
      [50, size - 170], [120, size - 170],
      [50, size - 100], [120, size - 100]
    ],
    blue: [
      [size - 170, size - 170], [size - 100, size - 170],
      [size - 170, size - 100], [size - 100, size - 100]
    ],
  };

  function getTokenXY(color: ColorKey, pos: number, idx: number): [number, number] {
    if (pos === -1) {
      return jailPositions[color][idx];
    }
    
    if (pos === 999) {
      return [size / 2, size / 2];
    }
    
    const cell = getCellPosition(pos);
    return [cell.x + cell.width / 2, cell.y + cell.height / 2];
  }

  const allTokens = players.flatMap((p) =>
    p.tokens.map((t, tidx) => ({
      color: p.color,
      pos: t.pos,
      id: t.id,
      tokenIdx: tidx,
    }))
  );

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className="w-full max-w-[800px] drop-shadow-2xl rounded-2xl"
      style={{ background: '#d4a574' }}
    >
      {/* Patios */}
      <rect x={0} y={0} width={patioSize} height={patioSize} 
            fill={COLORS.green.hex} stroke="#000" strokeWidth="4" rx="16" />
      <rect x={size - patioSize} y={0} width={patioSize} height={patioSize} 
            fill={COLORS.red.hex} stroke="#000" strokeWidth="4" rx="16" />
      <rect x={0} y={size - patioSize} width={patioSize} height={patioSize} 
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="4" rx="16" />
      <rect x={size - patioSize} y={size - patioSize} width={patioSize} height={patioSize} 
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="4" rx="16" />

      {/* Textos */}
      <text x={90} y={90} fontSize="20" fontWeight="bold" fill="#fff">SALIDA</text>
      <text x={size - 140} y={90} fontSize="20" fontWeight="bold" fill="#fff">SALIDA</text>
      <text x={90} y={size - 80} fontSize="20" fontWeight="bold" fill="#fff">SALIDA</text>
      <text x={size - 140} y={size - 80} fontSize="20" fontWeight="bold" fill="#fff">SALIDA</text>

      {/* Casillas del anillo (1-68) */}
      {Array.from({ length: 68 }, (_, i) => i + 1).map((pos) => {
        const cell = getCellPosition(pos);
        const isSafe = SAFE_CELLS.has(pos);
        
        return (
          <rect
            key={`cell-${pos}`}
            x={cell.x}
            y={cell.y}
            width={cell.width}
            height={cell.height}
            fill={isSafe ? "#fff" : "#f5e6c8"}
            stroke="#000"
            strokeWidth="2"
          />
        );
      })}

      {/* Casillas rectas finales (100-131) */}
      {Array.from({ length: 32 }, (_, i) => i + 100).map((pos) => {
        const cell = getCellPosition(pos);
        const colorIdx = Math.floor((pos - 100) / 8);
        const colors = [COLORS.red.hex, COLORS.blue.hex, COLORS.green.hex, COLORS.yellow.hex];
        
        return (
          <rect
            key={`final-${pos}`}
            x={cell.x}
            y={cell.y}
            width={cell.width}
            height={cell.height}
            fill={colors[colorIdx] + "80"}
            stroke="#000"
            strokeWidth="2"
          />
        );
      })}

      {/* Centro */}
      <circle cx={size / 2} cy={size / 2} r={50} 
              fill="#ffd700" stroke="#000" strokeWidth="4" />
      <text x={size / 2} y={size / 2 + 8} fontSize="24" fontWeight="bold" 
            fill="#000" textAnchor="middle">META</text>

      {/* Fichas */}
      {allTokens.map((t) => {
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
                r={22}
                fill={COLORS[t.color].hex}
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values="18;26;18"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={18}
              fill={COLORS[t.color].hex}
              stroke="#000"
              strokeWidth="3"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
            />
            <circle
              cx={x - 6}
              cy={y - 6}
              r={6}
              fill="rgba(255,255,255,0.7)"
            />
          </g>
        );
      })}
    </svg>
  );
}

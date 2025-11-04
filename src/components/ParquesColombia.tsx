"use client";

import { useState } from "react";
import Dice3D from "@/components/Dice3D";

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

const BOARD_MAP: Record<number, [number, number]> = {
  // VERDE (27-40)
  27: [6, 13], 28: [6, 12], 29: [6, 11], 30: [6, 10], 31: [6, 9], 32: [6, 8],
  33: [5, 8], 34: [4, 8], 35: [3, 8], 36: [2, 8], 37: [1, 8], 38: [0, 8],
  39: [0, 7], 40: [0, 6],
  
  // AMARILLO (41-54)
  41: [1, 6], 42: [2, 6], 43: [3, 6], 44: [4, 6], 45: [5, 6], 46: [6, 6],
  47: [6, 5], 48: [6, 4], 49: [6, 3], 50: [6, 2], 51: [6, 1], 52: [6, 0],
  53: [7, 0], 54: [8, 0],
  
  // ROJO (5-12)
  5: [9, 6], 6: [10, 6], 7: [11, 6], 8: [12, 6], 9: [13, 6], 10: [14, 6],
  11: [14, 7], 12: [14, 8],
  
  // AZUL (13-26)
  13: [13, 8], 14: [12, 8], 15: [11, 8], 16: [10, 8], 17: [9, 8], 18: [8, 8],
  19: [8, 9], 20: [8, 10], 21: [8, 11], 22: [8, 12], 23: [8, 13], 24: [8, 14],
  25: [7, 14], 26: [6, 14],
  
  // Conectar círculo
  55: [8, 1], 56: [8, 2], 57: [8, 3], 58: [8, 4], 59: [8, 5], 60: [8, 6],
  61: [9, 6], 62: [10, 6], 63: [11, 6], 64: [12, 6], 65: [13, 6], 66: [14, 6],
  67: [14, 7], 68: [14, 8],
};

const BOARD_COLORS: Record<number, string> = {
  // VERDE: 2 verdes + 1 blanca + 1 verde
  27: "#e8d4a0", 28: "#22c55e", 29: "#22c55e", 30: "#FFFFFF", 31: "#22c55e", 32: "#22c55e",
  33: "#22c55e", 34: "#22c55e", 35: "#22c55e", 36: "#e8d4a0", 37: "#e8d4a0", 38: "#e8d4a0",
  39: "#22c55e", 40: "#e8d4a0",

  // AMARILLO: TODO AMARILLO
  41: "#fbbf24", 42: "#fbbf24", 43: "#fbbf24", 44: "#fbbf24", 45: "#fbbf24", 46: "#fbbf24",
  47: "#fbbf24", 48: "#fbbf24", 49: "#fbbf24", 50: "#fbbf24", 51: "#fbbf24", 52: "#fbbf24",
  53: "#fbbf24", 54: "#fbbf24",

  // ROJO: 1 rojo + 1 blanca + rojos
  5: "#ef4444", 6: "#ef4444", 7: "#ef4444", 8: "#FFFFFF", 9: "#e8d4a0", 10: "#e8d4a0",
  11: "#e8d4a0", 12: "#ef4444",

  // AZUL: azul + 1 blanca + azul
  13: "#e8d4a0", 14: "#e8d4a0", 15: "#e8d4a0", 16: "#e8d4a0", 17: "#e8d4a0", 18: "#3b82f6",
  19: "#3b82f6", 20: "#3b82f6", 21: "#3b82f6", 22: "#3b82f6", 23: "#FFFFFF", 24: "#3b82f6",
  25: "#3b82f6", 26: "#3b82f6",

  // Conectar (55-68)
  55: "#e8d4a0", 56: "#e8d4a0", 57: "#e8d4a0", 58: "#e8d4a0", 59: "#e8d4a0", 60: "#e8d4a0",
  61: "#e8d4a0", 62: "#e8d4a0", 63: "#FFFFFF", 64: "#e8d4a0", 65: "#e8d4a0", 66: "#e8d4a0",
  67: "#e8d4a0", 68: "#e8d4a0",
};

const FINAL_PATHS: Record<ColorKey, number[]> = {
  red: [100, 101, 102, 103, 104, 105, 106, 107],
  blue: [110, 111, 112, 113, 114, 115, 116, 117],
  green: [120, 121, 122, 123, 124, 125, 126, 127],
  yellow: [130, 131, 132, 133, 134, 135, 136, 137],
};

const FINAL_MAP: Record<number, [number, number]> = {
  100: [13, 7], 101: [12, 7], 102: [11, 7], 103: [10, 7], 
  104: [9, 7], 105: [8, 7], 106: [7, 7], 107: [7, 7],
  
  110: [7, 13], 111: [7, 12], 112: [7, 11], 113: [7, 10],
  114: [7, 9], 115: [7, 8], 116: [7, 7], 117: [7, 7],
  
  120: [1, 7], 121: [2, 7], 122: [3, 7], 123: [4, 7],
  124: [5, 7], 125: [6, 7], 126: [7, 7], 127: [7, 7],
  
  130: [7, 1], 131: [7, 2], 132: [7, 3], 133: [7, 4],
  134: [7, 5], 135: [7, 6], 136: [7, 7], 137: [7, 7],
};

const START_POS: Record<ColorKey, number> = {
  red: 5, blue: 22, green: 39, yellow: 56
};

const FINAL_ENTRY: Record<ColorKey, number> = {
  red: 68, blue: 26, green: 40, yellow: 54
};

const SAFE_CELLS = new Set([8, 23, 30, 63]);

const nextPlayer = (p: ColorKey): ColorKey =>
  p === "red" ? "green" : p === "green" ? "yellow" : p === "yellow" ? "blue" : "red";

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
      color: "green", 
      name: "Jugador 2",
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
      name: "Jugador 3",
      tokens: [
        { pos: -1, id: "y1" }, 
        { pos: -1, id: "y2" },
        { pos: -1, id: "y3" },
        { pos: -1, id: "y4" }
      ],
      turnsWithoutPairs: 0,
      finished: 0
    },
    { 
      color: "blue", 
      name: "Jugador 4",
      tokens: [
        { pos: -1, id: "b1" }, 
        { pos: -1, id: "b2" },
        { pos: -1, id: "b3" },
        { pos: -1, id: "b4" }
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
    const playerColor = ["red", "green", "yellow", "blue"][orderRolls.length] as ColorKey;
    
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
        setHint(`¡Pares! Mueve y tira.`);
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
        const finalPath = FINAL_PATHS[currentColor];
        newPos = finalPath[remaining] || finalPath[finalPath.length - 1];
      } else if (newPos > 68) {
        newPos = ((newPos - 1) % 68) + 1;
      }
    } else {
      const finalPath = FINAL_PATHS[currentColor];
      const currentIdx = finalPath.indexOf(token.pos);
      const newIdx = currentIdx + diceToUse;
      
      if (newIdx === 8) {
        newPos = 999;
      } else if (newIdx < 8) {
        newPos = finalPath[newIdx];
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
          setHint("¡Pares! Tira");
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
  const size = 850;
  const cell = 56;

  const jailPositions: Record<ColorKey, [number, number][]> = {
    red: [
      [cell * 10.5, cell * 0.9], [cell * 12.1, cell * 0.9],
      [cell * 10.5, cell * 2.5], [cell * 12.1, cell * 2.5]
    ],
    yellow: [
      [cell * 0.9, cell * 10.5], [cell * 2.5, cell * 10.5],
      [cell * 0.9, cell * 12.1], [cell * 2.5, cell * 12.1]
    ],
    green: [
      [cell * 0.9, cell * 0.9], [cell * 2.5, cell * 0.9],
      [cell * 0.9, cell * 2.5], [cell * 2.5, cell * 2.5]
    ],
    blue: [
      [cell * 10.5, cell * 10.5], [cell * 12.1, cell * 10.5],
      [cell * 10.5, cell * 12.1], [cell * 12.1, cell * 12.1]
    ],
  };

  function getTokenXY(color: ColorKey, pos: number, idx: number): [number, number] {
    if (pos === -1) {
      return jailPositions[color][idx];
    }
    
    if (pos === 999) {
      return [cell * 7.5, cell * 7.5];
    }
    
    if (FINAL_MAP[pos]) {
      const [gridX, gridY] = FINAL_MAP[pos];
      return [gridX * cell + cell / 2, gridY * cell + cell / 2];
    }
    
    if (BOARD_MAP[pos]) {
      const [gridX, gridY] = BOARD_MAP[pos];
      return [gridX * cell + cell / 2, gridY * cell + cell / 2];
    }
    
    return [cell * 7.5, cell * 7.5];
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
      className="w-full max-w-[850px] drop-shadow-2xl rounded-2xl"
      style={{ background: '#d4a574' }}
    >
      <rect x={0} y={0} width={cell * 4} height={cell * 4} 
            fill={COLORS.green.hex} stroke="#000" strokeWidth="4" rx="16" />
      <rect x={cell * 11} y={0} width={cell * 4} height={cell * 4} 
            fill={COLORS.red.hex} stroke="#000" strokeWidth="4" rx="16" />
      <rect x={0} y={cell * 11} width={cell * 4} height={cell * 4} 
            fill={COLORS.yellow.hex} stroke="#000" strokeWidth="4" rx="16" />
      <rect x={cell * 11} y={cell * 11} width={cell * 4} height={cell * 4} 
            fill={COLORS.blue.hex} stroke="#000" strokeWidth="4" rx="16" />

      {Object.entries(BOARD_MAP).map(([pos, [x, y]]) => {
        const cellPos = parseInt(pos);
        const fill = BOARD_COLORS[cellPos] || "#e8d4a0";
        
        return (
          <rect
            key={`cell-${pos}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            fill={fill}
            stroke="#000"
            strokeWidth="2"
          />
        );
      })}

      {Object.entries(FINAL_MAP).map(([pos, [x, y]]) => {
        const cellPos = parseInt(pos);
        let fill = "#fff";
        
        if (FINAL_PATHS.red.includes(cellPos)) fill = COLORS.red.hex + "99";
        else if (FINAL_PATHS.blue.includes(cellPos)) fill = COLORS.blue.hex + "99";
        else if (FINAL_PATHS.green.includes(cellPos)) fill = COLORS.green.hex + "99";
        else if (FINAL_PATHS.yellow.includes(cellPos)) fill = COLORS.yellow.hex + "99";
        
        return (
          <rect
            key={`final-${pos}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            fill={fill}
            stroke="#000"
            strokeWidth="2"
          />
        );
      })}

      <g>
        <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 1.3} 
                fill="#ffd700" stroke="#000" strokeWidth="4" />
        
        <path 
          d={`M ${cell * 7.5} ${cell * 6.2} L ${cell * 6.7} ${cell * 7.5} L ${cell * 8.3} ${cell * 7.5} Z`}
          fill={COLORS.red.hex} stroke="#000" strokeWidth="2"
        />
        <path 
          d={`M ${cell * 8.8} ${cell * 7.5} L ${cell * 7.5} ${cell * 6.7} L ${cell * 7.5} ${cell * 8.3} Z`}
          fill={COLORS.blue.hex} stroke="#000" strokeWidth="2"
        />
        <path 
          d={`M ${cell * 6.2} ${cell * 7.5} L ${cell * 7.5} ${cell * 6.7} L ${cell * 7.5} ${cell * 8.3} Z`}
          fill={COLORS.green.hex} stroke="#000" strokeWidth="2"
        />
        <path 
          d={`M ${cell * 7.5} ${cell * 8.8} L ${cell * 6.7} ${cell * 7.5} L ${cell * 8.3} ${cell * 7.5} Z`}
          fill={COLORS.yellow.hex} stroke="#000" strokeWidth="2"
        />
        
        <circle cx={cell * 7.5} cy={cell * 7.5} r={cell * 0.5} 
                fill="#fff" stroke="#000" strokeWidth="2" />
        <text x={cell * 7.5} y={cell * 7.7} fontSize="20" fontWeight="bold" 
              fill="#000" textAnchor="middle">🏆</text>
      </g>

      <text x={cell * 2} y={cell * 2.5} fontSize="20" fontWeight="bold" fill="#fff" textAnchor="middle">SALIDA</text>
      <text x={cell * 12.5} y={cell * 2.5} fontSize="20" fontWeight="bold" fill="#fff" textAnchor="middle">SALIDA</text>
      <text x={cell * 2} y={cell * 12.7} fontSize="20" fontWeight="bold" fill="#fff" textAnchor="middle">SALIDA</text>
      <text x={cell * 12.5} y={cell * 12.7} fontSize="20" fontWeight="bold" fill="#fff" textAnchor="middle">SALIDA</text>

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
                r={cell * 0.38}
                fill={COLORS[t.color].hex}
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values={`${cell * 0.32};${cell * 0.42};${cell * 0.32}`}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={cell * 0.3}
              fill={COLORS[t.color].hex}
              stroke="#000"
              strokeWidth="3"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
            />
            <circle
              cx={x - cell * 0.1}
              cy={y - cell * 0.1}
              r={cell * 0.1}
              fill="rgba(255,255,255,0.7)"
            />
          </g>
        );
      })}
    </svg>
  );
}

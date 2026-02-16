// // app/components/board.tsx
"use client";

import { use, useCallback, useEffect, useState } from "react";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type TileStatus = "correct" | "present" | "absent" | "empty" | "tbd";

interface Tile {
  letter: string;
  status: TileStatus;
}

function createEmptyBoard(): Tile[][] {
  return Array.from({ length: MAX_GUESSES }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({ letter: "", status: "empty" }))
  );
}

const STATUS_COLORS: Record<TileStatus, string> = {
  correct: "bg-green-600 border-green-600 text-white",
  present: "bg-yellow-500 border-yellow-500 text-white",
  absent: "bg-zinc-500 border-zinc-500 text-white",
  tbd: "border-zinc-400 dark:border-zinc-500",
  empty: "border-zinc-300 dark:border-zinc-600",
};

export default function Game() {
  // fetch wordle words from api and store in state
  // const [wordleWords, setWordleWords] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [board, setBoard] = useState<Tile[][]>(createEmptyBoard);

  // Fetch the answer word on mount
  useEffect(() => {
    async function fetchWordleWords() {
      const res = await fetch("/api/wordle-words");
      const data = await res.json();
      // console.log("wordle words: ", data);
      // setWordleWords(data);
      const randomWord = data[Math.floor(Math.random() * data.length)];
      setAnswer(randomWord.toUpperCase());
      console.log("answer: ", randomWord);
    }
    fetchWordleWords();
  }, []);

  


  // TODO: display board and implement game logic
  return (
    <div className="flex flex-col items-center gap-6 mt-20">
      <div className="grid grid-rows-6 gap-1.5">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-1.5">
            {row.map((tile, colIdx) => (
              <div
                key={colIdx}
                className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase
                  ${STATUS_COLORS[tile.status]}
                `}
              >
                {tile.letter} 
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}






// type TileStatus = "correct" | "present" | "absent" | "empty" | "tbd";

// interface Tile {
//   letter: string;
//   status: TileStatus;
// }

// const KEYBOARD_ROWS = [
//   ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
//   ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
//   ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
// ];

// function createEmptyBoard(): Tile[][] {
//   return Array.from({ length: MAX_GUESSES }, () =>
//     Array.from({ length: WORD_LENGTH }, () => ({ letter: "", status: "empty" }))
//   );
// }

// function evaluateGuess(guess: string, answer: string): TileStatus[] {
//   const result: TileStatus[] = Array(WORD_LENGTH).fill("absent");
//   const answerChars = answer.split("");
//   const guessChars = guess.split("");

//   // First pass: mark correct (green)
//   for (let i = 0; i < WORD_LENGTH; i++) {
//     if (guessChars[i] === answerChars[i]) {
//       result[i] = "correct";
//       answerChars[i] = "#"; // mark as used
//       guessChars[i] = "*";
//     }
//   }

//   // Second pass: mark present (yellow)
//   for (let i = 0; i < WORD_LENGTH; i++) {
//     if (result[i] === "correct") continue;
//     const idx = answerChars.indexOf(guessChars[i]);
//     if (idx !== -1) {
//       result[i] = "present";
//       answerChars[idx] = "#";
//     }
//   }

//   return result;
// }

// const STATUS_COLORS: Record<TileStatus, string> = {
//   correct: "bg-green-600 border-green-600 text-white",
//   present: "bg-yellow-500 border-yellow-500 text-white",
//   absent: "bg-zinc-500 border-zinc-500 text-white",
//   tbd: "border-zinc-400 dark:border-zinc-500",
//   empty: "border-zinc-300 dark:border-zinc-600",
// };

// const KEY_STATUS_COLORS: Record<TileStatus, string> = {
//   correct: "bg-green-600 text-white",
//   present: "bg-yellow-500 text-white",
//   absent: "bg-zinc-500 text-white",
//   tbd: "bg-zinc-200 dark:bg-zinc-700",
//   empty: "bg-zinc-200 dark:bg-zinc-700",
// };

// export default function Board() {
//   const [answer, setAnswer] = useState("");
//   const [board, setBoard] = useState<Tile[][]>(createEmptyBoard);
//   const [currentRow, setCurrentRow] = useState(0);
//   const [currentCol, setCurrentCol] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [message, setMessage] = useState("");
//   const [keyStatuses, setKeyStatuses] = useState<Record<string, TileStatus>>({});

//   // Fetch the answer word on mount
//   useEffect(() => {
//     async function fetchWord() {
//       try {
//         const res = await fetch("/api/wordle-words");
//         const words: string[] = await res.json();
//         const randomWord = words[Math.floor(Math.random() * words.length)];
//         setAnswer(randomWord.toUpperCase());
//       } catch {
//         setAnswer("CRANE"); // fallback
//       }
//     }
//     fetchWord();
//   }, []);

//   const showMessage = (msg: string, duration = 1500) => {
//     setMessage(msg);
//     setTimeout(() => setMessage(""), duration);
//   };

//   const submitGuess = useCallback(() => {
//     if (currentCol < WORD_LENGTH) {
//       showMessage("Not enough letters");
//       return;
//     }

//     const guess = board[currentRow].map((t) => t.letter).join("");
//     const statuses = evaluateGuess(guess, answer);

//     setBoard((prev) => {
//       const next = prev.map((row) => row.map((tile) => ({ ...tile })));
//       for (let i = 0; i < WORD_LENGTH; i++) {
//         next[currentRow][i].status = statuses[i];
//       }
//       return next;
//     });

//     // Update keyboard colors (only upgrade, never downgrade)
//     setKeyStatuses((prev) => {
//       const next = { ...prev };
//       const priority: TileStatus[] = ["correct", "present", "absent"];
//       for (let i = 0; i < WORD_LENGTH; i++) {
//         const letter = guess[i];
//         const current = next[letter];
//         const incoming = statuses[i];
//         if (!current || priority.indexOf(incoming) < priority.indexOf(current)) {
//           next[letter] = incoming;
//         }
//       }
//       return next;
//     });

//     if (guess === answer) {
//       showMessage("Brilliant! 🎉", 3000);
//       setGameOver(true);
//     } else if (currentRow === MAX_GUESSES - 1) {
//       showMessage(`The word was ${answer}`, 5000);
//       setGameOver(true);
//     }

//     setCurrentRow((r) => r + 1);
//     setCurrentCol(0);
//   }, [board, currentCol, currentRow, answer]);

//   const handleKey = useCallback(
//     (key: string) => {
//       if (gameOver || !answer) return;

//       if (key === "ENTER") {
//         submitGuess();
//         return;
//       }

//       if (key === "BACKSPACE" || key === "⌫") {
//         if (currentCol > 0) {
//           setBoard((prev) => {
//             const next = prev.map((row) => row.map((tile) => ({ ...tile })));
//             next[currentRow][currentCol - 1] = { letter: "", status: "empty" };
//             return next;
//           });
//           setCurrentCol((c) => c - 1);
//         }
//         return;
//       }

//       if (/^[A-Z]$/.test(key) && currentCol < WORD_LENGTH) {
//         setBoard((prev) => {
//           const next = prev.map((row) => row.map((tile) => ({ ...tile })));
//           next[currentRow][currentCol] = { letter: key, status: "tbd" };
//           return next;
//         });
//         setCurrentCol((c) => c + 1);
//       }
//     },
//     [currentCol, currentRow, gameOver, answer, submitGuess]
//   );

//   // Physical keyboard listener
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey || e.altKey) return;
//       const key = e.key.toUpperCase();
//       if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
//         handleKey(key);
//       }
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [handleKey]);

//   return (
//     <div className="flex flex-col items-center gap-6">
//       {/* Header */}
//       <h1 className="text-3xl font-bold tracking-wider">WORDLE</h1>

//       {/* Toast message */}
//       {message && (
//         <div className="absolute top-20 z-10 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-white shadow-lg">
//           {message}
//         </div>
//       )}

//       {/* Board grid */}
//       <div className="grid grid-rows-6 gap-1.5">
//         {board.map((row, rowIdx) => (
//           <div key={rowIdx} className="grid grid-cols-5 gap-1.5">
//             {row.map((tile, colIdx) => (
//               <div
//                 key={colIdx}
//                 className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase transition-colors duration-300
//                   ${STATUS_COLORS[tile.status]}
//                   ${tile.letter && tile.status === "tbd" ? "scale-105" : ""}
//                 `}
//               >
//                 {tile.letter}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       {/* On-screen keyboard */}
//       <div className="flex flex-col items-center gap-1.5">
//         {KEYBOARD_ROWS.map((row, rowIdx) => (
//           <div key={rowIdx} className="flex gap-1">
//             {row.map((key) => {
//               const status = keyStatuses[key] ?? "empty";
//               const isWide = key === "ENTER" || key === "⌫";
//               return (
//                 <button
//                   key={key}
//                   onClick={() => handleKey(key === "⌫" ? "⌫" : key)}
//                   className={`flex h-14 items-center justify-center rounded-md text-sm font-bold uppercase transition-colors
//                     ${isWide ? "px-3 text-xs" : "w-10"}
//                     ${KEY_STATUS_COLORS[status]}
//                     hover:opacity-80 active:scale-95
//                   `}
//                 >
//                   {key}
//                 </button>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// const MAX_GUESSES = 6;
// const WORD_LENGTH = 5;



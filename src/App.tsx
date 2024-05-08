import { PropsWithChildren, useState } from "react";
import "./App.css";
import { useGameInterval } from "./utils";

export type Piece = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type BoardProps = {
  currentPiece: Piece;
  filledCells: any;
  board: number[][];
};

export function Board({
  children,
  currentPiece,
  filledCells,
  board,
}: PropsWithChildren<BoardProps>) {
  return (
    <div className="board">
      {board.flatMap((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <span
            key={`${rowIdx} - ${colIdx}`}
            className={`cell ${cell ? "filled" : "not-filled"}`}
          >
            {rowIdx}-{colIdx}
          </span>
        ))
      )}
    </div>
  );
}

function getRandomPiece(): Piece {
  const pieces = ["I", "J", "L", "O", "S", "T", "Z"] as const;
  return pieces[Math.floor(Math.random() * pieces.length)];
}

const firstPiece = getRandomPiece();

function App() {
  const [currentPiece, setCurrentPiece] = useState(firstPiece);
  const [piecePosition, setPiecePosition] = useState<number[]>([0, 4]);
  const [filledCells, setFilledCells] = useState();

  // 15 rows x 10 cols
  const board = [
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const { nextPosition, isRowCleared } = useGameInterval({
    currentPiece,
    piecePosition,
    time: 1000,
  });

  const nextFilledCells = filledCells;

  return (
    <div className="app">
      <Board
        currentPiece={currentPiece}
        filledCells={filledCells}
        board={board}
      />
    </div>
  );
}

export default App;

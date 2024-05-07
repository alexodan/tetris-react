import { PropsWithChildren, useState } from "react";
import "./App.css";

export type Piece = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type BoardProps = {
  currentPiece: Piece;
};

const ROWS = 15;
const COLS = 10;

export function Board({
  children,
  currentPiece,
}: PropsWithChildren<BoardProps>) {
  const boardCols = Array.from({ length: COLS }, () => []);

  console.log(currentPiece);

  return <div className="board">{}</div>;
}

function getRandomPiece(): Piece {
  const pieces = ["I", "J", "L", "O", "S", "T", "Z"] as const;
  return pieces[Math.floor(Math.random() * pieces.length)];
}

function App() {
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece());

  return (
    <>
      <Board currentPiece={currentPiece} />
    </>
  );
}

export default App;

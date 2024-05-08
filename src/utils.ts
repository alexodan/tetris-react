import { useEffect, useState } from "react";
import { Piece } from "./App";

export function useGameInterval({
  currentPiece,
  piecePosition,
  time,
}: {
  currentPiece: Piece;
  piecePosition: number[] | undefined;
  time: number;
}) {
  const [nextPosition, setNextPosition] = useState(piecePosition);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("nextPosition:", nextPosition);
    }, time);
    return () => {
      clearInterval(id);
    };
  }, []);

  // TODO: implement
  const isRowCleared = false;

  return {
    nextPosition,
    isRowCleared,
  };
}

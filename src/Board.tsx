import { PropsWithChildren } from "react";
import { GameStatus } from "./Tetris";

export type BoardProps = {
  board: number[][];
  status: GameStatus;
  resumeGame: () => void;
};

export function Board({
  board,
  status,
  resumeGame,
}: PropsWithChildren<BoardProps>) {
  return (
    <div className={`board ${status}`}>
      {status === "game-over" ? (
        <div className="overlay">
          <h1>Game Over</h1>
        </div>
      ) : status === "paused" ? (
        <div className="overlay">
          <h1>Game Paused</h1>
          <button className="btn" onClick={() => resumeGame()}>
            Resume
          </button>
        </div>
      ) : null}
      <div className="grid">
        {board.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <span
              key={`${rowIdx} - ${colIdx}`}
              className={`cell ${
                cell === 2 ? "stick" : cell === 1 ? "filled" : "not-filled"
              } ${rowIdx < 2 ? "not-visible" : ""}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

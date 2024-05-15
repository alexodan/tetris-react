import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import "./App.css";
import { GameStatus, Tetris } from "./Tetris";
import { useInterval } from "react-timing-hooks";

export type Piece = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

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

function Score({ score }: { score: number }) {
  return <h2 className="score">Score: {score}</h2>;
}

const tetris = new Tetris({
  size: "M",
  gameSpeed: 600,
});

function App() {
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const { pause, start, resume } = useInterval(() => {
    if (tetris.status === "game-over") {
      pause();
    } else if (tetris.status === "paused") {
      pause();
    } else {
      tetris.movePiece({ dy: 1 });
      tetris.renderPiece();
    }
    forceUpdate();
  }, tetris.gameSpeed);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        tetris.movePiece({ dx: -1 });
      } else if (e.key === "ArrowRight") {
        tetris.movePiece({ dx: 1 });
      } else if (e.key === "Escape") {
        if (tetris.status === "paused") {
          tetris.status = "playing";
          resume();
        } else if (tetris.status === "playing") {
          tetris.status = "paused";
          pause();
        }
      } else if (e.key === "ArrowUp") {
        tetris.rotatePiece();
      } else if (e.key === "ArrowDown") {
        tetris.movePiece({ dy: 1 });
      }
      forceUpdate();
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [forceUpdate, pause, resume]);

  const resumeGame = () => {
    console.log("resume");
    resume();
    tetris.status = "playing";
  };

  return (
    <div className="app">
      <Score score={tetris.score} />
      <Board
        board={tetris.board}
        status={tetris.status}
        resumeGame={resumeGame}
      />
    </div>
  );
}

export default App;

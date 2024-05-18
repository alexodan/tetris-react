import "./App.css";
import { useEffect, useReducer, useState } from "react";
import { Tetris } from "./Tetris";
import { useInterval } from "react-timing-hooks";
import { Board } from "./Board";

export type Piece = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

// Note: im not updating the score yet
function Score({ score }: { score: number }) {
  return <h2 className="score">Score: {score}</h2>;
}

function App() {
  const [board, setBoard] = useReducer((_: number[][], action: number[][]) => {
    // why include this hack? Board wasn't re-rendering with useState
    return [...action];
  }, []);

  const [tetris] = useState(
    () =>
      new Tetris({
        size: "M",
        gameSpeed: 600,
        // controls: { moveLeftKey, moveRightKey }
        // context: { domElement: document }
        onChange: setBoard,
      })
  );

  const { pause, start, resume } = useInterval(() => {
    if (tetris.status === "game-over") {
      pause();
    } else if (tetris.status === "paused") {
      pause();
    } else {
      tetris.movePiece({ dy: 1 });
      tetris.renderPiece();
    }
  }, tetris.gameSpeed);

  useEffect(() => {
    start();
  }, [start]);

  // think someone importing the game or smth
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
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [pause, resume, tetris]);

  const resumeGame = () => {
    resume();
    tetris.status = "playing";
  };

  return (
    <div className="app">
      <Score score={tetris.score} />
      <Board board={board} status={tetris.status} resumeGame={resumeGame} />
    </div>
  );
}

export default App;

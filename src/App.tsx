import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Tetris } from "./Tetris";
import { useInterval } from "react-timing-hooks";
import { Board } from "./Board";

export type Piece = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

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

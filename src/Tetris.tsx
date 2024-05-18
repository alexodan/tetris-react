export type GameStatus = "playing" | "game-over" | "paused";

function getRowsAndCols(size: "S" | "M" | "L") {
  switch (size) {
    case "S":
      return [16, 10] as const;
    case "M":
      return [16, 10] as const;
    case "L":
      return [16, 10] as const;
    default:
      return [16, 10] as const;
  }
}

// I, O, S, Z, T, L, J
export const TETRAMINOS = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
];

export const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
];

export class Tetris {
  ROWS: number;
  COLS: number;
  board: number[][];
  status: "game-over" | "paused" | "playing";
  score: number;
  piece: {
    x: number;
    y: number;
    shape: number[][];
    color: string;
  } = { x: 0, y: 0, shape: [], color: "" };
  gameSpeed: number;
  onChange: (board: number[][]) => void;

  constructor({
    size,
    gameSpeed = 500,
    onChange,
  }: {
    size: "S" | "M" | "L";
    gameSpeed: number;
    onChange: (board: number[][]) => void;
  }) {
    this.onChange = onChange;
    [this.ROWS, this.COLS] = size ? getRowsAndCols(size) : [18, 10];
    this.board = new Array(this.ROWS)
      .fill("")
      .map(() => new Array(this.COLS).fill(0));
    this.score = 0;
    this.createPiece();
    this.status = "playing";
    this.renderPiece();
    this.gameSpeed = gameSpeed;
  }

  createPiece() {
    const rand = Math.floor(Math.random() * TETRAMINOS.length);
    const shape = TETRAMINOS[rand];
    const color = COLORS[rand];

    this.piece = {
      x: this.COLS / 2 - 1,
      y: 0,
      shape,
      color,
    };

    if (!this.checkMove({})) {
      this.status = "game-over";
    }
  }

  renderPiece({ clear, stick } = { clear: false, stick: false }) {
    const { shape } = this.piece;
    for (let yAxis = 0; yAxis < shape.length; yAxis++) {
      for (let xAxis = 0; xAxis < shape[0].length; xAxis++) {
        const dx = this.piece.x + xAxis;
        const dy = this.piece.y + yAxis;
        if (shape[yAxis][xAxis]) {
          if (clear) {
            this.board[dy][dx] = 0;
          } else if (stick) {
            this.board[dy][dx] = shape[yAxis][xAxis] ? 2 : 0;
          } else {
            this.board[dy][dx] = shape[yAxis][xAxis];
          }
        }
      }
    }
    this.onChange(this.board);
    // this.updateBoard() -> this.onChange (updates and notifies)
  }

  checkMove({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
    const { shape } = this.piece;
    for (let yAxis = 0; yAxis < shape.length; yAxis++) {
      for (let xAxis = 0; xAxis < shape[0].length; xAxis++) {
        if (shape[yAxis][xAxis]) {
          const newX = this.piece.x + xAxis + dx;
          const newY = this.piece.y + yAxis + dy;
          // check edges
          if (newX < 0 || newX >= this.COLS) return false;
          if (newY >= this.ROWS) return false;
          // check blocked by another piece
          const isBlocked = this.board[newY][newX] === 2;
          if (isBlocked) return false;
        }
      }
    }
    return true;
  }

  stickPiece() {
    this.renderPiece({ stick: true, clear: false });
  }

  movePiece({ dx, dy }: { dx?: number; dy?: number }) {
    const isValid = this.checkMove({ dx: dx ?? 0, dy: dy ?? 0 });
    if (!isValid && dx) {
      return;
    }
    if (!isValid && dy) {
      this.stickPiece();
      this.clearLines();
      this.createPiece();
      return;
    }

    const newX = this.piece.x + (dx ?? 0);
    const newY = this.piece.y + (dy ?? 0);

    this.renderPiece({ clear: true, stick: false });

    this.piece.x = newX;
    this.piece.y = newY;

    this.renderPiece();
  }

  rotatePiece() {
    // matrix MxN being M number of rows & N number of cols
    const m = this.piece.shape[0].length;
    const n = this.piece.shape.length;
    const rotatedPiece = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        rotatedPiece[j][n - i - 1] = this.piece.shape[i][j];
      }
    }
    this.renderPiece({ clear: true, stick: false });
    const prevShape = this.piece.shape;
    this.piece.shape = rotatedPiece;
    const isValid = this.checkMove({});
    if (!isValid) {
      this.piece.shape = prevShape;
    }
    this.renderPiece();
  }

  clearLines() {
    for (let row = 0; row < this.board.length; row++) {
      const isFull = this.board[row].every((cell) => cell === 2);
      if (isFull) {
        this.board.splice(row, 1);
        this.board.unshift(new Array(this.COLS).fill(0));
      }
    }
    this.onChange(this.board);
  }
}

// Tetris class

// useTetris() { }

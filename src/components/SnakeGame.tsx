import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 22; // A bit more room for larger canvas
const CANVAS_SIZE = 440;
const TILE_SIZE = CANVAS_SIZE / GRID_SIZE;
const SPEED = 85; // Faster, harder

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Use refs for game state to avoid dependency issues in interval
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const scoreRef = useRef(0);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    onScoreUpdate(0);
    setGameOver(false);
    setHasStarted(false);
    placeFood();
  };

  const placeFood = () => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = snakeRef.current.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
    }
    foodRef.current = newFood!;
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (gameOver) {
          resetGame();
          return;
        }
      }

      const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'];
      if (!hasStarted && movementKeys.includes(e.key)) {
        setHasStarted(true);
      }

      // Allow direction changes, prevent 180 reverse
      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  // Game Loop
  useEffect(() => {
    if (gameOver || !hasStarted) return;

    const interval = setInterval(() => {
      const snake = [...snakeRef.current];
      const dir = nextDirectionRef.current;
      directionRef.current = dir;

      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Check walls
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 10;
        setScore(scoreRef.current);
        onScoreUpdate(scoreRef.current);
        placeFood();
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      draw();
    }, SPEED);

    return () => clearInterval(interval);
  }, [gameOver, hasStarted]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid hash overlay
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE; i += 4) {
      if (i % TILE_SIZE === 0) {
         ctx.strokeStyle = '#222';
         ctx.beginPath();
         ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
      }
    }

    // Draw Food (Magenta Neon Block)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      foodRef.current.x * TILE_SIZE + 2,
      foodRef.current.y * TILE_SIZE + 2,
      TILE_SIZE - 4,
      TILE_SIZE - 4
    );
    // Glitch food accent
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(
      foodRef.current.x * TILE_SIZE + TILE_SIZE/2,
      foodRef.current.y * TILE_SIZE + 2,
      2,
      TILE_SIZE - 4
    );


    // Draw Snake (Cyan with Magenta accent)
    snakeRef.current.forEach((point, index) => {
      if (index === 0) {
        ctx.fillStyle = '#ffffff'; // Head
        ctx.fillRect(point.x * TILE_SIZE + 1, point.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        // Head accent
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(point.x * TILE_SIZE + 4, point.y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      } else {
        ctx.fillStyle = '#00ffff'; // Body
        ctx.fillRect(point.x * TILE_SIZE + 1, point.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      }
    });
  };

  // Initial draw and draw when game finishes/restarts
  useEffect(() => {
    draw();
  }, [hasStarted, gameOver]);

  return (
    <div className="relative w-[440px] h-[440px] select-none bg-black border-4 border-[#00ffff] shadow-[6px_6px_0px_#ff00ff]">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block"
      />
      
      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-widest font-mono glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
          <p className="text-[#00ffff] text-2xl mb-8 font-black uppercase text-center bg-black p-2 border-2 border-[#ff00ff] shadow-[-4px_4px_0_#00ffff]">
             Score Dump: <br/>{score}
          </p>
          <button 
            onClick={(e) => { e.currentTarget.blur(); resetGame(); }}
            className="px-8 py-4 bg-[#ff00ff] text-black font-black uppercase tracking-widest text-xl border-4 border-black shadow-[4px_4px_0_#00ffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_#00ffff] transition-all cursor-pointer"
          >
            {'=>'} REBOOT_SYS
          </button>
        </div>
      )}

      {(!hasStarted && !gameOver) && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 pointer-events-none">
           <div className="bg-black p-6 border-4 border-[#ff00ff] shadow-[-6px_6px_0_#00ffff] text-center max-w-[80%]">
             <h2 className="text-3xl font-black raw-text-cyan mb-4 tracking-widest uppercase animate-pulse">AWAITING_INPUT</h2>
             <p className="text-[#fff] text-lg uppercase font-bold">PRESS [WASD] TO INITIATE LOOP</p>
           </div>
        </div>
      )}
    </div>
  );
}

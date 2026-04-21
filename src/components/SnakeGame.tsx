import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 120;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(BASE_SPEED);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point = { x: 0, y: 0 };
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood;
  }, []);

  const startGame = () => {
    const defaultSnake = [...INITIAL_SNAKE];
    setSnake(defaultSnake);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(defaultSnake));
    setGameOver(false);
    setScore(0);
    setSpeed(BASE_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.key === 'Enter') {
        startGame();
        return;
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      setNextDirection((prevDir) => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            return prevDir.y !== 1 && direction.y !== 1 ? { x: 0, y: -1 } : prevDir;
          case 'ArrowDown':
          case 's':
            return prevDir.y !== -1 && direction.y !== -1 ? { x: 0, y: 1 } : prevDir;
          case 'ArrowLeft':
          case 'a':
            return prevDir.x !== 1 && direction.x !== 1 ? { x: -1, y: 0 } : prevDir;
          case 'ArrowRight':
          case 'd':
            return prevDir.x !== -1 && direction.x !== -1 ? { x: 1, y: 0 } : prevDir;
          default:
            return prevDir;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        setDirection(nextDirection);
        const newHead = { x: head.x + nextDirection.x, y: head.y + nextDirection.y };

        // Collisions: Walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setHighScore((h) => Math.max(h, score));
          return prev;
        }

        // Collisions: Self
        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setHighScore((h) => Math.max(h, score));
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
          setSpeed((s) => Math.max(s - 2, 50)); // Speed increases up to a cap
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [gameOver, nextDirection, food, score, speed, generateFood]);

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-12 relative w-full h-full max-h-full font-sans max-w-[1200px] mx-auto">
      
      {/* Game Board Wrapper */}
      <div className="flex-1 glitch-border-magenta p-6 flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden h-full min-h-[300px]">
        {/* TV Grid Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM0NDQiLz48L3N2Zz4=')] opacity-30 z-0"></div>

        {/* Game Board */}
        <div className="relative group w-full max-w-[500px] aspect-square z-10 border-4 border-[#00ffff] bg-black shadow-[8px_8px_0_#ff00ff,-8px_-8px_0_#00ffff] animate-glitch transition-none">
          <div 
            className="w-full h-full p-2"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              gap: '2px',
            }}
          >
            {/* Render Snake */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`${isHead ? 'bg-[#ff00ff]' : 'bg-[#00ffff]'} ${isHead ? 'z-20' : 'z-10'} rounded-sm`}
                  style={{
                    gridColumn: segment.x + 1,
                    gridRow: segment.y + 1,
                  }}
                />
              )
            })}
            
            {/* Render Food */}
            <div
              className="bg-white animate-[ping_0.5s_ease-out_infinite]"
              style={{
                gridColumn: food.x + 1,
                gridRow: food.y + 1,
                boxShadow: '0 0 10px #fff'
              }}
            />
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 border-8 border-red-600 animate-glitch p-4 text-center">
              <AlertTriangle size={64} className="text-red-500 mb-4 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-pixel text-red-500 uppercase tracking-widest mb-4">
                {score > 0 ? 'CRITICAL FAILURE' : 'SYSTEM READY'}
              </h2>
              {score > 0 && <p className="font-vt text-4xl text-white mb-8 bg-red-600 px-4 py-2 border-2 border-white shadow-[4px_4px_0_#000]">MEMORY RECOVERED: {score}</p>}
              <button 
                onClick={startGame}
                className="btn-glitch text-lg flex items-center gap-4 py-4 px-8 uppercase"
              >
                <RotateCcw size={24} />
                {score > 0 ? 'REBOOT.EXE' : 'EXECUTE'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Scoreboard */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8 mt-6 lg:mt-0">
        <div className='border-4 border-[#00ffff] p-6 bg-black flex flex-col items-center gap-2 shadow-[8px_8px_0_#ff00ff,-4px_-4px_0_#fff] relative'>
          <div className="absolute top-0 left-0 bg-[#00ffff] text-black font-pixel text-[10px] p-2 border-r-4 border-b-4 border-black">LIVE</div>
          <p className='font-pixel text-lg text-[#00ffff] mb-2 mt-4'>DAT.STREAM</p>
          <p className='text-7xl font-vt text-magenta-glitch'>
            {score.toString().padStart(4, '0')}
          </p>
        </div>
        
        <div className='border-4 border-[#ff00ff] p-6 bg-black flex flex-col items-center gap-2 shadow-[-8px_8px_0_#00ffff,4px_-4px_0_#fff] relative'>
          <div className="absolute top-0 right-0 bg-[#ff00ff] text-black font-pixel text-[10px] p-2 border-l-4 border-b-4 border-black">REC</div>
          <p className='font-pixel text-lg text-[#ff00ff] mb-2 mt-4'>MAX.OVERRIDE</p>
          <p className='text-6xl font-vt text-cyan-glitch'>
            {highScore.toString().padStart(4, '0')}
          </p>
        </div>

        <div className='border-4 border-white p-6 flex flex-col items-center justify-center mt-4 font-pixel text-xs text-white text-center bg-black hover:bg-white hover:text-black transition-colors shadow-[0_0_15px_#00ffff]'>
          <p className="mb-4 text-center">INPUT_METHOD_ESTABLISHED</p>
          <p className="text-xl font-vt text-[#00ffff] mix-blend-difference text-center bg-black px-2 mt-2">USE [W/A/S/D] OR ARROWS</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { motion } from 'framer-motion';
import { ChessBoard } from './ChessBoard';
import { GameTimer } from './GameTimer';
import { MoveHistory } from './MoveHistory';
import { CapturedPieces } from './CapturedPieces';
import { GameControls } from './GameControls';
import { PromotionDialog } from './PromotionDialog';
import { GameOverDialog } from './GameOverDialog';
import { getBestMove, Difficulty } from '@/lib/chess/engine';
import { identifyOpening } from '@/lib/chess/openings';
import { toast } from 'sonner';
import { useChessSounds } from '@/hooks/use-chess-sounds';

export const ChessGame: React.FC = () => {
  const { playSound } = useChessSounds();
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveNotations, setMoveNotations] = useState<string[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);
  const [currentOpening, setCurrentOpening] = useState<string | null>(null);
  
  // Timer state
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [timeControl, setTimeControl] = useState(600);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game settings
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  
  // Dialogs
  const [promotionPending, setPromotionPending] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [gameOver, setGameOver] = useState<{
    result: 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'resignation' | null;
    winner: 'white' | 'black' | 'draw' | null;
  }>({ result: null, winner: null });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver.result) {
      timerRef.current = setInterval(() => {
        if (game.turn() === 'w') {
          setWhiteTime((t) => {
            if (t <= 1) {
              setGameOver({ result: 'timeout', winner: 'black' });
              return 0;
            }
            return t - 1;
          });
        } else {
          setBlackTime((t) => {
            if (t <= 1) {
              setGameOver({ result: 'timeout', winner: 'white' });
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, isPaused, game.turn(), gameOver.result]);

  // AI move effect
  useEffect(() => {
    if (game.turn() === 'b' && !game.isGameOver() && !promotionPending && gameStarted) {
      const timeoutId = setTimeout(() => {
        const gameCopy = new Chess(game.fen());
        const bestMove = getBestMove(gameCopy, difficulty);
        
        if (bestMove) {
          makeMove(bestMove.from, bestMove.to, bestMove.promotion as 'q' | 'r' | 'b' | 'n' | undefined);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [game.fen(), difficulty, promotionPending, gameStarted]);

  const makeMove = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from, to, promotion });
      
      if (move) {
        // Track captured pieces
        if (move.captured) {
          if (move.color === 'w') {
            setCapturedByWhite((prev) => [...prev, move.captured!]);
          } else {
            setCapturedByBlack((prev) => [...prev, move.captured!]);
          }
        }

        setGame(gameCopy);
        setLastMove({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        
        // Update move history
        const newHistory = [...moveHistory, `${from}${to}${promotion || ''}`];
        setMoveHistory(newHistory);
        setMoveNotations((prev) => [...prev, move.san]);
        
        // Identify opening
        const opening = identifyOpening(newHistory);
        if (opening && opening !== currentOpening) {
          setCurrentOpening(opening);
          toast.info(`Opening: ${opening}`);
        }

        // Check game end conditions and play appropriate sounds
        if (gameCopy.isCheckmate()) {
          setGameOver({
            result: 'checkmate',
            winner: gameCopy.turn() === 'w' ? 'black' : 'white',
          });
          playSound('gameOver');
        } else if (gameCopy.isStalemate()) {
          setGameOver({ result: 'stalemate', winner: 'draw' });
          playSound('gameOver');
        } else if (gameCopy.isDraw()) {
          setGameOver({ result: 'draw', winner: 'draw' });
          playSound('gameOver');
        } else if (gameCopy.inCheck()) {
          playSound('check');
          toast.warning('Check!');
        } else if (move.flags.includes('k') || move.flags.includes('q')) {
          // Castling
          playSound('castle');
        } else if (move.captured) {
          playSound('capture');
        } else {
          playSound('move');
        }

        return true;
      }
    } catch {
      playSound('illegal');
    }
    return false;
  }, [game, moveHistory, currentOpening, playSound]);

  const handleSquareClick = useCallback((square: Square) => {
    if (game.turn() !== 'w' || gameOver.result) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    if (selectedSquare) {
      // Check if this is a pawn promotion
      const piece = game.get(selectedSquare);
      if (
        piece?.type === 'p' &&
        piece.color === 'w' &&
        selectedSquare[1] === '7' &&
        square[1] === '8'
      ) {
        setPromotionPending({ from: selectedSquare, to: square });
        return;
      }

      if (makeMove(selectedSquare, square)) {
        return;
      }
    }

    // Select new piece
    const piece = game.get(square);
    if (piece && piece.color === 'w') {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map((m: Move) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [game, selectedSquare, gameStarted, gameOver.result, makeMove]);

  const handlePromotion = useCallback((piece: 'q' | 'r' | 'b' | 'n') => {
    if (promotionPending) {
      makeMove(promotionPending.from, promotionPending.to, piece);
      setPromotionPending(null);
    }
  }, [promotionPending, makeMove]);

  const handleNewGame = useCallback(() => {
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setMoveNotations([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setCurrentOpening(null);
    setWhiteTime(timeControl);
    setBlackTime(timeControl);
    setGameStarted(false);
    setIsPaused(false);
    setGameOver({ result: null, winner: null });
    playSound('gameStart');
    toast.success('New game started!');
  }, [timeControl, playSound]);

  const handleResign = useCallback(() => {
    setGameOver({ result: 'resignation', winner: 'black' });
    playSound('gameOver');
  }, [playSound]);

  const handleTimeControlChange = useCallback((time: number) => {
    setTimeControl(time);
    setWhiteTime(time);
    setBlackTime(time);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">
            Chess Master
          </h1>
          <p className="text-muted-foreground">
            Challenge the AI • Learn openings • Master the game
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Left sidebar */}
          <motion.div
            className="w-full lg:w-64 space-y-4 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GameTimer
              time={blackTime}
              isActive={game.turn() === 'b' && gameStarted && !isPaused && !gameOver.result}
              player="black"
              playerName={`AI (${difficulty})`}
            />
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-display font-semibold mb-3 text-foreground">Captured</h3>
              <CapturedPieces
                capturedByWhite={capturedByWhite}
                capturedByBlack={capturedByBlack}
              />
            </div>
          </motion.div>

          {/* Chess board */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ChessBoard
              game={game}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              onSquareClick={handleSquareClick}
            />
            
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GameTimer
                time={whiteTime}
                isActive={game.turn() === 'w' && gameStarted && !isPaused && !gameOver.result}
                player="white"
                playerName="You"
              />
            </motion.div>
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            className="w-full lg:w-64 space-y-4 order-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GameControls
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              timeControl={timeControl}
              onTimeControlChange={handleTimeControlChange}
              onNewGame={handleNewGame}
              onResign={handleResign}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              gameInProgress={gameStarted && !gameOver.result}
            />
            
            <MoveHistory moves={moveNotations} currentOpening={currentOpening} />
          </motion.div>
        </div>
      </div>

      <PromotionDialog
        isOpen={promotionPending !== null}
        color="w"
        onSelect={handlePromotion}
      />

      <GameOverDialog
        isOpen={gameOver.result !== null}
        result={gameOver.result}
        winner={gameOver.winner}
        onNewGame={handleNewGame}
      />
    </div>
  );
};

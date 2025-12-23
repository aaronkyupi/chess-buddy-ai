import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Handshake, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverDialogProps {
  isOpen: boolean;
  result: 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'resignation' | null;
  winner: 'white' | 'black' | 'draw' | null;
  onNewGame: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  isOpen,
  result,
  winner,
  onNewGame,
}) => {
  const getResultText = () => {
    switch (result) {
      case 'checkmate':
        return `Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins!`;
      case 'stalemate':
        return 'Stalemate! The game is a draw.';
      case 'draw':
        return 'Draw!';
      case 'timeout':
        return `Time's up! ${winner === 'white' ? 'White' : 'Black'} wins!`;
      case 'resignation':
        return `${winner === 'white' ? 'Black' : 'White'} resigned. ${winner === 'white' ? 'White' : 'Black'} wins!`;
      default:
        return 'Game Over';
    }
  };

  const getIcon = () => {
    switch (result) {
      case 'checkmate':
      case 'resignation':
      case 'timeout':
        return <Trophy className="w-16 h-16 text-primary" />;
      case 'stalemate':
      case 'draw':
        return <Handshake className="w-16 h-16 text-muted-foreground" />;
      default:
        return <Clock className="w-16 h-16 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card border border-border rounded-xl p-8 shadow-2xl text-center max-w-sm mx-4"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              className="flex justify-center mb-4"
            >
              {getIcon()}
            </motion.div>
            
            <motion.h2
              className="font-display text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {getResultText()}
            </motion.h2>
            
            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {winner === 'white' && result !== 'draw' && result !== 'stalemate'
                ? 'Congratulations! You defeated the AI!'
                : winner === 'black' && result !== 'draw' && result !== 'stalemate'
                ? 'The AI wins this time. Try again!'
                : 'A hard-fought game!'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={onNewGame} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

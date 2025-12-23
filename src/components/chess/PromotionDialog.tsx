import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceComponent } from '@/lib/chess/pieces';

interface PromotionDialogProps {
  isOpen: boolean;
  color: 'w' | 'b';
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  onSelect,
}) => {
  const pieces: ('q' | 'r' | 'b' | 'n')[] = ['q', 'r', 'b', 'n'];

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
            className="bg-card border border-border rounded-xl p-6 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <h3 className="font-display text-lg font-semibold text-center mb-4">
              Promote Pawn
            </h3>
            <div className="flex gap-3">
              {pieces.map((piece) => {
                const PieceComponent = getPieceComponent(color, piece);
                return PieceComponent ? (
                  <motion.button
                    key={piece}
                    onClick={() => onSelect(piece)}
                    className="w-16 h-16 rounded-lg bg-muted hover:bg-primary/20 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PieceComponent className="w-12 h-12" />
                  </motion.button>
                ) : null;
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

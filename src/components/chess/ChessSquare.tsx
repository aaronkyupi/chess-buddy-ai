import React from 'react';
import { motion } from 'framer-motion';
import { getPieceComponent } from '@/lib/chess/pieces';
import { cn } from '@/lib/utils';

interface ChessSquareProps {
  square: string;
  piece: { type: string; color: 'w' | 'b' } | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: () => void;
  showCoordinates: { file: boolean; rank: boolean };
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isLastMove,
  isCheck,
  onClick,
  showCoordinates,
}) => {
  const PieceComponent = piece ? getPieceComponent(piece.color, piece.type) : null;
  const file = square[0];
  const rank = square[1];

  return (
    <motion.div
      className={cn(
        'relative aspect-square flex items-center justify-center cursor-pointer transition-colors duration-150',
        isLight ? 'chess-square-light' : 'chess-square-dark',
        isSelected && 'chess-square-highlight',
        isLastMove && !isSelected && 'chess-square-last-move',
        isCheck && 'chess-square-check',
        isLegalMove && 'chess-square-legal'
      )}
      onClick={onClick}
      whileHover={{ scale: piece ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Coordinates */}
      {showCoordinates.file && (
        <span className={cn(
          'absolute bottom-0.5 right-1 text-[10px] font-medium select-none',
          isLight ? 'text-board-dark/70' : 'text-board-light/70'
        )}>
          {file}
        </span>
      )}
      {showCoordinates.rank && (
        <span className={cn(
          'absolute top-0.5 left-1 text-[10px] font-medium select-none',
          isLight ? 'text-board-dark/70' : 'text-board-light/70'
        )}>
          {rank}
        </span>
      )}

      {/* Piece */}
      {PieceComponent && (
        <motion.div
          className="w-[85%] h-[85%] piece-shadow"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <PieceComponent className="w-full h-full" />
        </motion.div>
      )}

      {/* Legal move indicator for captures */}
      {isLegalMove && piece && (
        <div className="absolute inset-0 border-[3px] border-board-legal/60 rounded-full" />
      )}
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { getPieceComponent } from '@/lib/chess/pieces';

interface CapturedPiecesProps {
  capturedByWhite: string[];
  capturedByBlack: string[];
}

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  capturedByWhite,
  capturedByBlack,
}) => {
  const sortPieces = (pieces: string[]) => {
    const order = ['q', 'r', 'b', 'n', 'p'];
    return [...pieces].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  const calculateAdvantage = () => {
    const whiteValue = capturedByWhite.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
    const blackValue = capturedByBlack.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
    return whiteValue - blackValue;
  };

  const advantage = calculateAdvantage();

  const renderPieces = (pieces: string[], color: 'w' | 'b') => {
    const sorted = sortPieces(pieces);
    return (
      <div className="flex flex-wrap gap-0.5">
        {sorted.map((piece, index) => {
          const PieceComponent = getPieceComponent(color, piece);
          return PieceComponent ? (
            <motion.div
              key={`${piece}-${index}`}
              className="w-5 h-5 opacity-80"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <PieceComponent className="w-full h-full" />
            </motion.div>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">White captured:</span>
        {advantage > 0 && (
          <span className="text-xs text-primary font-semibold">+{advantage}</span>
        )}
      </div>
      <div className="min-h-[24px]">
        {renderPieces(capturedByWhite, 'b')}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Black captured:</span>
        {advantage < 0 && (
          <span className="text-xs text-primary font-semibold">+{Math.abs(advantage)}</span>
        )}
      </div>
      <div className="min-h-[24px]">
        {renderPieces(capturedByBlack, 'w')}
      </div>
    </div>
  );
};

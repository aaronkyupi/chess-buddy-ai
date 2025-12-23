import React from 'react';
import { Chess, Square } from 'chess.js';
import { motion } from 'framer-motion';
import { ChessSquare } from './ChessSquare';

interface ChessBoardProps {
  game: Chess;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  onSquareClick: (square: Square) => void;
  flipped?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick,
  flipped = false,
}) => {
  const board = game.board();
  const inCheck = game.inCheck();
  const turn = game.turn();

  // Find king position if in check
  let kingSquare: Square | null = null;
  if (inCheck) {
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === turn) {
          kingSquare = (String.fromCharCode(97 + f) + (8 - r)) as Square;
          break;
        }
      }
    }
  }

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  if (flipped) {
    files.reverse();
    ranks.reverse();
  }

  return (
    <motion.div
      className="board-shadow rounded-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-8 w-[min(80vw,560px)] aspect-square">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = (file + rank) as Square;
            const boardRank = flipped ? rankIndex : 7 - rankIndex;
            const boardFile = flipped ? 7 - fileIndex : fileIndex;
            const piece = board[7 - parseInt(rank) + 1]?.[file.charCodeAt(0) - 97];
            const isLight = (boardRank + boardFile) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMove = lastMove?.from === square || lastMove?.to === square;
            const isCheck = kingSquare === square;

            return (
              <ChessSquare
                key={square}
                square={square}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isLegalMove={isLegalMove}
                isLastMove={isLastMove}
                isCheck={isCheck}
                onClick={() => onSquareClick(square)}
                showCoordinates={{
                  file: rankIndex === 7,
                  rank: fileIndex === 0,
                }}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
};

// Chess opening book with popular opening moves
export interface Opening {
  name: string;
  moves: string[];
  description: string;
}

export const openingBook: Record<string, string[]> = {
  // Starting position responses
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e2e4', 'd2d4', 'g1f3', 'c2c4'],
  
  // After 1. e4
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'c7c6', 'd7d6'],
  
  // Sicilian Defense
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'b1c3', 'd2d4'],
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['d7d6', 'b8c6', 'e7e6'],
  
  // Italian Game
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['f1c4', 'f1b5', 'd2d4'],
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['g8f6', 'f8c5'],
  
  // French Defense
  'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['d2d4', 'b1c3'],
  
  // Caro-Kann Defense
  'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['d2d4', 'b1c3'],
  
  // After 1. d4
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -': ['d7d5', 'g8f6', 'e7e6', 'f7f5'],
  
  // Queen's Gambit
  'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -': ['c2c4', 'g1f3', 'b1c3'],
  'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq -': ['e7e6', 'c7c6', 'd5c4'],
  
  // King's Indian Defense
  'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -': ['c2c4', 'g1f3', 'b1c3'],
  
  // London System
  'rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq -': ['d7d5', 'e7e6'],
  
  // English Opening
  'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'g8f6', 'e7e6'],
  
  // Ruy Lopez
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['a7a6', 'g8f6', 'f8c5'],
};

export const namedOpenings: Opening[] = [
  {
    name: "Italian Game",
    moves: ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4"],
    description: "A classic opening focusing on rapid development and control of the center."
  },
  {
    name: "Sicilian Defense",
    moves: ["e2e4", "c7c5"],
    description: "Black's most popular response to 1.e4, fighting for center control."
  },
  {
    name: "French Defense",
    moves: ["e2e4", "e7e6"],
    description: "A solid defense creating a strong pawn chain."
  },
  {
    name: "Queen's Gambit",
    moves: ["d2d4", "d7d5", "c2c4"],
    description: "White offers a pawn to gain central control."
  },
  {
    name: "King's Indian Defense",
    moves: ["d2d4", "g8f6", "c2c4", "g7g6"],
    description: "A hypermodern defense allowing White to build a center then attacking it."
  },
  {
    name: "London System",
    moves: ["d2d4", "d7d5", "g1f3", "g8f6", "c1f4"],
    description: "A solid, easy-to-learn system for White."
  },
  {
    name: "Ruy Lopez",
    moves: ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"],
    description: "One of the oldest and most respected openings."
  },
  {
    name: "Caro-Kann Defense",
    moves: ["e2e4", "c7c6"],
    description: "A solid defense that supports d5 with c6."
  },
];

export function getOpeningMove(fen: string): string | null {
  const fenKey = fen.split(' ').slice(0, 4).join(' ');
  const moves = openingBook[fenKey];
  if (moves && moves.length > 0) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  return null;
}

export function identifyOpening(moveHistory: string[]): string | null {
  for (const opening of namedOpenings) {
    const openingMoves = opening.moves.slice(0, moveHistory.length);
    if (openingMoves.length > 0 && 
        openingMoves.every((move, i) => moveHistory[i] === move)) {
      return opening.name;
    }
  }
  return null;
}

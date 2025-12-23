import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MoveHistoryProps {
  moves: string[];
  currentOpening: string | null;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, currentOpening }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  // Group moves into pairs (white, black)
  const movePairs: { moveNumber: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-display font-semibold text-foreground">Move History</h3>
        {currentOpening && (
          <motion.p
            className="text-xs text-primary mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentOpening}
          </motion.p>
        )}
      </div>
      
      <ScrollArea className="h-[200px]" ref={scrollRef}>
        <div className="p-3 space-y-1">
          {movePairs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No moves yet
            </p>
          ) : (
            movePairs.map((pair, index) => (
              <motion.div
                key={pair.moveNumber}
                className="flex gap-2 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <span className="w-8 text-muted-foreground font-mono">
                  {pair.moveNumber}.
                </span>
                <span className={cn(
                  'w-16 font-mono',
                  index === movePairs.length - 1 && !pair.black && 'text-primary font-semibold'
                )}>
                  {pair.white}
                </span>
                <span className={cn(
                  'w-16 font-mono',
                  index === movePairs.length - 1 && pair.black && 'text-primary font-semibold'
                )}>
                  {pair.black || ''}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

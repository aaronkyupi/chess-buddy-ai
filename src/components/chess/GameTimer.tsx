import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameTimerProps {
  time: number; // in seconds
  isActive: boolean;
  player: 'white' | 'black';
  playerName: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  time,
  isActive,
  player,
  playerName,
}) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isLow = time < 60;
  const isCritical = time < 30;

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300',
        isActive 
          ? 'border-primary bg-primary/10 shadow-lg' 
          : 'border-border bg-card/50',
        isCritical && isActive && 'animate-pulse border-destructive bg-destructive/10'
      )}
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center',
        player === 'white' ? 'bg-foreground' : 'bg-background border border-foreground'
      )}>
        <div className={cn(
          'w-5 h-5 rounded-full',
          player === 'white' ? 'bg-background' : 'bg-foreground'
        )} />
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{playerName}</p>
        <div className="flex items-center gap-2">
          <Clock className={cn(
            'w-4 h-4',
            isLow ? 'text-destructive' : 'text-muted-foreground'
          )} />
          <span className={cn(
            'font-mono text-xl font-bold',
            isLow && 'text-destructive'
          )}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Flag, Settings2, Play, Pause, Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Difficulty } from '@/lib/chess/engine';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  timeControl: number;
  onTimeControlChange: (time: number) => void;
  onNewGame: () => void;
  onResign: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  gameInProgress: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  timeControl,
  onTimeControlChange,
  onNewGame,
  onResign,
  isPaused,
  onTogglePause,
  gameInProgress,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Settings2 className="w-4 h-4" />
          <h3 className="font-display font-semibold">Game Settings</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              AI Difficulty
            </label>
            <Select
              value={difficulty}
              onValueChange={(v) => onDifficultyChange(v as Difficulty)}
              disabled={gameInProgress}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="master">Master</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Time Control
            </label>
            <Select
              value={timeControl.toString()}
              onValueChange={(v) => onTimeControlChange(parseInt(v))}
              disabled={gameInProgress}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="180">3 minutes</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
                <SelectItem value="600">10 minutes</SelectItem>
                <SelectItem value="900">15 minutes</SelectItem>
                <SelectItem value="1800">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Undo/Redo buttons */}
        {gameInProgress && (
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                onClick={onUndo}
                variant="outline"
                className="w-full"
                disabled={!canUndo}
              >
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                onClick={onRedo}
                variant="outline"
                className="w-full"
                disabled={!canRedo}
              >
                <Redo2 className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </motion.div>
          </div>
        )}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNewGame}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </motion.div>

        {gameInProgress && (
          <>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onTogglePause}
                variant="secondary"
                className="w-full"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onResign}
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/10"
              >
                <Flag className="w-4 h-4 mr-2" />
                Resign
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

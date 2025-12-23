import { useCallback, useRef } from 'react';

type SoundType = 'move' | 'capture' | 'check' | 'castle' | 'gameOver' | 'gameStart' | 'illegal';

export const useChessSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3,
    attack: number = 0.01,
    decay: number = 0.1
  ) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playNoise = useCallback((duration: number, volume: number = 0.2) => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playSound = useCallback((type: SoundType) => {
    try {
      switch (type) {
        case 'move':
          // Soft wooden tap sound
          playTone(200, 0.08, 'triangle', 0.25);
          playNoise(0.05, 0.1);
          break;

        case 'capture':
          // More aggressive sound with impact
          playTone(150, 0.1, 'triangle', 0.35);
          playTone(100, 0.15, 'sawtooth', 0.15);
          playNoise(0.08, 0.2);
          break;

        case 'check':
          // Alert-like ascending tone
          playTone(440, 0.1, 'sine', 0.3);
          setTimeout(() => playTone(660, 0.15, 'sine', 0.25), 100);
          break;

        case 'castle':
          // Double tap for castling
          playTone(180, 0.06, 'triangle', 0.2);
          playNoise(0.04, 0.1);
          setTimeout(() => {
            playTone(220, 0.06, 'triangle', 0.2);
            playNoise(0.04, 0.1);
          }, 80);
          break;

        case 'gameOver':
          // Dramatic ending chord
          playTone(220, 0.4, 'sine', 0.2);
          playTone(277, 0.4, 'sine', 0.15);
          playTone(330, 0.4, 'sine', 0.15);
          setTimeout(() => {
            playTone(196, 0.6, 'sine', 0.25);
            playTone(247, 0.6, 'sine', 0.2);
            playTone(294, 0.6, 'sine', 0.2);
          }, 400);
          break;

        case 'gameStart':
          // Bright ascending sequence
          playTone(262, 0.1, 'sine', 0.2);
          setTimeout(() => playTone(330, 0.1, 'sine', 0.2), 100);
          setTimeout(() => playTone(392, 0.15, 'sine', 0.25), 200);
          break;

        case 'illegal':
          // Low buzz for illegal move
          playTone(100, 0.15, 'sawtooth', 0.15);
          break;
      }
    } catch (error) {
      // Audio context might fail in some browsers
      console.warn('Failed to play sound:', error);
    }
  }, [playTone, playNoise]);

  return { playSound };
};

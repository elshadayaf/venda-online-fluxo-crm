
import { useState, useCallback } from 'react';

export function useAudio() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const playCashRegisterSound = useCallback(() => {
    if (!isSoundEnabled) return;

    // Criar um som de caixa registradora usando Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Função para criar um tom
    const createTone = (frequency: number, duration: number, delay: number = 0) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration);
    };

    // Som de caixa registradora - sequência de tons que lembram "cha-ching"
    createTone(800, 0.1, 0);     // "Cha"
    createTone(1000, 0.15, 0.1); // "Ching" - tom mais alto e longo
    createTone(600, 0.1, 0.25);  // Eco final
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return {
    isSoundEnabled,
    toggleSound,
    playCashRegisterSound
  };
}

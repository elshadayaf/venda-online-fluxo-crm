
import { useState, useCallback } from 'react';

export function useAudio() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const playCashRegisterSound = useCallback(() => {
    if (!isSoundEnabled) return;

    // Criar um som de moedas caindo usando Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Função para criar um tom
    const createTone = (frequency: number, duration: number, delay: number = 0, volume: number = 0.2) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
      oscillator.type = 'triangle'; // Som mais metálico
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration);
    };

    // Som de moedas caindo - múltiplos tons metálicos rápidos
    const coinFrequencies = [850, 750, 950, 680, 820, 720, 900, 650];
    
    coinFrequencies.forEach((freq, index) => {
      createTone(freq, 0.08, index * 0.05, 0.15); // Tons rápidos e sequenciais
    });
    
    // Adicionar alguns tons de eco para simular moedas batendo no chão
    createTone(400, 0.1, 0.4, 0.1);
    createTone(350, 0.12, 0.5, 0.08);
    createTone(300, 0.15, 0.6, 0.06);
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


import { useState, useCallback } from 'react';

export function useAudio() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const playCashRegisterSound = useCallback(() => {
    if (!isSoundEnabled) return;

    try {
      // Usar o arquivo MP3 personalizado fornecido pelo usuário
      const audio = new Audio('https://logitrackexpress.online/wp-content/uploads/2025/05/vendaaprovada.mp3');
      audio.volume = 0.5; // Volume ajustável (50%)
      
      // Tocar o som
      audio.play().catch(error => {
        console.error('Erro ao reproduzir som de venda aprovada:', error);
        
        // Fallback para o som original em caso de erro
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const createTone = (frequency: number, duration: number, delay: number = 0, volume: number = 0.2) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
          oscillator.type = 'triangle';
          gainNode.gain.setValueAtTime(volume, audioContext.currentTime + delay);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
          
          oscillator.start(audioContext.currentTime + delay);
          oscillator.stop(audioContext.currentTime + delay + duration);
        };

        // Som de fallback - moedas caindo
        const coinFrequencies = [850, 750, 950, 680, 820, 720, 900, 650];
        
        coinFrequencies.forEach((freq, index) => {
          createTone(freq, 0.08, index * 0.05, 0.15);
        });
        
        createTone(400, 0.1, 0.4, 0.1);
        createTone(350, 0.12, 0.5, 0.08);
        createTone(300, 0.15, 0.6, 0.06);
      });
    } catch (error) {
      console.error('Erro ao criar objeto Audio:', error);
    }
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

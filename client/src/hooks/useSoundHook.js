import { useState, useCallback, useEffect } from 'react';

const useSound = (url, volume = 1) => {
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [gainNode, setGainNode] = useState(null);

  const loadSound = useCallback(async () => {
    if (!audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const gainNode = context.createGain();
      gainNode.gain.value = volume; 

      setAudioContext(context);
      setGainNode(gainNode);

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await context.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    }
  }, [audioContext, url, volume]);

  const playSound = useCallback(async () => {
    if (audioContext && audioBuffer && gainNode) {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNode); 
      gainNode.connect(audioContext.destination); 
      source.start();
    }
  }, [audioContext, audioBuffer, gainNode]);

  useEffect(() => {
    const handleUserGesture = async () => {
      await loadSound();
      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    };

    const handleClick = () => {
      handleUserGesture();
      document.removeEventListener('click', handleClick);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [audioContext, loadSound]);

  return playSound;
};

export default useSound;

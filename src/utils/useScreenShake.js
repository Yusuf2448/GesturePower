import { useState, useCallback } from 'react';

export const useScreenShake = () => {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = useCallback((duration = 400) => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, duration);
  }, []);

  return { isShaking, triggerShake };
};

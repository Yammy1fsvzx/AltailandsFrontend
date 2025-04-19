import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // Состояние для хранения отложенного значения
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления отложенного значения
    // после указанной задержки
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при размонтировании компонента или 
    // при изменении значения или задержки
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Эффект перезапускается только если value или delay изменились

  return debouncedValue;
} 
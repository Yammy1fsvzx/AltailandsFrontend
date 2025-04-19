import { Variants } from 'framer-motion';

// Типичные значения для разных эффектов анимации
type ScrollDirection = 'up' | 'down' | 'left' | 'right';
type AnimationIntensity = 'subtle' | 'medium' | 'strong';

// Набор базовых вариантов анимации
export const fadeIn = (
  direction: ScrollDirection = 'up', 
  intensity: AnimationIntensity = 'medium', 
  delay: number = 0
): Variants => {
  
  // Начальное смещение в зависимости от интенсивности
  const getOffset = (intensity: AnimationIntensity): number => {
    switch(intensity) {
      case 'subtle': return 10;
      case 'medium': return 30;
      case 'strong': return 50;
      default: return 30;
    }
  };
  
  // Длительность анимации
  const getDuration = (intensity: AnimationIntensity): number => {
    switch(intensity) {
      case 'subtle': return 0.5;
      case 'medium': return 0.7;
      case 'strong': return 0.9;
      default: return 0.7;
    }
  };
  
  const offset = getOffset(intensity);
  
  // Вычисляем начальные координаты в зависимости от направления
  let x = 0, y = 0;
  
  switch(direction) {
    case 'up':
      y = offset;
      break;
    case 'down':
      y = -offset;
      break;
    case 'left':
      x = offset;
      break;
    case 'right':
      x = -offset;
      break;
  }
  
  return {
    hidden: { 
      opacity: 0,
      x,
      y
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        duration: getDuration(intensity),
        delay
      }
    }
  };
};

// Анимация масштабирования
export const scaleIn = (
  delay: number = 0, 
  intensity: AnimationIntensity = 'medium'
): Variants => {
  
  const getScale = (intensity: AnimationIntensity): number => {
    switch(intensity) {
      case 'subtle': return 0.95;
      case 'medium': return 0.9;
      case 'strong': return 0.8;
      default: return 0.9;
    }
  };
  
  return {
    hidden: { 
      opacity: 0, 
      scale: getScale(intensity) 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        duration: 0.6,
        delay
      }
    }
  };
};

// Анимация для контейнеров с дочерними элементами
export const staggerContainer = (
  staggerChildren: number = 0.1, 
  delayChildren: number = 0
): Variants => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren
      }
    }
  };
};

// Специальная анимация для параллакс-эффекта при скролле
export const parallaxSection = {
  // Для контейнеров, движущихся со скоростью, отличной от скорости скролла
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: 'easeOut' 
      }
    }
  },
  
  // Для элементов, входящих в область видимости при скролле
  scrollIn: (direction: ScrollDirection = 'up'): Variants => {
    // Определяем начальное положение
    let initial = {};
    
    switch(direction) {
      case 'up':
        initial = { y: 100, opacity: 0 };
        break;
      case 'down':
        initial = { y: -100, opacity: 0 };
        break;
      case 'left':
        initial = { x: 100, opacity: 0 };
        break;
      case 'right':
        initial = { x: -100, opacity: 0 };
        break;
    }
    
    return {
      initial,
      inView: { 
        x: 0, 
        y: 0, 
        opacity: 1,
        transition: { 
          type: 'spring',
          stiffness: 80,
          damping: 15
        }
      }
    };
  }
};

// Анимации для карточек и секций
export const cardAnimation = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      duration: 0.6
    }
  }
};

// Анимации для навигации и header
export const navAnimation = {
  hidden: { 
    opacity: 0, 
    y: -20
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// Анимации для плавного появления текста по буквам
export const textAnimation = {
  hidden: { 
    opacity: 0 
  },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: { 
      staggerChildren: 0.03, 
      delayChildren: 0.04 * i 
    }
  })
};

export const letterAnimation = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100
    }
  }
};

// Волнообразное появление элементов
export const waveAnimation = (index: number, total: number = 5): Variants => {
  const delay = (index / total) * 0.5;
  return {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] // Плавное замедление
      }
    }
  };
}; 
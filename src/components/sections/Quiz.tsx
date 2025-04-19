'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Loader2, AlertCircle } from 'lucide-react';
import { Quiz as QuizType } from '@/types/quiz'; // Импорт типа квиза
import { submitApplication, ApplicationRequestBody } from '@/lib/api/requests';

// Убираем статичные вопросы, они будут приходить из пропсов
/*
const quizQuestions = [
  // ...
];
*/

// Определяем тип пропсов
interface QuizProps {
  quizData: QuizType | null;
}

// Define submission status type
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const Quiz: React.FC<QuizProps> = ({ quizData }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Используем ID вопроса (number) как ключ
  const [userData, setUserData] = useState({ name: '', phone: '', email: '' });
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [direction, setDirection] = useState(0);
  const [stars, setStars] = useState<React.ReactNode[]>([]);

  // Получаем вопросы из пропсов или пустой массив
  const questions = quizData?.questions || [];
  // Рассчитываем общее количество шагов на основе данных из API
  const totalSteps = questions.length + 2; // Вопросы + Данные + Спасибо

  // Эффект для генерации звезд (упрощенный из Footer.tsx)
  useEffect(() => {
    const generateStars = () => {
      const starsCount = 80; // Чуть больше звезд для полного фона
      const newStars = [];
      const viewWidth = 1920;
      const viewHeight = 1080; // Используем высоту нового viewBox

      for (let i = 0; i < starsCount; i++) {
        const xPos = Math.random() * viewWidth;
        // Распределяем звезды по большей части высоты, но не у самого низа
        const yPos = Math.random() * viewHeight * 0.8;
        const size = 0.5 + Math.random() * 1.5;
        const brightness = 0.3 + Math.random() * 0.5; // Немного ярче могут быть
        const maxBrightness = brightness + 0.2 + Math.random() * 0.2;
        const animDuration = 2 + Math.random() * 4;
        const animDelay = Math.random() * 6; // Увеличим разброс задержки

        newStars.push(
          <motion.circle
            key={`quiz-star-${i}`}
            cx={xPos}
            cy={yPos}
            r={size}
            fill={Math.random() > 0.9 ? "#E3F6FF" : "white"}
            opacity={brightness}
            initial={{ opacity: brightness * 0.7 }}
            animate={{
              opacity: [brightness, maxBrightness, brightness],
            }}
            transition={{
              repeat: Infinity,
              duration: animDuration,
              delay: animDelay,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
          />
        );
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => paginate(1), 200);
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    // Reset status if user types after error
    if (status === 'error') {
        setStatus('idle');
        setStatusMessage('');
    }
  };

  const paginate = (newDirection: number) => {
    // Проверяем, не является ли текущий шаг вводом контактов перед уходом назад
    if (isContactStep && newDirection < 0 && step > 1) { 
      setDirection(newDirection);
      setStep((prev) => prev + newDirection);
    } else if (!isContactStep || newDirection > 0) { // Разрешаем идти вперед или назад с шага вопросов
       setDirection(newDirection);
       setStep((prev) => prev + newDirection);
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // Basic validation
    if (!userData.name || !userData.phone || !userData.email) {
        setStatus('error');
        setStatusMessage('Пожалуйста, заполните все контактные поля.');
        return;
    }
    if (!quizData) {
        setStatus('error');
        setStatusMessage('Ошибка: данные квиза отсутствуют.');
        return;
    }

    setStatus('loading');
    setStatusMessage('');
    console.log("Submitting Quiz:", { answers, userData, quizId: quizData.id });
    
    // Prepare data for API
    const requestData: ApplicationRequestBody = {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        quiz_answers: JSON.stringify(answers), // Stringify answers
        request_type: 'quiz',
        status: 'new',
        // Assuming quiz app_label='quizzes' and model_name='quiz'
        related_object_content_type_app_label: 'quizzes',
        related_object_model_name: 'quiz',
        related_object_id: quizData.id,
    };

    try {
        // Call the actual API function
        await submitApplication(requestData);
        
        setStatus('success');
        // No need for status message here, user goes to Thank You step
        // setIsSubmitted(true); // Remove old state
        // Reset form data is good practice even if navigating away
        setUserData({ name: '', phone: '', email: '' });
        setAnswers({});
        // Navigate to Thank You step
        setDirection(1);
        setStep(totalSteps);

    } catch (error) {
        console.error("Quiz submission error:", error);
        setStatus('error');
        setStatusMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
    } 
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
  };

  // Определяем текущий вопрос и шаги
  const currentQuestion = questions[step - 1];
  const isContactStep = step === questions.length + 1;
  const isThankYouStep = step === totalSteps;

  // Если нет данных квиза, ничего не рендерим (или можно показать заглушку)
  if (!quizData) {
    return null; 
  }

  return (
    <section 
      id="quiz-section" 
      className="w-full relative flex flex-col justify-center min-h-screen py-16 md:py-24 bg-gradient-to-b from-[#0e463e] to-[#0c3c34] text-gray-200 overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Градиенты из Footer */}
            <linearGradient id="quizFooterMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B3B33" />
              <stop offset="100%" stopColor="#072F29" />
            </linearGradient>
            <linearGradient id="quizFooterForegroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#072F29" />
              <stop offset="100%" stopColor="#041F1B" />
            </linearGradient>
            <linearGradient id="quizFooterTreeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0A352E" />
              <stop offset="100%" stopColor="#072A24" />
            </linearGradient>
            {/* Фильтр свечения из Footer */}
            <filter id="quizFooterGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Звезды (рендерятся из состояния) */}
          <g className="quiz-stars">
            {stars}
          </g>
          {/* Горы (из Footer, Y координаты скорректированы для viewBox 0 0 1920 1080) */}
          <path 
            d="M0,850 L200,770 L400,810 L600,750 L800,830 L1000,740 L1200,790 L1400,760 L1600,800 L1800,780 L1920,810 L1920,1080 L0,1080 Z" 
            fill="url(#quizFooterMountainGradient)"
            opacity="0.8"
          />
          <path 
            d="M0,900 L100,870 L200,890 L300,860 L500,910 L700,850 L900,920 L1200,870 L1400,910 L1600,860 L1800,900 L1920,880 L1920,1080 L0,1080 Z" 
            fill="url(#quizFooterForegroundGradient)"
            opacity="0.9"
          />
          {/* Деревья (из Footer, Y координаты скорректированы) */}
          <g opacity="0.7" fill="url(#quizFooterTreeGradient)">
            <path d="M300,1000 L290,980 L295,982 L285,965 L290,968 L285,950 L290,955 L287,940 L290,930 L293,940 L295,955 L300,968 L305,965 L295,982 L305,980 L300,1000 Z" />
            <path d="M320,1010 L310,985 L315,988 L305,968 L310,972 L305,950 L313,960 L310,930 L315,920 L320,930 L317,960 L325,972 L320,968 L310,988 L330,985 L320,1010 Z" />
            <path d="M1600,1000 L1590,980 L1595,982 L1585,965 L1590,968 L1585,950 L1590,955 L1587,940 L1590,930 L1593,940 L1595,955 L1600,968 L1605,965 L1595,982 L1605,980 L1600,1000 Z" />
            <path d="M1630,1005 L1620,985 L1625,988 L1615,970 L1620,972 L1615,955 L1623,962 L1620,940 L1625,930 L1630,940 L1627,962 L1635,972 L1630,970 L1620,988 L1640,985 L1630,1005 Z" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start flex-grow">
        {!isThankYouStep && (
          <div className="mb-10 md:mb-14 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight">
              {quizData.title || "Ответьте на несколько вопросов"}{/* Используем title из API */} 
              {/* <span className="inline lg:block">
                и получите <span className="text-[#25BD6B]">бесплатную</span> консультацию юриста по ЗУ
              </span> */}
               {quizData.description && (
                  <span className="block text-lg md:text-xl font-normal text-gray-300 mt-3">
                    {quizData.description}
                  </span>
               )}
            </h2>
          </div>
        )}

        <div className="relative w-full pb-24 pt-8 md:pt-0">
          {!isThankYouStep && !isContactStep && (
            <div className="flex justify-center space-x-2 mb-8 max-w-xl mx-auto">
              {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= i + 1 ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className="w-full"
            >
              {!isContactStep && !isThankYouStep && currentQuestion && (
                <div className="text-center max-w-3xl mx-auto">
                  <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg inline-block mb-6 text-gray-800">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {step}. {currentQuestion.text}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {currentQuestion.answers.map((answer) => (
                      <motion.button
                        key={answer.id}
                        onClick={() => handleAnswerChange(currentQuestion.id, answer.text)}
                        className={`w-full text-left px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 transition-all duration-200 ${ 
                          answers[currentQuestion.id] === answer.text
                            ? 'bg-white border-[#25BD6B] text-green-700 shadow-md'
                            : 'bg-white/80 border-transparent hover:bg-white hover:border-green-300 text-gray-700 hover:text-gray-900'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {answer.text}
                      </motion.button>
                    ))}
                  </div>
                  {step > 1 && (
                     <button 
                      onClick={() => paginate(-1)}
                      className="mt-6 text-sm text-white/70 hover:text-white transition-colors"
                     >
                       Назад
                     </button>
                  )}
                </div>
              )}

              {isContactStep && (
                <div className="text-center max-w-xl mx-auto">
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-gray-800">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-5">Почти готово! Оставьте контакты для связи</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="quiz-name" className="sr-only">Имя</label>
                        <input type="text" name="name" id="quiz-name" required value={userData.name} onChange={handleUserDataChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-base" placeholder="Ваше имя"/>
                      </div>
                      <div>
                        <label htmlFor="quiz-phone" className="sr-only">Телефон</label>
                        <input type="tel" name="phone" id="quiz-phone" required value={userData.phone} onChange={handleUserDataChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-base" placeholder="Номер телефона"/>
                      </div>
                      <div>
                        <label htmlFor="quiz-email" className="sr-only">Email</label>
                        <input type="email" name="email" id="quiz-email" required value={userData.email} onChange={handleUserDataChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-base" placeholder="Email"/>
                      </div>
                      <button 
                        type="submit" 
                        disabled={status === 'loading' || status === 'success'} 
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {status === 'success' ? 'Заявка отправлена!' : 'Получить консультацию'}
                      </button>
                      {status === 'error' && (
                        <p className="mt-3 text-sm text-red-600 flex items-center justify-center">
                          <AlertCircle className="mr-1 h-4 w-4"/> {statusMessage}
                        </p>
                      )}
                    </form>
                  </div>
                  <button 
                      onClick={() => paginate(-1)}
                      className="mt-6 text-sm text-white/70 hover:text-white transition-colors"
                     >
                       Назад
                  </button>
                </div>
              )}

              {isThankYouStep && (
                <motion.div 
                  className="text-center max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 sm:p-10 md:p-12 rounded-2xl shadow-xl text-gray-800"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-5" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">Спасибо за ваши ответы!</h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    Ваша заявка принята. Наш специалист скоро свяжется с вами для бесплатной консультации.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Quiz; 
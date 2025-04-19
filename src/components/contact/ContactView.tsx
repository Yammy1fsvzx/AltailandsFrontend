'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Contact, WorkingHours } from '@/types/site'; // Импортируем тип Contact
import BlogHero from '../sections/ChannelHero';
import { submitApplication, ApplicationRequestBody } from '@/lib/api/requests';

// Определяем тип пропсов
interface ContactViewProps {
  contactData: Contact | null;
}

// Вспомогательная функция для форматирования рабочего времени
const formatWorkingHours = (workingHours: WorkingHours[] | undefined): string => {
  if (!workingHours || workingHours.length === 0) {
    return 'Режим работы не указан';
  }
  // Простой пример: находим первый активный день и показываем его время
  // Можно сделать сложнее: группировать дни (Пн-Пт), показывать выходные
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  let formatted = '';
  
  // Группируем по времени работы
  const hoursMap = new Map<string, number[]>();
  workingHours.forEach(wh => {
    if (wh.is_active && wh.start_time && wh.end_time) {
      const key = `${wh.start_time.substring(0, 5)}-${wh.end_time.substring(0, 5)}`;
      if (!hoursMap.has(key)) {
          hoursMap.set(key, []);
      }
      hoursMap.get(key)?.push(wh.day_of_week);
    } else if (!wh.is_active) {
        const key = 'Выходной';
        if (!hoursMap.has(key)) {
             hoursMap.set(key, []);
        }
         hoursMap.get(key)?.push(wh.day_of_week);
    }
  });

  // Форматируем вывод
  const lines: string[] = [];
  hoursMap.forEach((days, time) => {
      if (time === 'Выходной') {
          lines.push(`${days.map(d => weekdays[d]).join(', ')}: Выходной`);
      } else {
          lines.push(`${days.map(d => weekdays[d]).join(', ')}: ${time}`);
      }
  });

  // Сортируем дни (примерно)
  const dayOrder = [0, 1, 2, 3, 4, 5, 6];
  lines.sort((a, b) => {
      const firstDayA = dayOrder.find(d => a.startsWith(weekdays[d]));
      const firstDayB = dayOrder.find(d => b.startsWith(weekdays[d]));
      if (a.includes('Выходной') && !b.includes('Выходной')) return 1;
      if (!a.includes('Выходной') && b.includes('Выходной')) return -1;
      return (firstDayA ?? 7) - (firstDayB ?? 7);
  });

  return lines.join('\n'); // Возвращаем строки с переносами
};

// Define submission status type
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactView: React.FC<ContactViewProps> = ({ contactData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status === 'error' || status === 'success') {
        setStatus('idle');
        setStatusMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');
    console.log('Contact form data:', formData);

    if (!formData.name || !formData.phone || !formData.message) {
        setStatus('error');
        setStatusMessage('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    const requestData: ApplicationRequestBody = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      user_message: formData.message || "",
      request_type: 'contact',
      status: 'new',
    };

    try {
      await submitApplication(requestData);

      setStatus('success');
      setStatusMessage('Ваше сообщение успешно отправлено! Мы скоро свяжемся с вами.');
      setFormData({ name: '', phone: '', email: '', message: '' });

    } catch (error) {
      console.error("Contact form submission error:", error);
      setStatus('error');
      setStatusMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
    } 
  };

  // Анимации для колонок
  const columnVariantsLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.3, duration: 0.6 }
    }
  };
  const columnVariantsRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.4, duration: 0.6 }
    }
  };
  const mapVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5, // Чуть позже колонок
        duration: 0.6
      }
    }
  };

  // Получаем данные для отображения, используя fallback
  const displayContact = contactData || { 
    phone: "Загрузка...", 
    whatsapp: null,
    email: "Загрузка...", 
    office_address: "Загрузка...", 
    working_hours: [] 
  };
  const displayWorkingHours = formatWorkingHours(displayContact.working_hours);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-16 opacity-0 md:pb-24"
    >

      {/* Основной контент */}
      <div className="content-container -mt-16 md:-mt-20 relative z-10">
        {/* Общий контейнер без ограничения max-width */}
        <div className="mx-auto bg-white rounded-2xl md:rounded-[30px] shadow-xl p-6 sm:p-8 md:p-12 lg:p-16">
          
          {/* --- Сетка: Информация (слева) и Форма (справа) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 mb-12 md:mb-16 lg:mb-20">
            
            {/* Колонка 1: Контактная информация - Новый порядок и режим работы */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={columnVariantsLeft}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-5 md:mb-6">Свяжитесь с нами</h2>
              <p className="text-base text-gray-600 mb-8 md:mb-10">Мы всегда рады ответить на ваши вопросы. Вы можете связаться с нами любым удобным способом.</p>
              
              <div className="space-y-6 md:space-y-7">
                {/* Телефон (из displayContact) */}
                {displayContact.phone && (
                  <div className="flex items-start">
                    <Phone size={22} className="text-green-600 mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">Телефон</h3>
                      <a href={`tel:${displayContact.phone.replace(/[^\d+]/g, '')}`} className="text-sm md:text-base text-green-600 hover:text-green-700 block">{displayContact.phone}</a>
                    </div>
                  </div>
                )}
                
                {/* Разделитель */}
                <hr className="border-gray-200 my-3" /> 

                {/* WhatsApp (из displayContact) */}
                {displayContact.whatsapp && (
                  <div className="flex items-center">
                    <FaWhatsapp size={22} className="text-green-600 mr-3 md:mr-4 flex-shrink-0" />
                    <a 
                      href={`https://wa.me/${displayContact.whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm md:text-base text-green-600 hover:text-green-700 inline-flex items-center"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
                
                {/* Email (из displayContact) */}
                {displayContact.email && (
                  <div className="flex items-start">
                    <Mail size={22} className="text-green-600 mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">Email</h3>
                      <a href={`mailto:${displayContact.email}`} className="text-sm md:text-base text-green-600 hover:text-green-700">{displayContact.email}</a>
                    </div>
                  </div>
                )}

                {/* Адрес (из displayContact) */}
                {displayContact.office_address && (
                  <div className="flex items-start">
                    <MapPin size={22} className="text-green-600 mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">Адрес офиса</h3>
                      <p className="text-sm md:text-base text-gray-500">{displayContact.office_address}</p>
                    </div>
                  </div>
                )}

                {/* Режим работы (из displayWorkingHours) */}
                <div className="flex items-start">
                  <Clock size={22} className="text-green-600 mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Режим работы</h3>
                    {/* Используем white-space-pre-line для переносов строк */}
                    <p className="text-sm md:text-base text-gray-500 whitespace-pre-line">{displayWorkingHours}</p>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Колонка 2: Форма обратной связи */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={columnVariantsRight}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-5 md:mb-6">Отправьте нам сообщение</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1.5">Имя *</label>
                  <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-base" placeholder="Ваше имя"/>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-1.5">Номер телефона *</label>
                  <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-base" placeholder="+7 (___) ___-__-__"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-base" placeholder="your@email.com"/>
                </div>
                <div>
                  <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-1.5">Сообщение *</label>
                  <textarea name="message" id="message" rows={5} required value={formData.message} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-base" placeholder="Ваше сообщение..."></textarea>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {status === 'success' ? 'Сообщение отправлено!' : 'Отправить сообщение'}
                  </button>
                </div>
                {status === 'success' && (
                    <p className="mt-3 text-sm text-green-600 flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4"/> {statusMessage}
                    </p>
                )}
                {status === 'error' && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4"/> {statusMessage}
                    </p>
                )}
              </form>
            </motion.div>

          </div>

          {/* Разделитель перед картой для четкого разделения секций */}
          <hr className="border-gray-200" />

          {/* --- Секция 3: Карта --- */}
          {/* Добавляем отступ сверху к карте */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={mapVariants}
            className="mt-12 md:mt-16 lg:mt-20" // Отступ сверху
           >
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6 md:mb-8 text-center">Карта</h2>
             <div className="w-full h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
               {/* Здесь можно будет вставить iframe с картой */}
               
             </div>
           </motion.div>
           
         </div>
       </div>
     </motion.div>
  );
};

export default ContactView; 
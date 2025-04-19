import React from 'react';
import Link from 'next/link'; // Keep Link import if needed elsewhere

// Import PageHero component
import PageHero from '@/components/common/PageHero'; // Uncommented import

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Политика конфиденциальности" />
      
      {/* Content section below the hero */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Remove the standalone h1, title is in PageHero now */}
        {/* <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Политика конфиденциальности</h1> */} 
        
        <div className="prose prose-invert max-w-4xl mx-auto">
          {/* Используйте prose-invert, если у вас темная тема по умолчанию, или просто prose для светлой */}
          
          <p className="text-sm text-gray-400 mb-6">Последнее обновление: Март 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
            <p>
              Настоящая политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах, использующих сервисы сайта <Link href="https://altailands.ru" className="text-emerald-700 hover:text-emerald-500">AltaiLands.ru</Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Собираемая информация</h2>
            <p>
              Мы собираем следующие типы информации:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Имя и контактные данные</li>
              <li>Электронная почта</li>
              <li>Номер телефона</li>
              <li>Информация о предпочтениях при выборе участка</li>
              <li>Техническая информация о вашем устройстве и браузере</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Цели сбора информации</h2>
            <p>
              Мы используем собранную информацию для:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Предоставления вам информации об участках</li>
              <li>Обработки ваших заявок и запросов</li>
              <li>Улучшения качества наших услуг</li>
              <li>Отправки важных уведомлений и обновлений</li>
              <li>Предоставления персонализированных рекомендаций</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">4. Защита информации</h2>
            <p className="text-gray-600">
              Мы принимаем все необходимые меры для защиты ваших персональных данных:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Используем шифрование при передаче данных</li>
              <li>Ограничиваем доступ к персональным данным</li>
              <li>Регулярно обновляем системы безопасности</li>
              <li>Проводим аудит систем защиты данных</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Права пользователей</h2>
            <p>
              Вы имеете право:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Получить информацию о хранящихся данных</li>
              <li>Требовать исправления неточных данных</li>
              <li>Требовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Изменения политики конфиденциальности</h2>
            <p>
              Мы оставляем за собой право вносить изменения в политику конфиденциальности. Все изменения будут опубликованы на этой странице с указанием даты последнего обновления.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Последнее обновление: Март 2025
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Контакты</h2>
            <p>
              По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>По электронной почте: <Link href="mailto:info@altailand.ru" className="text-emerald-700 hover:text-emerald-500">info@altailand.ru</Link></li>
              <li>По телефону: <Link href="tel:+79030730909" className="text-emerald-700 hover:text-emerald-500">+7 (903) 073-09-09</Link></li>
              <li>Через <Link href="/contact"><span className="text-emerald-700">форму обратной связи</span></Link > на сайте</li>
              <li>WhatsApp: <Link href="https://wa.me/79030730909"><span className="text-emerald-700 hover:text-emerald-500">+7 (903) 073-09-09</span></Link></li>
              <li>Telegram: <Link href="https://t.me/altailands"><span className="text-emerald-700 hover:text-emerald-500">AltaiLands</span></Link></li>
            </ul>
          </section>
        </div> { /* Close prose div */}
      </div> { /* Close container div */}
    </>
  );
}

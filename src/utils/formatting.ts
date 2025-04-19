/**
 * Formats a number or string representing a price into a currency string.
 * Example: 5000000 -> "5 000 000 ₽"
 * Handles null or undefined values.
 */
export function formatPrice(price: number | string | null | undefined): string {
    if (price === null || price === undefined || price === '') {
        return 'Цена не указана'; // Or return an empty string or other placeholder
    }

    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numericPrice)) {
        return 'Некорректная цена';
    }

    // Simple formatting with spaces as thousands separators and adding Ruble sign
    const formatted = numericPrice.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0, // No kopecks
        minimumFractionDigits: 0,
    });

    //toLocaleString might add non-breaking spaces, replace if needed
    // return formatted.replace(/\s/g, ' ');
    return formatted;
}

/**
 * Форматирует цену за сотку.
 * @param pricePerAre Цена за сотку (строка, число или null/undefined).
 * @returns Отформатированная строка цены за сотку или null.
 */
export const formatPricePerAre = (pricePerAre: string | number | null | undefined): string | null => {
  if (pricePerAre === null || pricePerAre === undefined) return null;
  const numPrice = typeof pricePerAre === 'string' ? parseFloat(pricePerAre) : pricePerAre;
  if (isNaN(numPrice)) return null;
  // Округляем до целого для краткости
  return `${Math.round(numPrice).toLocaleString('ru-RU')} ₽/сот.`; 
};

/**
 * Форматирует площадь.
 * @param area Площадь (строка, число или null/undefined).
 * @returns Отформатированная строка площади или пустая строка.
 */
export const formatArea = (area: string | number | null | undefined): string => {
  if (area === null || area === undefined) return '';
  // Можно добавить более сложную логику форматирования, если нужно
  return `${area} сот.`;
}; 
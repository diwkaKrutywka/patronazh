/**
 * Форматирует номер телефона в формат +7 (7ХХ)ХХХ-ХХ-ХХ
 * @param value - исходное значение телефона
 * @returns отформатированный номер телефона
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '+7';

  // 1) Удалить ВСЁ кроме цифр
  const digits = value.replace(/\D/g, '');

  // Если нет цифр или только одна цифра "7", всегда возвращаем "+7"
  if (digits.length === 0 || (digits.length === 1 && digits === '7')) {
    return '+7';
  }

  let phoneDigits = digits;

  // 2) Если начинается с 8 → заменить на +7 (заменяем 8 на 7)
  if (phoneDigits.startsWith('8')) {
    phoneDigits = '7' + phoneDigits.slice(1);
  }
  // 3) Если начинается с 7 → добавить + (уже начинается с 7, просто оставляем)
  // Если не начинается с 7 или 8, добавляем 7 в начало
  if (!phoneDigits.startsWith('7') && !phoneDigits.startsWith('8')) {
    phoneDigits = '7' + phoneDigits;
  }

  // 4) Обрезать до 11 цифр (включая первую 7)
  if (phoneDigits.length > 11) {
    phoneDigits = phoneDigits.slice(0, 11);
  }

  // 5) Применить форматирование
  // Теперь phoneDigits всегда начинается с 7 и содержит максимум 11 цифр
  // Всегда сохраняем минимум "+7"
  if (phoneDigits.length <= 1 || phoneDigits === '7') {
    return '+7';
  }

  const code = phoneDigits.slice(1, 4); // Берем 3 цифры после 7
  const remaining = phoneDigits.slice(4); // Остальные цифры после кода

  if (phoneDigits.length <= 4) {
    // Если есть только код оператора (1-3 цифры после 7)
    return `+7 (${code}`;
  }

  if (phoneDigits.length <= 7) {
    // Если есть код и начало номера (до 3 цифр после кода)
    return `+7 (${code})${remaining}`;
  }

  if (phoneDigits.length <= 9) {
    // Если есть код, первая часть и начало второй части
    const first = remaining.slice(0, 3);
    const second = remaining.slice(3);
    return `+7 (${code})${first}-${second}`;
  }

  // Полный формат: +7 (7XX)XXX-XX-XX (11 цифр: 7 + 10 цифр)
  const first = remaining.slice(0, 3);
  const second = remaining.slice(3, 5);
  const third = remaining.slice(5, 7);
  return `+7 (${code})${first}-${second}-${third}`;
};

/**
 * Удаляет форматирование из номера телефона, оставляя только цифры и +
 */
export const unformatPhoneNumber = (value: string): string => {
  if (!value) return value;
  // Сохраняем + если есть, иначе оставляем только цифры
  if (value.startsWith('+')) {
    return value.replace(/[^\d+]/g, '');
  }
  return value.replace(/\D/g, '');
};

/**
 * Валидирует номер телефона в формате +7 (7ХХ)ХХХ-ХХ-ХХ
 * @param value - номер телефона для проверки
 * @returns true если номер валиден, false в противном случае
 */
export const validatePhoneNumber = (value: string): boolean => {
  if (!value) return false;
  
  // Проверяем формат +7 (7ХХ)ХХХ-ХХ-ХХ (пробел после +7 необязателен)
  // Удаляем пробелы для проверки
  const cleaned = value.replace(/\s/g, '');
  
  // Проверяем точный формат: +7(7XX)XXX-XX-XX
  const phoneRegex = /^\+7\(7\d{2}\)\d{3}-\d{2}-\d{2}$/;
  
  return phoneRegex.test(cleaned);
};



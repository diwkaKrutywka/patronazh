/**
 * Форматирует номер телефона в формат +7 (7ХХ)ХХХ-ХХ-ХХ
 * @param value - исходное значение телефона
 * @returns отформатированный номер телефона
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;

  // Удаляем все символы кроме цифр и +
  const cleaned = value.replace(/[^\d+]/g, '');

  // Если начинается с +7, сохраняем это
  let phone = cleaned;
  let hasPlus = phone.startsWith('+7');
  
  if (hasPlus) {
    phone = phone.replace('+7', '');
  }

  // Оставляем только цифры
  const digits = phone.replace(/\D/g, '');

  // Форматируем в зависимости от количества цифр
  if (digits.length === 0) {
    return hasPlus ? '+7' : '';
  }

  // Гарантируем, что код начинается с 7
  let formattedDigits = digits;
  if (hasPlus) {
    // Если уже есть +7, код должен начинаться с 7
    if (formattedDigits.length > 0 && formattedDigits[0] !== '7') {
      formattedDigits = '7' + formattedDigits;
    }
  } else {
    // Если нет +7, добавляем его и начинаем с 7
    formattedDigits = '7' + formattedDigits;
  }

  if (formattedDigits.length <= 1) {
    return `+7 (${formattedDigits}`;
  }

  if (formattedDigits.length <= 3) {
    return `+7 (${formattedDigits}`;
  }

  if (formattedDigits.length <= 6) {
    const code = formattedDigits.slice(0, 3);
    const first = formattedDigits.slice(3);
    return `+7 (${code})${first}`;
  }

  if (formattedDigits.length <= 8) {
    const code = formattedDigits.slice(0, 3);
    const first = formattedDigits.slice(3, 6);
    const second = formattedDigits.slice(6);
    return `+7 (${code})${first}-${second}`;
  }

  if (formattedDigits.length <= 10) {
    const code = formattedDigits.slice(0, 3);
    const first = formattedDigits.slice(3, 6);
    const second = formattedDigits.slice(6, 8);
    const third = formattedDigits.slice(8, 10);
    return `+7 (${code})${first}-${second}-${third}`;
  }

  // Если больше 10 цифр, обрезаем до 10
  const code = formattedDigits.slice(0, 3);
  const first = formattedDigits.slice(3, 6);
  const second = formattedDigits.slice(6, 8);
  const third = formattedDigits.slice(8, 10);
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



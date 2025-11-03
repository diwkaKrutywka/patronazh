/**
 * Форматирует номер телефона в формат (XXX) - XXX-XXXX
 * @param value - исходное значение телефона
 * @returns отформатированный номер телефона
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;

  // Удаляем все символы кроме цифр, + и скобок
  const numbers = value.replace(/[^\d+()-\s]/g, '');

  // Если начинается с +7, сохраняем это
  let phone = numbers;
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

  if (digits.length <= 3) {
    return hasPlus ? `+7 (${digits}` : `(${digits}`;
  }

  if (digits.length <= 6) {
    const area = digits.slice(0, 3);
    const first = digits.slice(3);
    return hasPlus ? `+7 (${area}) - ${first}` : `(${area}) - ${first}`;
  }

  if (digits.length <= 10) {
    const area = digits.slice(0, 3);
    const first = digits.slice(3, 6);
    const second = digits.slice(6, 10);
    return hasPlus 
      ? `+7 (${area}) - ${first} - ${second}` 
      : `(${area}) - ${first} - ${second}`;
  }

  // Если больше 10 цифр, обрезаем до 10
  const area = digits.slice(0, 3);
  const first = digits.slice(3, 6);
  const second = digits.slice(6, 10);
  return hasPlus 
    ? `+7 (${area}) - ${first} - ${second}` 
    : `(${area}) - ${first} - ${second}`;
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


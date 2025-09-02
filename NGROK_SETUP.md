# Настройка ngrok для care-crm

## Проблема
При запуске приложения через ngrok, фронтенд пытается обратиться к API по localhost, что не работает.

## Решение
Приложение теперь использует динамическое определение API URL через runtime конфигурацию в `config.js`.

## Как это работает

### 1. Runtime конфигурация
При запуске контейнера создается файл `config.js` с JavaScript кодом, который:
- Определяет текущий домен (localhost или ngrok)
- Автоматически настраивает правильный API URL
- Работает как для http, так и для https

### 2. Приоритет конфигурации
1. **Runtime config** (config.js) - самый высокий приоритет
2. **Build-time env** (VITE_BASE_API_URL) - fallback
3. **Import.meta.env** - последний fallback
4. **Auto-detection** - финальный fallback

## Шаги настройки

### 1. Запуск приложения
```bash
# Сборка и запуск
docker-compose -f docker-compose.dev.yml up --build

# Или используйте готовый скрипт на Windows
test-ngrok.bat
```

### 2. Настройка ngrok
```bash
# Установка ngrok (если не установлен)
# Скачайте с https://ngrok.com/

# Запуск ngrok
ngrok http 8088
```

### 3. Автоматическая настройка
Приложение автоматически:
- Определяет ngrok домен при загрузке страницы
- Настраивает API URL для работы через ngrok
- Создает runtime конфигурацию в браузере

### 4. Проверка
1. Откройте ngrok URL в браузере
2. Проверьте консоль браузера - должен быть правильный API URL
3. API запросы должны работать через ngrok домен

## Конфигурация

### stack.env
```env
# Оставьте пустым для автоматического определения
VITE_BASE_API_URL=
IMAGE_REGISTRY_URL=care-crm-frontend
```

### Ручная настройка (если нужно)
Если автоматическое определение не работает, можно указать ngrok URL вручную:
```env
VITE_BASE_API_URL=https://your-ngrok-url.ngrok.io/api
```

## Отладка

### Проверка конфигурации
Откройте консоль браузера и проверьте:
```javascript
console.log(window.APP_CONFIG);
console.log(baseUrl.baseURL);
```

### Ожидаемые логи
При работе через ngrok:
```
Runtime config created with BASE_API_URL: https://your-ngrok-url.ngrok.io/api
Current location: https://your-ngrok-url.ngrok.io/
Using runtime config: https://your-ngrok-url.ngrok.io/api
Final baseUrl: https://your-ngrok-url.ngrok.io/api
```

### Логи nginx
```bash
docker-compose -f docker-compose.dev.yml logs front
```

## Примечания
- Приложение работает как с http, так и с https
- Автоматическое определение работает для доменов *.ngrok.io и *.ngrok-free.app
- Runtime конфигурация переопределяет build-time переменные
- Конфигурация определяется при каждой загрузке страницы

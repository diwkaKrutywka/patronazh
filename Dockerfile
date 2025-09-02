# Этап 1: билд фронта
FROM node:20-alpine AS build
WORKDIR /app

# Копируем только package.json, чтобы кэшировался npm install
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Accept build arguments for environment variables
ARG VITE_BASE_API_URL
ARG IMAGE_REGISTRY_URL

# Устанавливаем переменные окружения для сборки
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL
ENV IMAGE_REGISTRY_URL=$IMAGE_REGISTRY_URL

# Сборка проекта
RUN CI=false npm run build

# Этап 2: nginx
FROM nginx:alpine

# Копируем собранный фронт
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]


FROM node:22-slim AS build

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS serve

COPY ./nginx/mime.types /etc/nginx/mime.types
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build ./app/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

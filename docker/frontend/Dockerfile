FROM node:22.8.0 AS build-stage

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:apline

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist/game-network-ui /usr/share/nginx/html

EXPOSE 80

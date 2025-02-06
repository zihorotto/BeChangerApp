FROM node:22.8.0 AS build-stage

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist/game-network-ui/browser /usr/share/nginx/html/

EXPOSE 80

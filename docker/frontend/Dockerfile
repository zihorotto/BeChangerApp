FROM node:22.8.0 AS build-stage

WORKDIR /beChangerApp/frontend

COPY package*json ./

RUN npm install

COPY . .

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /beChangerApp/frontend/dist/game-network-ui/browser /usr/share/nginx/html/

EXPOSE 80

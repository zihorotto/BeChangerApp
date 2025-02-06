FROM node:22.8.0 AS build-stage

WORKDIR /beChangerApp/frontend

COPY package*json ./

RUN npm install

COPY . .

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

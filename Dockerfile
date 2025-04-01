# --- Backend Build Stage ---
    FROM maven:3.9.9-amazoncorretto-21 AS build
    WORKDIR /build
    
    # Másoljuk a pom.xml-t, és letöltjük a függőségeket
    COPY pom.xml .
    RUN mvn dependency:go-offline
    
    # Másoljuk a forráskódot
    COPY src ./src
    
    # Maven build
    RUN mvn clean package -DskipTests
    
    # --- Keycloak Stage ---
    FROM quay.io/keycloak/keycloak:latest AS keycloak
    
    # Konfiguráljuk a Keycloak környezetet
    ENV KEYCLOAK_ADMIN=${KEYCLOAK_ADMIN}
    ENV KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD}
    
    # Indítjuk a Keycloak-ot a fejlesztői módban
    ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
    
    # --- Frontend Build Stage ---
    FROM node:22.8.0 AS frontend-build
    
    WORKDIR /beChangerApp/frontend
    
    # Másoljuk a package.json-t, majd telepítjük a függőségeket
    COPY package*.json ./
    RUN npm install
    
    # Másoljuk a frontend forráskódot
    COPY . .
    
    # --- Frontend NGINX Stage ---
    FROM nginx:alpine AS frontend
    
    # Nginx konfiguráció másolása
    COPY nginx.conf /etc/nginx/nginx.conf
    
    # Kiszolgáljuk a frontend statikus fájljait
    COPY --from=frontend-build /beChangerApp/frontend/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    # --- Runtime Stage: Backend + Frontend + Keycloak ---
    FROM amazoncorretto:21 AS runtime
    
    WORKDIR /app
    
    # Backend JAR fájl másolása
    COPY --from=build /build/target/be-changer-*.jar /app/
    
    # Keycloak fájl másolása (ha szükséges)
    COPY --from=keycloak /opt/keycloak /opt/keycloak
    
    # Exponáljuk a backend portot
    EXPOSE 8088
    
    # Keycloak, Frontend és Backend környezeti változók
    ENV ACTIVE_PROFILE=dev
    ENV JAR_VERSION=1.1.0
    ENV SPRING_MAIL_HOST=${SPRING_MAIL_HOST}
    ENV SPRING_MAIL_USERNAME=missing_user_name
    ENV SPRING_MAIL_PASSWORD=missing_password
    
    # Backend indítása
    CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} be-changer-${JAR_VERSION}.jar & \
        /opt/keycloak/bin/kc.sh start-dev & \
        nginx -g 'daemon off;'  # Nginx futtatása a frontend számára
    
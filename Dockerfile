# --- Backend Build Stage ---
    FROM maven:3.9.9-amazoncorretto-21 AS build
    WORKDIR /build
    
    # Másoljuk a pom.xml-t, és letöltjük a függőségeket
    COPY backend/pom.xml .
    RUN mvn dependency:go-offline
    
    # Másoljuk a forráskódot
    COPY backend/src ./src
    
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
    
    WORKDIR /frontend
    
    # Másoljuk a package.json-t, majd telepítjük a függőségeket
    COPY /frontend/package*.json /frontend/
    RUN npm install
    
    # Másoljuk a frontend forráskódot
    COPY . .
    
    # Az Nginx telepítése
    RUN apt-get update && apt-get install -y nginx
    
    # --- Runtime Stage: Backend + Frontend + Keycloak + Nginx ---
    FROM amazoncorretto:21 AS runtime
    
    WORKDIR /app
    
    # Backend JAR fájl másolása
    COPY --from=build /build/target/be-changer-*.jar /app/
    
    # Másoljuk a Keycloak fájlokat
    COPY --from=keycloak /opt/keycloak /opt/keycloak
    
    # Másoljuk a frontend statikus fájlokat a megfelelő Nginx könyvtárba
    COPY --from=frontend-build /frontend/dist/game-network-ui/browser /usr/share/nginx/html

    # Másoljuk az Nginx konfigurációs fájlt
    COPY /frontend/nginx.conf /etc/nginx/nginx.conf

    # Exponáljuk a backend és Nginx portokat
    EXPOSE 8088
    EXPOSE 80
    
    # Backend, Keycloak és Nginx indítása
    CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} be-changer-${JAR_VERSION}.jar & \
        /opt/keycloak/bin/kc.sh start-dev & \
        nginx -g 'daemon off;'
    
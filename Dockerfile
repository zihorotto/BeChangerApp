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
    
    # Másoljuk a package.json fájlokat
    COPY frontend/package*.json ./
    
    # Telepítjük a függőségeket
    RUN npm install
    
    # Másoljuk a frontend forráskódot
    COPY frontend/ ./
    
    # Az Angular alkalmazás buildelése
    RUN npm run build --prod
    
    # --- Runtime Stage: Ubuntu alapú ---
    FROM ubuntu:20.04 AS runtime
    
    WORKDIR /app
    
    # A szükséges csomagok telepítése
    RUN apt-get update && apt-get install -y nginx openjdk-21-jdk
    
    # Másoljuk a backend JAR fájlt
    COPY --from=build /build/target/be-changer-*.jar /app/
    
    # Másoljuk a Keycloak fájlokat
    COPY --from=keycloak /opt/keycloak /opt/keycloak
    
    # Másoljuk a frontend statikus fájlokat az Nginx könyvtárba
    COPY --from=frontend-build /frontend/dist/game-network-ui/browser /usr/share/nginx/html
    
    # Másoljuk az Nginx konfigurációs fájlt
    COPY /frontend/nginx.conf /etc/nginx/nginx.conf
    
    # Exponáljuk a backend és Nginx portokat
    EXPOSE 8088
    EXPOSE 80
    
    # Backend, Keycloak és Nginx indítása
    CMD java -jar -Dspring.profiles.active=dev be-changer-1.1.0.jar & \
        /opt/keycloak/bin/kc.sh start-dev & \
        nginx -g 'daemon off;'
    
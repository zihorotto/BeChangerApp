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
    
    # --- Runtime Stage: Backend + Keycloak ---
    FROM amazoncorretto:21 AS runtime
    
    WORKDIR /app
    
    # Telepítjük a szükséges eszközöket (ha szükséges)
    # RUN yum update -y && \
    #     yum install -y gcc pcre-devel zlib-devel make tar gzip
    
    # Backend JAR fájl másolása
    COPY --from=build /build/target/be-changer-*.jar /app/
    
    # Keycloak fájl másolása (ha szükséges)
    COPY --from=keycloak /opt/keycloak /opt/keycloak
    
    # Exponáljuk a backend portot
    EXPOSE 8088
    
    # Backend és Keycloak indítása
    CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} be-changer-${JAR_VERSION}.jar & \
        /opt/keycloak/bin/kc.sh start-dev
    
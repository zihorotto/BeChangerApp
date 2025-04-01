# Build stage
FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#Runtime stagemvn -v
FROM amazoncorretto:21
ARG PROFILE=dev
ARG APP_VERSION=1.1.0

WORKDIR /app
COPY --from=build /build/target/be-changer-*.jar /app/

EXPOSE 8088

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} be-changer-${JAR_VERSION}.jar
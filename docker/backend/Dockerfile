# Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#Runtime stagemvn -v
FROM amazoncorretto:22
ARG PROFILE=dev
ARG APP_VERSION=1.1.0

WORKDIR /app
COPY --from=build /build/target/be-changer-*.jar /app/

EXPOSE 8088

ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}
ENV SPRING_MAIL_HOST=${SPRING_MAIL_HOST}
ENV SPRING_MAIL_USERNAME=missing_user_name
ENV SPRING_MAIL_PASSWORD=missing_password

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} be-changer-${JAR_VERSION}.jar
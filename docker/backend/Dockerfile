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
ARG APP_VERSION=1.0.0

WORKDIR /app
COPY --from=build /build/target/be-changer-*.jar /app/

EXPOSE 8088

ENV DB_URL=jdbc:postgresql://postgres-sql-bc:5432/be_changer_db
ENV MAILDEV_URL=localhost

ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}


CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} be-changer-${JAR_VERSION}.jar
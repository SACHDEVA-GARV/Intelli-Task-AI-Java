# FILE: Dockerfile
FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /app

COPY pom.xml .
COPY src src

RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/taskpilot-1.0.0.jar app.jar

EXPOSE 3001

ENV DB_USERNAME=root
ENV DB_PASSWORD=password
ENV JWT_SECRET=your_jwt_secret_here
ENV GEMINI_API_KEY=your_gemini_api_key_here

ENTRYPOINT ["java", "-jar", "app.jar"]
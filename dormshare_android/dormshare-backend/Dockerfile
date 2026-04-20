FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY dormshare-backend/pom.xml .
COPY dormshare-backend/src ./src
# Limit Maven memory to fit in Render's Free tier (512MB)
RUN MAVEN_OPTS="-Xmx300m" mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]

# Cambiamos de la 21 a la 25 para que coincida con tu compilación
FROM eclipse-temurin:25-jre-alpine
VOLUME /tmp
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
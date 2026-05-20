# Ligerito

Aplicación web para gestionar el equipaje de actividades de montaña y larga distancia. Permite crear un inventario personal de artículos, organizarlos en mochilas por actividad, controlar el peso total y compartir configuraciones con la comunidad.

## Video presentación en Youtube

**https://youtu.be/P4MLuAbxMQ8**

## Demo en producción

**https://ligerito-app-7d4f809a6da7.herokuapp.com**

## Stack tecnológico

**Backend**
- Java 21 · Spring Boot 4 · Spring Data JPA / Hibernate · Spring Security
- MySQL 9.0

**Frontend**
- React 19 · Vite · Tailwind CSS

## Arranque en local

### Requisitos
- Docker Desktop
- Java JDK 21+
- Maven 3.9+ (o usar el wrapper `mvnw` incluido)
- Node.js 18+ (solo para desarrollo del frontend)

### Opción A — Aplicación completa con Docker (recomendado)

Construye el JAR (incluye el frontend automáticamente) y levanta todo con Docker:

```bash
./mvnw package -DskipTests
docker compose up
```

La aplicación estará disponible en **http://localhost:8080**

### Opción B — Modo desarrollo (backend y frontend por separado)

Útil si se quiere hot-reload en el frontend:

**1. Arrancar la base de datos**
```bash
docker compose up db
```

**2. Arrancar el backend**
```bash
./mvnw spring-boot:run
```

**3. Arrancar el frontend** (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```

| Servicio | URL |
|---|---|
| Aplicación | http://localhost:5173 |
| API REST | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

## Colección Postman

El archivo `ligerito-api.postman_collection.json` en la raíz del proyecto contiene todos los endpoints de la API listos para importar en Postman (File → Import).

## Estructura del proyecto

```
ligerito/
├── src/main/java/com/proyecto/ligerito/
│   ├── controller/     # Endpoints REST
│   ├── service/        # Lógica de negocio
│   ├── repository/     # Acceso a datos (Spring Data JPA)
│   ├── model/          # Entidades JPA
│   ├── dto/            # Objetos de transferencia de datos
│   ├── exception/      # Excepciones personalizadas
│   └── config/         # Seguridad (Spring Security)
├── src/test/           # Tests unitarios (JUnit 5 + Mockito)
├── frontend/           # Aplicación React
├── ligerito-api.postman_collection.json
├── compose.yaml        # Docker Compose (backend + MySQL)
└── Dockerfile
```

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Armario virtual: inventario personal de artículos reutilizables
- Creación y gestión de mochilas por actividad
- Categorización de artículos dentro de cada mochila
- Cálculo automático del peso total y desglose por categorías
- Mochilas públicas: exploración del equipaje de otros usuarios

## Tests

54 tests unitarios sobre la capa de servicios.

```bash
./mvnw test
```

## Despliegue en Heroku

### Requisitos previos
- Cuenta en Heroku y CLI instalado (`heroku login`)
- Add-on de base de datos MySQL compatible (por ejemplo JawsDB)

### Variables de entorno

Configura estas variables en el panel de Heroku (Settings → Config Vars):

| Variable | Descripción |
|---|---|
| `SPRING_DATASOURCE_URL` | URL JDBC de la base de datos |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la base de datos |

### Despliegue

```bash
heroku create nombre-de-tu-app
git push heroku main
```

El `Procfile` incluido arranca la aplicación con el perfil `prod` y el puerto asignado por Heroku automáticamente.

## Autor

Diego Fernández López

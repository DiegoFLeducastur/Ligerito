# Ligerito

Aplicación web para gestionar el equipaje de actividades de montaña y larga distancia. Permite crear un inventario personal de artículos, organizarlos en mochilas por actividad, controlar el peso total y compartir configuraciones con la comunidad.

## Stack tecnológico

**Backend**
- Java 21 · Spring Boot 4 · Spring Data JPA / Hibernate · Spring Security
- MySQL 8+

**Frontend**
- React 19 · Vite · Tailwind CSS

## Arranque rápido

### Requisitos
- Java JDK 21+
- Maven 3.9+
- MySQL 8+ en ejecución local
- Node.js 18+ (solo para el frontend)

### 1. Configurar MySQL

Crear el usuario y la base de datos (la BD se crea automáticamente al arrancar si el usuario tiene permisos):

```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON backpack_db.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Arrancar el backend

```bash
./mvnw spring-boot:run
```

| Servicio | URL |
|---|---|
| API REST | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

Hibernate crea las tablas automáticamente al arrancar (`ddl-auto=update`).

### 3. Arrancar el frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en: http://localhost:5173

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

## Autor

Diego Fernández López

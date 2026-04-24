# AGENTS.md — Proyecto Ligerito

## Objetivo del proyecto

Ligerito es una aplicación para organizar equipaje y controlar el peso de mochilas o listas de viaje.

Objetivo principal del producto:
- permitir que un usuario registre su equipo
- cree mochilas o listas para rutas o viajes
- reutilice objetos entre distintas mochilas
- controle peso total y por categorías
- mantenga un armario general reutilizable
- pueda explorar mochilas públicas

Este proyecto está siendo desarrollado como proyecto individual de estudiante.

---

## Funcionalidades principales

- Registro de usuario
- Inicio de sesión
- Gestión de armario general
- Gestión de mochilas
- Gestión de categorías dentro de cada mochila
- Añadir items a una mochila
- Reutilización de items del armario en distintas mochilas
- Visualización de peso total y por categoría
- Explorar mochilas públicas
- Integración progresiva del frontend con backend real

---

## Tecnologías del proyecto

- Frontend: React + Tailwind + Vite
- Backend: Java + Spring Boot
- Base de datos: MySQL
- Testing de API: Postman
- Entorno de desarrollo:
  - frontend y backend lanzados desde VS Code
  - MySQL normalmente ejecutado en Docker

---

## Entidades importantes y relaciones

### Usuario
- Entidad raíz del sistema
- Tiene muchas `Mochila`
- Tiene muchos `ItemArmario`

### Mochila
- Pertenece a un `Usuario`
- Tiene muchas `Categoria`
- Tiene muchos `ItemMochila`

Campos importantes:
- `nombre`
- `esPublica`

### Categoria
- Pertenece a una `Mochila`

### ItemArmario
- Pertenece a un `Usuario`
- Representa el objeto base global reutilizable del usuario

Campos importantes:
- `id`
- `nombre`
- `peso`
- `descripcion`
- `enlace`

### ItemMochila
- Pertenece a una `Mochila`
- Pertenece a una `Categoria`
- Referencia un `ItemArmario`
- Representa la aparición concreta del item dentro de una mochila

Campos importantes:
- `cantidad`
- referencia a mochila
- referencia a categoría
- referencia a item base

---

## Reglas de negocio importantes

- `Usuario` es la entidad raíz del sistema.
- Una `Mochila` siempre pertenece a un usuario.
- Una `Categoria` siempre pertenece a una mochila.
- `ItemArmario` representa el objeto base global del usuario.
- `ItemMochila` representa la aparición concreta de ese objeto dentro de una mochila.
- `ItemMochila` no guarda `descripcion`; la descripción pertenece al `ItemArmario`.
- `peso`, `descripcion` y `enlace` son datos globales del `ItemArmario`.
- Si esos datos se editan, el cambio se refleja en todas las mochilas donde aparezca ese item.
- Dos mochilas distintas pueden tener categorías con el mismo nombre sin problema.
- `email` debe ser único.
- `nick` debe ser único.

### Regla funcional confirmada del dominio
El flujo funcional decidido para el producto es:

1. el item se crea desde una mochila
2. una vez creado, pasa al armario general
3. después puede reutilizarse en otras mochilas

Esto significa:
- el armario se construye con el uso
- el armario no es la pantalla principal de creación del objeto base
- el objeto nace desde una mochila y luego pasa a ser reutilizable

---

## Estado actual del backend

### Ya implementado y probado en Postman

#### `POST /auth/register`
- recibe: `nick`, `email`, `password`
- devuelve: `id`, `nick`, `email`
- no devuelve contraseña
- valida email duplicado
- valida nick duplicado
- devuelve `409 Conflict` si email o nick ya existen

#### `POST /auth/login`
- recibe: `email`, `password`
- devuelve: `id`, `nick`, `email`
- devuelve `401 Unauthorized` si credenciales incorrectas

#### `GET /api/armario`
- devuelve lista de `ItemArmarioResponse`
- actualmente se usa para validar integración frontend-backend
- todavía no está filtrado por usuario autenticado real

### Backend también tiene
- entidades JPA principales definidas
- repositories creados
- servicios y controladores básicos para auth y armario
- seed mínimo funcional para desarrollo

---

## Estado actual del frontend

### Ya implementado
- `App.jsx`
- pantalla de `Login`
- pantalla de `Registro`
- componentes ya existentes de la app:
  - `Sidebar`
  - `Header`
  - `ResumenPesos`
  - `ListaCategorias`
  - páginas de explorar/comunidad
- lógica local heredada con `useMochilas`

### Integración real ya conseguida
Actualmente:
- el registro en frontend llama al backend real
- el login en frontend llama al backend real
- `App.jsx` guarda `usuarioActual`
- tras login correcto, `App.jsx` llama a `GET /api/armario`
- la respuesta se guarda en `armarioBackend`
- ya se ha renderizado provisionalmente el armario real en la UI

### Estado actual de `App.jsx`
`App.jsx` ya contiene:
- `pantallaActual`
- `usuarioActual`
- `armarioBackend`
- `loadingArmario`
- `errorArmario`
- función `cargarArmario()`

---

## Qué está hecho ya

### Backend
- entidades y relaciones principales definidas
- repositories creados
- seed funcional mínimo
- register funcionando
- login funcionando
- `GET /api/armario` funcionando
- validación de email duplicado
- validación de nick duplicado
- CORS resuelto al menos para auth y armario

### Frontend
- pantalla de login funcional
- pantalla de registro funcional
- login conectado al backend
- registro conectado al backend
- carga real del armario tras login
- renderizado provisional de items reales del backend en pantalla

### Integración ya validada
Ya se ha conseguido este flujo real:
1. usuario se registra desde frontend
2. vuelve a login
3. hace login real contra backend
4. `App.jsx` guarda `usuarioActual`
5. se llama a `GET /api/armario`
6. React recibe el array real
7. los items del backend se muestran en pantalla de forma provisional

---

## Qué falta por hacer

### Armario
- migrar progresivamente del armario local (`inventarioGeneral`) al armario real (`armarioBackend`)
- localizar dependencias entre `inventarioGeneral`, `Sidebar` y `useMochilas`
- decidir el primer punto seguro para reemplazar lectura local por lectura backend

### CRUD real del armario
Según estado actual del repo, pueden faltar:
- `POST /api/armario`
- `PATCH /api/armario/{id}`
- `DELETE /api/armario/{id}`

Sin esos endpoints, la migración completa del armario al backend no debe hacerse de golpe.

### Persistencia relacional del dominio
- mochilas
- categorías
- items de mochila
- resúmenes de peso

### Frontend
- sustituir progresivamente lógica local por llamadas reales al backend
- decidir cuándo eliminar o reducir dependencia de `useMochilas`
- conectar la UI principal con datos reales del dominio

### Más adelante
- explorar mochilas públicas de forma completa
- compartir listas o funcionalidades públicas si se recuperan
- posiblemente persistencia de sesión más cómoda si hace falta

---

## Decisiones técnicas importantes

- Proyecto individual de estudiante
- Prioridad: entender lo que se hace, no solo hacerlo funcionar
- Estrategia de trabajo confirmada:
  1. implementar endpoint en backend
  2. probarlo en Postman
  3. conectarlo al frontend
- Se prefieren cambios:
  - pequeños
  - seguros
  - fáciles de revisar
  - fáciles de probar
- No hacer refactorizaciones grandes de golpe
- No eliminar todavía `useMochilas` ni `inventarioGeneral` hasta completar la migración
- Mantener coexistencia temporal entre lógica local y backend real cuando sea necesario
- Explicar siempre el porqué de los cambios

---

## Endpoints actuales y flujo de usuario

### Endpoints ya disponibles
- `POST /auth/register`
- `POST /auth/login`
- `GET /api/armario`

### Flujo de usuario actual
1. El usuario entra en login
2. Puede ir a registro
3. Se registra contra backend real
4. Vuelve a login
5. Hace login contra backend real
6. `App.jsx` guarda `usuarioActual`
7. `App.jsx` lanza `GET /api/armario`
8. El frontend recibe y muestra provisionalmente los items del armario

### Flujo funcional final esperado del producto
1. Usuario se registra o inicia sesión
2. Crea mochila
3. Crea categorías dentro de la mochila
4. Crea items desde la mochila
5. Esos items pasan al armario general
6. Luego puede reutilizarlos en otras mochilas
7. Visualiza peso total y por categorías
8. Puede explorar mochilas públicas

---

## Convivencia temporal actual

Ahora mismo conviven:
- lógica local heredada (`inventarioGeneral`, `useMochilas`)
- lógica real de backend (`armarioBackend`)

Esto es intencional y forma parte de una migración progresiva.

La migración correcta debe hacerse así:
1. primero mover lectura
2. luego mover escritura
3. después retirar lógica local antigua

No sustituir todo de golpe.

---

## Errores conocidos o dudas actuales

- Actualmente `GET /api/armario` se usa como integración técnica, pero el flujo funcional real del producto indica que el armario se alimenta desde mochilas.
- Sigue existiendo convivencia entre armario local e inventario real del backend.
- Hay que decidir el primer punto seguro para sustituir `inventarioGeneral` por `armarioBackend`.
- Todavía no debe hacerse una refactorización completa del frontend sin revisar dependencias.
- Cualquier cambio en armario debe respetar la migración progresiva.
- El armario real de un usuario nuevo debería estar vacío según la lógica de negocio final.
- Aún no debe asumirse que toda la UI del armario pueda pasar directamente a backend mientras falten endpoints de escritura.

---

## Reglas para cualquier agente/Codex que trabaje en este proyecto

### Antes de modificar
Siempre:
1. inspeccionar archivos relevantes
2. explicar el plan exacto
3. identificar el cambio mínimo seguro
4. confirmar qué archivos se van a tocar

### Al modificar
- tocar el menor número posible de archivos
- no introducir complejidad innecesaria
- respetar nombres, estilo y estructura del proyecto
- no eliminar funcionalidades ya validadas
- no romper login/registro
- no hacer una refactorización global sin justificarla

### Al terminar
Siempre resumir:
- archivos modificados
- qué se cambió
- cómo probarlo
- qué queda pendiente

---

## Reglas específicas cuando solo se pida revisión

Si la tarea es revisión y no implementación:
- no editar archivos
- no aplicar cambios automáticamente
- analizar primero `App.jsx`, `Sidebar.jsx`, `useMochilas` y cualquier componente afectado
- explicar dependencias entre `inventarioGeneral`, `armarioBackend` y la UI
- proponer el primer cambio pequeño y seguro
- centrarse en migración progresiva, no en reescritura completa

---

## Restricciones actuales importantes

- El proyecto sigue en fase de aprendizaje.
- La prioridad es entender lo que se hace, no solo “hacerlo funcionar”.
- Evitar soluciones demasiado avanzadas si existe una solución más simple y clara.
- No introducir JWT, contextos complejos o refactors grandes salvo necesidad clara.
- No asumir funcionalidades no implementadas.
- No eliminar el seed ni la lógica de desarrollo útil sin avisar.
- No convertir todavía todo el frontend a backend-driven si solo existe una parte mínima del CRUD real.

---

## Estado resumido del proyecto a día de hoy

Hechos:
- entidades y relaciones principales definidas
- repositories creados
- seed mínimo funcional
- register funcionando en backend y frontend
- login funcionando en backend y frontend
- CORS resuelto para auth y armario
- `GET /api/armario` funcionando en backend y frontend
- armario real ya cargado y renderizado provisionalmente en la UI

Pendiente inmediato:
- avanzar en la migración del armario local al armario backend
- decidir el primer punto de sustitución real de `inventarioGeneral`
- mantener cambios pequeños y revisables
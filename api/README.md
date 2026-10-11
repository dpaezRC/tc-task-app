# Tasks API

API REST de gestión de tareas con autenticación, construida con **NestJS 11**, **Prisma 6** y **PostgreSQL**.

Cada usuario solo puede ver, actualizar y eliminar **sus propias tareas**.

## Requisitos

- **Node 24** (gestionado con nvm — ver `.nvmrc`)
- **pnpm** 10+
- **Docker** (para PostgreSQL)

```bash
nvm install   # lee .nvmrc e instala Node 24
nvm use
```

## Puesta en marcha

```bash
# 1. Dependencias
pnpm install

# 2. Base de datos
docker compose up -d

# 3. Variables de entorno
cp .env.example .env

# 4. Prisma
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed

# 5. Desarrollo
pnpm start:dev
```

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs`

## Endpoints

### Auth

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | público | Registro de usuario |
| POST | `/api/v1/auth/login` | público | Inicio de sesión (`access_token`, `user`) |
| POST | `/api/v1/auth/logout` | JWT | Cierre de sesión (stateless) |
| PATCH | `/api/v1/auth/change-password` | JWT | Cambio de contraseña |

### Tasks

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/api/v1/tasks` | JWT | Crear tarea |
| GET | `/api/v1/tasks` | JWT | Listar tareas propias (paginado, filtro `status`) |
| GET | `/api/v1/tasks/:id` | JWT | Obtener una tarea propia |
| PUT | `/api/v1/tasks/:id` | JWT | Actualizar una tarea propia |
| DELETE | `/api/v1/tasks/:id` | JWT | Eliminar (soft delete) una tarea propia |

## Modelo de datos

- **User**: `firstName`, `lastName`, `email` (único), `password`, `isActive`, `deleted`.
- **Task**: `title`, `description`, `status` (`PENDING | IN_PROGRESS | DONE`), `dueDate`, `userId`, `deleted`.

## Usuario de prueba (seed)

- email: `user@tasks.com`
- password: `123456`

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm start:dev` | Servidor en modo watch |
| `pnpm build` / `pnpm start:prod` | Build y producción |
| `pnpm lint` / `pnpm format` | Lint y formato |
| `pnpm test` / `pnpm test:e2e` | Tests |
| `pnpm prisma:generate` | Genera el cliente Prisma |
| `pnpm prisma:migrate` | Crea/aplica migraciones |
| `pnpm prisma:seed` | Ejecuta los seeds |
| `pnpm prisma:studio` | Prisma Studio |

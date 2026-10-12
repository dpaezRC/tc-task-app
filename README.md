# Task App

App de gestión de tareas con autenticación por usuario. Monorepo **pnpm + Turborepo** con dos aplicaciones:

| App | Carpeta | Stack |
| --- | --- | --- |
| **Web** | `web/` | Angular 21, Tailwind CSS 4, Vitest |
| **API** | `api/` | NestJS 11, Prisma 6, PostgreSQL |

La carpeta `api/` tiene su propio README (`.env.example`, endpoints y scripts) en caso de querer trabajar solo sobre el backend.

## Requisitos

- **Node 24** (ver `.nvmrc` de `api/`)
- **pnpm** 10+
- **Docker** (para PostgreSQL)

```bash
nvm install   # lee .nvmrc e instala Node 24
nvm use
```

## Puesta en marcha

```bash
# 1. Dependencias (instala a la vez api/ y web/)
pnpm install

# 2. Base de datos (PostgreSQL 17)
cd api
docker compose up -d

# 3. Variables de entorno
cp .env.example .env

# 4. Prisma (cliente, migración y seed)
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed
cd ..
```

### Levantar todo (API + Web)

```bash
pnpm dev
```

### Levantar individualmente

```bash
# API — watch mode
cd api && pnpm start:dev

# Web
cd web && pnpm dev
```

## Servicios

| Servicio | URL |
| --- | --- |
| API (base) | `http://localhost:3000/api/v1` |
| Swagger | `http://localhost:3000/docs` |
| Web | `http://localhost:4200` |

## API (backend)

### Stack

NestJS 11 + Prisma 6 + PostgreSQL 17, con **autenticación JWT stateless**. Cada usuario solo puede ver, actualizar y eliminar **sus propias tareas**.

### Características

- **Auth JWT**: registro, login, logout y cambio de contraseña. Contraseñas hasheadas con **bcrypt**.
- **Rate limiting global** de 400 requests/min del mismo IP (`@nestjs/throttler`).
- **Validación** de DTOs con `ValidationPipe` (whitelist, `forbidNonWhitelisted`, transform).
- **Swagger** en `/docs` con autorización Bearer persistente.
- **Logs HTTP** con `morgan`.
- **CORS** habilitado (`*`).
- **Paginación** vía interceptor: `GET /tasks` devuelve `data`, `currentPage`, `recordsPerPage`, `totalRecords`, `totalPages`, `hasNextPage`. Admite `?page=`, `?limit=` y `?showAll=true` (devuelve `{ data, totalRecords }`).
- **Soft delete**: las tareas eliminadas quedan marcadas `deleted = true`, no se borran físicamente.

### Endpoints

Base URL: `/api/v1`

#### Auth

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/auth/register` | público | Registro de usuario |
| POST | `/auth/login` | público | Inicio de sesión (`access_token`, `user`) |
| POST | `/auth/logout` | JWT | Cierre de sesión (stateless) |
| PATCH | `/auth/change-password` | JWT | Cambio de contraseña |

#### Tasks

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/tasks` | JWT | Crear tarea |
| GET | `/tasks` | JWT | Listar tareas propias (paginado, filtro `status`) |
| GET | `/tasks/:id` | JWT | Obtener una tarea propia |
| PUT | `/tasks/:id` | JWT | Actualizar una tarea propia |
| DELETE | `/tasks/:id` | JWT | Eliminar (soft delete) una tarea propia |

### Modelo de datos

- **User**: `firstName`, `lastName`, `email` (único), `password`, `isActive`, `deleted`, timestamps.
- **Task**: `title`, `description?`, `status` (`PENDING | IN_PROGRESS | DONE`), `dueDate?`, `userId`, `deleted`, timestamps.

### Variables de entorno (`api/.env`)

| Variable | Default | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto de la API |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/tasks-app?schema=public` | Conexión a PostgreSQL |
| `JWT_SECRET` | `your-secret-key` | Secreto para firmar tokens |
| `JWT_EXPIRATION` | `7d` | Expiración del token |

### Usuario de prueba (seed)

- email: `user@tasks.com`
- password: `123456`

### Scripts (`api/`)

| Comando | Descripción |
| --- | --- |
| `pnpm start:dev` | Servidor en modo watch |
| `pnpm build` / `pnpm start:prod` | Build y producción |
| `pnpm lint` / `pnpm format` | Lint y formato |
| `pnpm test` / `pnpm test:e2e` | Tests |
| `pnpm prisma:generate` | Genera el cliente Prisma |
| `pnpm prisma:migrate` | Crea/aplica migraciones |
| `pnpm prisma:reset` | Resetea la base de datos |
| `pnpm prisma:seed` | Ejecuta los seeds |
| `pnpm prisma:studio` | Prisma Studio |
| `docker compose up -d` | Levanta PostgreSQL 17 |

## Web (frontend)

Stack: **Angular 21** (standalone), **Tailwind CSS 4**, testing con **Vitest** e **jsdom**.

```bash
cd web
pnpm dev        # dev server en http://localhost:4200
pnpm build      # build de producción en dist/
```

## Scripts (raíz)

`pnpm lint`, `pnpm test` y `pnpm build` ejecutan la tarea correspondiente en **ambas** apps vía Turborepo desde la raíz:

```bash
pnpm lint
pnpm test
pnpm build
```
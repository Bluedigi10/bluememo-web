# BlueMemo API

BlueMemo is a REST API for personal task management. It provides user registration and login, JWT-based authentication, profile management, and an authenticated CRUD for to-do items. Every to-do operation is scoped to the authenticated user.

## Features

- User registration and login
- Password hashing with BCrypt
- Stateless authentication with JSON Web Tokens (JWT)
- Authenticated profile lookup, update, and deletion
- Create, read, update, filter, sort, and delete to-do items
- Ownership validation so users can access only their own items
- Pagination and status filtering
- Centralized validation and error responses
- OpenAPI documentation with Swagger UI
- Health and metrics endpoints with Spring Boot Actuator
- Unit tests and JaCoCo coverage reports
- Dockerized API and PostgreSQL database

## Tech stack

- Java 17
- Spring Boot 4.1.0
- Spring Web MVC
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL 17
- JJWT 0.13.0
- Springdoc OpenAPI
- Maven Wrapper
- JUnit, Mockito, and JaCoCo
- Docker and Docker Compose

## Project structure

```text
bluememo-web/
├── README.md
└── bluememo/
    ├── src/main/java/com/bluedigi/bluememo/
    │   ├── config/                 # Security, JWT filter, and OpenAPI configuration
    │   ├── identity/
    │   │   ├── application/        # Authentication and user use cases
    │   │   ├── domain/             # User model and repository contract
    │   │   └── infrastructure/     # REST and persistence adapters
    │   ├── todo/
    │   │   ├── application/        # To-do use cases
    │   │   ├── domain/             # To-do model, enums, and repository contract
    │   │   └── infrastructure/     # REST and persistence adapters
    │   └── shared/                 # JWT service and exception handling
    ├── src/test/                   # Unit and context tests
    ├── compose.yaml
    ├── Dockerfile
    └── pom.xml
```

## Requirements

For the recommended Docker setup:

- Docker Desktop or Docker Engine with Docker Compose

For local development without Docker:

- JDK 17
- A running PostgreSQL instance

The project includes Maven Wrapper, so a separate Maven installation is not required.

## Environment variables

Create `bluememo/.env` with the following values:

```dotenv
POSTGRES_DB=bluememo
POSTGRES_USER=bluememo_user
POSTGRES_PASSWORD=replace_with_a_strong_password
JWT_SECRET=replace_with_a_base64_encoded_secret
```

`JWT_SECRET` must be a Base64-encoded key with at least 32 random bytes. It can be generated with:

```bash
openssl rand -base64 32
```

Do not commit the real `.env` file or use these example credentials in production.

## Run with Docker Compose

From the project root:

```bash
cd bluememo
docker compose up --build -d
```

The services will be available at:

- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8000/v3/api-docs`
- Health check: `http://localhost:8000/actuator/health`

Useful commands:

```bash
# Follow API logs
docker compose logs -f api

# Stop the services and preserve database data
docker compose down

# Stop the services and delete database data
docker compose down -v
```

## Run locally

Start PostgreSQL first and export the required environment variables. Because `application.properties` uses the Docker hostname by default, override the datasource URL with `localhost` when the API runs directly on the host.

### Linux or macOS

```bash
cd bluememo
export POSTGRES_DB=bluememo
export POSTGRES_USER=bluememo_user
export POSTGRES_PASSWORD=replace_with_a_strong_password
export JWT_SECRET=replace_with_a_base64_encoded_secret
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bluememo
./mvnw spring-boot:run
```

### Windows PowerShell

```powershell
cd bluememo
$env:POSTGRES_DB = "bluememo"
$env:POSTGRES_USER = "bluememo_user"
$env:POSTGRES_PASSWORD = "replace_with_a_strong_password"
$env:JWT_SECRET = "replace_with_a_base64_encoded_secret"
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/bluememo"
.\mvnw.cmd spring-boot:run
```

When run locally, the API uses port `8080` unless it is overridden.

## Authentication

Registration and login return a JWT:

```json
{
  "token": "<JWT>"
}
```

Send it to protected endpoints using the `Authorization` header:

```http
Authorization: Bearer <JWT>
```

Tokens expire after 15 minutes. `/auth/**`, Swagger/OpenAPI, and `/actuator/health` are public; all other endpoints require authentication.

## API endpoints

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Register a user and return a JWT |
| `POST` | `/auth/login` | No | Authenticate a user and return a JWT |
| `GET` | `/users/me` | Yes | Get the authenticated user's profile |
| `PATCH` | `/users/me` | Yes | Partially update the authenticated user's profile |
| `DELETE` | `/users/me` | Yes | Delete the authenticated user and their to-do items |
| `POST` | `/todos` | Yes | Create a to-do item |
| `GET` | `/todos` | Yes | Get the authenticated user's paginated to-do items |
| `GET` | `/todos/{todoId}` | Yes | Get one owned to-do item |
| `PUT` | `/todos/{todoId}` | Yes | Replace the title and description of an owned item |
| `PATCH` | `/todos/{todoId}?status={status}` | Yes | Update only the status of an owned item |
| `DELETE` | `/todos/{todoId}` | Yes | Delete an owned to-do item |

### List query parameters

`GET /todos` accepts:

| Parameter | Default | Accepted values |
| --- | --- | --- |
| `status` | No filter | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `sortBy` | `createdAt` | `createdAt`, `updatedAt`, `title`, `status` |
| `direction` | `desc` | `asc`, `desc` |
| `page` | `0` | Zero-based page number |
| `size` | `10` | Number of items per page |

Example:

```http
GET /todos?status=IN_PROGRESS&sortBy=updatedAt&direction=asc&page=0&size=10
```

## Example requests

The examples below assume the Docker setup at `http://localhost:8000`.

### Register

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a to-do item

```bash
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish BlueMemo README",
    "description": "Document setup and API usage"
  }'
```

New items are created with the `PENDING` status.

### List to-do items

```bash
curl "http://localhost:8000/todos?status=PENDING&sortBy=createdAt&direction=desc&page=0&size=10" \
  -H "Authorization: Bearer <JWT>"
```

### Update title and description

```bash
curl -X PUT http://localhost:8000/todos/<TODO_ID> \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish and review BlueMemo README",
    "description": "Verify every documented command"
  }'
```

### Update status

```bash
curl -X PATCH "http://localhost:8000/todos/<TODO_ID>?status=COMPLETED" \
  -H "Authorization: Bearer <JWT>"
```

### Update the current user

The current password is required to authorize a profile update. All other fields are optional.

```bash
curl -X PATCH http://localhost:8000/users/me \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "5512345678",
    "birthdate": "1995-08-20",
    "password": "password123"
  }'
```

## Validation and errors

The API uses standard HTTP status codes, including:

- `400 Bad Request` for invalid fields, pagination, sorting, or status values
- `401 Unauthorized` for missing, invalid, or expired authentication and invalid credentials
- `403 Forbidden` for denied access
- `404 Not Found` for missing users or to-do items
- `409 Conflict` for duplicate emails, phone numbers, or to-do titles

Errors follow this structure:

```json
{
  "message": "Todo not found",
  "status": 404,
  "path": "/todos/00000000-0000-0000-0000-000000000000",
  "timestamp": "2026-08-06T12:00:00"
}
```

## Tests and coverage

Run the test suite from `bluememo/`:

```bash
./mvnw clean test
```

On Windows PowerShell:

```powershell
.\mvnw.cmd clean test
```

The current suite contains 52 tests covering authentication, user operations, to-do operations, JWT behavior, and application startup.

After the tests finish, open the JaCoCo report at:

```text
bluememo/target/site/jacoco/index.html
```

## Build

```bash
cd bluememo
./mvnw clean package
java -jar target/bluememo-0.0.1-SNAPSHOT.jar
```

The packaged application still requires the database and JWT environment variables described above.

# BlueMemo API

BlueMemo is a REST API for personal task management. It provides user registration and login, JWT-based authentication, profile management, and an authenticated CRUD for to-do items. Every to-do operation is scoped to the authenticated user.

## Features

- User registration and login
- Password hashing with BCrypt
- Stateless authentication with JSON Web Tokens (JWT)
- Authenticated profile lookup, partial update, and deletion
- Create, read, update, filter, sort, and delete to-do items
- Ownership validation so users can access only their own items
- Pagination and status filtering
- Centralized validation and error responses
- OpenAPI documentation with Swagger UI
- Health endpoint with Spring Boot Actuator
- Automated tests and JaCoCo coverage reports
- Dockerized API and PostgreSQL database
- Environment-specific Spring profiles

## Tech stack

- Java 17
- Spring Boot 4.1.0
- Spring Web MVC
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL 17
- JJWT 0.13.0
- Springdoc OpenAPI 3.0.3
- Maven Wrapper
- JUnit, Mockito, H2, and JaCoCo
- Docker and Docker Compose

## Project structure

```text
bluememo-web/
├── README.md
└── bluememo/
    ├── src/main/java/com/bluedigi/bluememo/
    │   ├── config/                 # Security, JWT filter, and OpenAPI
    │   ├── identity/
    │   │   ├── application/        # Authentication and user use cases
    │   │   ├── domain/             # User model and repository contract
    │   │   └── infrastructure/     # REST and persistence adapters
    │   ├── todo/
    │   │   ├── application/        # To-do use cases
    │   │   ├── domain/             # To-do model, enums, and repository contract
    │   │   └── infrastructure/     # REST and persistence adapters
    │   └── shared/                 # JWT service and exception handling
    ├── src/main/resources/         # Shared and profile-specific properties
    ├── src/test/                   # Unit and application context tests
    ├── compose.yaml
    ├── Dockerfile
    └── pom.xml
```

## Requirements

For the recommended Docker setup:

- Docker Desktop or Docker Engine with Docker Compose

For local execution without Docker:

- JDK 17
- PostgreSQL

The Maven Wrapper is included, so a separate Maven installation is not required.

## Environment variables

### Required by the application

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `JWT_SECRET` | Yes | None | Base64-encoded secret used to sign JWTs |
| `JWT_EXPIRATION_MS` | No | `900000` | Token lifetime in milliseconds |
| `SERVER_PORT` | No | `8080` | Application port |
| `SPRING_DATASOURCE_URL` | Depends on profile | Local profile has a default | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Depends on profile | Local profile has a default | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Depends on profile | Local profile has a default | Database password |
| `DB_MAX_POOL_SIZE` | No | `10` | Maximum Hikari pool size in production |
| `DB_MIN_IDLE` | No | `2` | Minimum idle connections in production |

`JWT_SECRET` must decode to a key of at least 32 bytes. Generate one with:

```bash
openssl rand -base64 32
```

### Required by Docker Compose

Create `bluememo/.env`:

```dotenv
POSTGRES_DB=bluememo_db
POSTGRES_USER=app_user
POSTGRES_PASSWORD=replace_with_a_strong_password
JWT_SECRET=replace_with_a_base64_encoded_secret
```

The `.env` file is ignored by Git and excluded from the Docker build context. Do not commit real credentials or secrets.

## Spring profiles

| Profile | Database | Schema strategy | Intended use |
| --- | --- | --- | --- |
| `local` | PostgreSQL with local defaults or environment overrides | `update` | Local development and Docker Compose |
| `qa` | PostgreSQL configured through environment variables | `validate` | Quality assurance |
| `prod` | PostgreSQL configured through environment variables | `validate` | Production |
| `test` | In-memory H2 in PostgreSQL compatibility mode | `create-drop` | Automated tests |

No profile is selected in `application.properties`; select one when starting the application. Docker Compose selects `local` automatically.

The `qa` and `prod` profiles validate an existing schema and do not create tables. Their databases must already contain a schema compatible with the JPA entities.

## Run with Docker Compose

From the repository root:

```bash
cd bluememo
docker compose up --build -d
```

Services:

- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8000/v3/api-docs`
- Health: `http://localhost:8000/actuator/health`

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

Start PostgreSQL and create the target database first. Then configure the datasource, JWT secret, and `local` profile.

### Windows PowerShell

```powershell
cd bluememo

$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/bluememo_db"
$env:SPRING_DATASOURCE_USERNAME = "app_user"
$env:SPRING_DATASOURCE_PASSWORD = "replace_with_a_strong_password"
$env:JWT_SECRET = "replace_with_a_base64_encoded_secret"

.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

### Linux or macOS

```bash
cd bluememo

export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bluememo_db
export SPRING_DATASOURCE_USERNAME=app_user
export SPRING_DATASOURCE_PASSWORD=replace_with_a_strong_password
export JWT_SECRET=replace_with_a_base64_encoded_secret

./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

When started directly, the API is available at `http://localhost:8080` unless `SERVER_PORT` overrides it.

To run another environment, replace `local` with `qa`, or `prod` and provide all variables required by that profile.

## Authentication

Registration and login return a JWT:

```json
{
  "token": "<JWT>"
}
```

Send the token to protected endpoints:

```http
Authorization: Bearer <JWT>
```

Tokens expire after 15 minutes by default. `/auth/**`, Swagger/OpenAPI, and `/actuator/health` are public. Every other endpoint requires authentication.

## API endpoints

| Method | Endpoint | Auth | Success | Description |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | No | `201` | Register a user and return a JWT |
| `POST` | `/auth/login` | No | `200` | Authenticate a user and return a JWT |
| `GET` | `/users/me` | Yes | `200` | Get the authenticated user's profile |
| `PATCH` | `/users/me` | Yes | `200` | Partially update the authenticated user's profile |
| `DELETE` | `/users/me` | Yes | `204` | Delete the user and their to-do items |
| `POST` | `/todos` | Yes | `201` | Create a to-do item |
| `GET` | `/todos` | Yes | `200` | List the user's to-do items |
| `GET` | `/todos/{todoId}` | Yes | `200` | Get one owned to-do item |
| `PUT` | `/todos/{todoId}` | Yes | `200` | Replace an owned item's title and description |
| `PATCH` | `/todos/{todoId}?status={status}` | Yes | `200` | Update an owned item's status |
| `DELETE` | `/todos/{todoId}` | Yes | `204` | Delete an owned to-do item |

### List query parameters

`GET /todos` accepts:

| Parameter | Default | Accepted values |
| --- | --- | --- |
| `status` | No filter | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `sortBy` | `createdAt` | `createdAt`, `updatedAt`, `title`, `status` |
| `direction` | `desc` | `asc`, `desc` |
| `page` | `0` | Zero-based page number |
| `size` | `10` | Number of items per page |

The paginated response contains `content`, `page`, `size`, `numberOfElements`, and `totalElements`.

## Request examples

The following examples use the Docker URL, `http://localhost:8000`.

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
    "title": "Finish BlueMemo",
    "description": "Review the API documentation"
  }'
```

New items are created with the `PENDING` status.

### List to-do items

```bash
curl "http://localhost:8000/todos?status=IN_PROGRESS&sortBy=updatedAt&direction=asc&page=0&size=10" \
  -H "Authorization: Bearer <JWT>"
```

### Update a to-do item

Both `title` and `description` are required by this endpoint.

```bash
curl -X PUT http://localhost:8000/todos/<TODO_ID> \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish and review BlueMemo",
    "description": "Verify the documented setup"
  }'
```

### Update a to-do status

```bash
curl -X PATCH "http://localhost:8000/todos/<TODO_ID>?status=COMPLETED" \
  -H "Authorization: Bearer <JWT>"
```

### Update the current user

`password` is the current password and is required to authorize the operation. The remaining fields are optional; use `newPassword` to change the password.

```bash
curl -X PATCH http://localhost:8000/users/me \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "5512345678",
    "birthdate": "1995-08-20",
    "password": "password123",
    "newPassword": "newPassword123"
  }'
```

### Delete the current user

```bash
curl -X DELETE http://localhost:8000/users/me \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newPassword123"
  }'
```

## Validation and errors

The API uses standard HTTP status codes:

- `400 Bad Request` for invalid request fields, UUIDs, pagination, sorting, or status values
- `401 Unauthorized` for invalid credentials or missing, invalid, or expired authentication
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

Run the complete test suite from `bluememo/`.

### Windows PowerShell

```powershell
.\mvnw.cmd clean test
```

### Linux or macOS

```bash
./mvnw clean test
```

The current suite contains 52 tests covering authentication, user operations, to-do operations, JWT behavior, and application startup. The application context test uses the `test` profile with an in-memory H2 database.

After the tests finish, open the JaCoCo report:

```text
bluememo/target/site/jacoco/index.html
```

## Build and run the JAR

### Windows PowerShell

```powershell
cd bluememo
.\mvnw.cmd clean package
java -jar target/bluememo-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

### Linux or macOS

```bash
cd bluememo
./mvnw clean package
java -jar target/bluememo-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

The packaged application requires the same datasource and JWT environment variables described above.

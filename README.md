# Library Management System

> A modern full‑stack library management application built with **Spring Boot** (backend) and **Create React App** (frontend).
---

## Project Overview
The **Library Management System** allows users to manage books, patrons, and loans. It demonstrates a classic Java/Spring backend paired with a modern React UI. The codebase is split into two modules:

- **backend** – Spring Boot REST API, JPA, Spring Security, and optional AI integrations.
- **frontend** – React application generated with Create React App, communicating with the backend via HTTP.

---

## Tech Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Backend | Spring Boot | 4.0.6 |
|  | Java | 21 |
|  | Maven Wrapper | (included) |
|  | Spring Data JPA, Spring Security, Spring Session (JDBC) |
|  | Microsoft SQL Server JDBC driver |
|  | Lombok |
|  | Optional: Spring AI (Google GenAI, Ollama, Pinecone) |
| Frontend | React (Create React App) |
|  | Node.js / npm |
|  | PostCSS |
| Build | Maven, npm |

---

## Prerequisites
- **Java Development Kit 21** (or newer) – `java -version` should show `21`.
- **Maven** – the repository ships the Maven Wrapper, so you can run `./mvnw` without a global installation.
- **Node.js (≥18)** and **npm** – required for the React UI.

---

## Backend Setup
1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Verify the wrapper works:
   ```bash
   ./mvnw -v
   ```
3. Install dependencies and compile:
   ```bash
   ./mvnw clean install
   ```

---

## Frontend Setup
1. Open a terminal in the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The UI will be served at http://localhost:3000 and proxies API calls to the backend (default proxy configuration points to `http://localhost:8080`).

---

## Running the Application
There are two ways to run the stack:

### 1️⃣ Development Mode (recommended)
- Start the **backend** first:
  ```bash
  cd backend
  ./mvnw spring-boot:run
  ```
- In a separate terminal, start the **frontend** as described above.
- Open http://localhost:3000 in a browser; the UI communicates with the API on http://localhost:8080.

### 2️⃣ Production Build
1. Build the backend JAR:
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```
2. Build the React static assets:
   ```bash
   cd ../frontend
   npm run build
   ```
   The build output is placed in `frontend/build`.
3. Copy the static files into the Spring Boot resources so they are served by the API:
   ```bash
   cp -r ../frontend/build/* src/main/resources/static/
   ```
4. Run the packaged JAR:
   ```bash
   java -jar target/library-0.0.1-SNAPSHOT.jar
   ```
   The application will now be available at http://localhost:8080 (the React UI is served from the same host).

---

## Database Initialization
- The file `backend/inittialData.sql` contains sample tables and seed data. Spring Boot automatically runs it on startup for embedded databases.
- For a production SQL Server instance, create a database and run the script manually, or let Spring Boot execute it by setting `spring.datasource.initialize=true` in `application.properties`.

---

## License & Acknowledgements
This project is for educational purposes (SBA301). Feel free to explore, modify, and extend it.

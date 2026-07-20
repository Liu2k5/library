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
- **Microsoft SQL Server** – installed and running locally or accessible remotely.

---

## Configuration

### Application Properties Setup

The application uses an `application.private.properties` file to store sensitive configuration values. This file is **not** committed to version control for security reasons.

#### 1. Create the private configuration file

Navigate to the `backend/src/main/resources/` directory and create a new file named `application.private.properties`:

```bash
cd backend/src/main/resources/

# On Linux/Mac
touch application.private.properties
# On Windows
echo application.private.properties
```

#### 2. Add required configuration keys

Open `application.private.properties` and add the following configuration:

```properties
# =========================
# Database Credentials (REQUIRED)
# =========================
spring.datasource.username=your_sql_server_username
spring.datasource.password=your_sql_server_password

# =========================
# Pinecone Vector Database (Optional - for AI features)
# =========================
spring.ai.vectorstore.pinecone.apiKey=your_pinecone_api_key
spring.ai.vectorstore.pinecone.index-name=your_index_name
spring.ai.vectorstore.pinecone.index-host=your_index_host

# =========================
# Ollama Embedding (Optional - for AI features)
# =========================
spring.ai.model.embedding=ollama
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.embedding.options.model=nomic-embed-text:v1.5

# =========================
# Google GenAI (Optional - for AI chat features)
# =========================
spring.ai.google.genai.api-key=your_google_genai_api_key
spring.ai.google.genai.chat.options.model=gemini-3.1-flash-lite
spring.ai.model.chat=google-genai

# =========================
# PAYOS Payment Integration (Optional)
# =========================
payos.client-id=your_payos_client_id
payos.api-key=your_payos_api_key
payos.checksum-key=your_payos_checksum_key

# =========================
# Email Configuration (Required for password reset)
# =========================
spring.mail.username=your_email@gmail.com
spring.mail.password=your_gmail_app_password

# =========================
# Password Reset URL (Required for email links)
# =========================
app.reset-password-url=http://localhost:3000/reset-password
```

> **Note:** The `application.properties` file already contains the base configuration. The `application.private.properties` file will override any properties defined there.

#### 3. Understanding the configuration

| Property | Description | Required? |
|----------|-------------|-----------|
| `spring.datasource.username/password` | Your SQL Server database credentials | **Yes** |
| `spring.ai.vectorstore.pinecone.*` | Pinecone vector database for AI-powered search | Optional |
| `spring.ai.ollama.*` | Local LLM for embedding generation | Optional |
| `spring.ai.google.genai.api-key` | Google Gemini API key for AI chat features | Optional |
| `payos.*` | PAYOS payment gateway credentials | Optional |
| `spring.mail.username/password` | Gmail credentials for sending emails (use App Password) | For email features |
| `app.reset-password-url` | Frontend URL for password reset links | For email features |

---

### Webhook Configuration with ngrok (For Payment Features)

For payment processing (PAYOS) and certain callback features, you need to expose your local development server to the internet using ngrok.

#### 1. Install ngrok

Download and install ngrok from [ngrok.com](https://ngrok.com/download) or use package managers:

```bash
# macOS with Homebrew
brew install ngrok/ngrok/ngrok

# Windows with WinGet
winget install ngrok

# Linux with Snap
snap install ngrok
```

#### 2. Authenticate ngrok

Sign up for a free account at ngrok.com and get your authtoken:

```bash
ngrok config add-authtoken your_authtoken_here
```

#### 3. Create a tunnel

Run ngrok to create a tunnel to your local backend:

```bash
ngrok http 8080
```

This will output a public URL like `https://your-subdomain.ngrok.io`. Copy this URL.

#### 4. Update PAYOS webhook URL

In your PAYOS dashboard, configure the webhook URL to point to:

```
https://your-subdomain.ngrok.io/api/payos/webhook
```

> **Important:** Keep ngrok running while testing payment features. The URL changes each time you restart ngrok unless you have a paid plan.

#### 5. Add webhook URL to configuration (optional)

If needed, add to `application.private.properties`:

```properties
payos.webhook-url=https://your-subdomain.ngrok.io/api/payos/webhook
```

---

### Getting API Keys

| Service | How to Get | Purpose |
|---------|------------|---------|
| **SQL Server** | Your database administrator or local installation | Database connection |
| **Google GenAI** | Visit [Google AI Studio](https://makersuite.google.com/app/apikey) | AI chat features |
| **Pinecone** | Sign up at [pinecone.io](https://www.pinecone.io/) | Vector database for AI |
| **PAYOS** | Register at [payos.vn](https://payos.vn/) | Payment processing |
| **Gmail App Password** | Enable 2FA in Google Account → App Passwords → Generate | Sending emails |

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
- Configure `application.private.properties` with your credentials (see Configuration section above)
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
- The file `backend/inittialData.sql` contains sample tables and seed data. Spring Boot automatically runs it on startup when using an embedded database.
- For SQL Server, ensure your database `library` exists before running the application.

---

## Troubleshooting

### Application fails to start
- Check that all required properties are present in `application.private.properties`
- Ensure SQL Server is running and credentials are correct
- Verify database name matches `databaseName=library` in `spring.datasource.url`
- Check SQL Server port (default 1433) is accessible

### Email not sending
- Use an [App Password](https://support.google.com/accounts/answer/185833) for Gmail, not your regular password
- Enable 2FA on your Google account before generating App Password
- Check that `spring.mail.username` and `spring.mail.password` are correctly set

### Payment webhook not working
- Ensure ngrok is running and the URL is correctly configured in PAYOS dashboard
- Check that the webhook endpoint path matches your controller mapping
- Verify your backend is running on port 8080 before starting ngrok
- For PAYOS, the webhook URL format should be: `https://your-subdomain.ngrok.io/api/payos/webhook`

### AI features not working
- Verify API keys are correct and have sufficient credits
- For Ollama, ensure Ollama is running locally (`ollama serve`)
- Check that the embedding model `nomic-embed-text:v1.5` is pulled (`ollama pull nomic-embed-text:v1.5`)
- For Google GenAI, ensure the model name is correct (currently `gemini-3.1-flash-lite`)

---

## License & Acknowledgements
This project is for educational purposes (SBA301). Feel free to explore, modify, and extend it.
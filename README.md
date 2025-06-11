# Starter TypeScript Server

A boilerplate project for building a backend server with **TypeScript** and **Express**, integrated with **MongoDB** and **Redis**. Includes middleware for **JWT-based authentication** and is fully Docker-compatible.

---

## 🚀 Features

- ⚙️ TypeScript & Express setup
- 🛡 JWT authentication middleware
- 🗃 MongoDB integration
- 🚀 Redis caching
- 🐳 Docker support
- 📁 Environment-based configuration

---

## 📦 Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

---

## 🛠 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/starter-typescript-server.git

# 2. Navigate to the project folder
cd starter-typescript-server

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

---

## ⚙️ Configuration
Set up your .env file in the root directory with the following structure:

```txt
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=your_database_name

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_secret_key
```

---

## 🐳 Docker

### 🏗 Build the Docker image

```bash
docker build --no-cache -t starter-typescript-server:staging .
```

### ▶️ Run the Docker container

Ensure you have an .env.staging file in your project root:

```txt
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb://host.docker.internal:27017
MONGO_DB_NAME=staging

# Redis
REDIS_HOST=host.docker.internal
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_secret_key
```

Then run:

```bash
docker run --env-file .env.staging -p 3000:3000 starter-typescript-server:staging
```

--- 

## 🧪 Scripts

* `npm run dev` – Start server in development mode

* `npm run build` – Compile TypeScript to JavaScript

* `npm start` – Run compiled app

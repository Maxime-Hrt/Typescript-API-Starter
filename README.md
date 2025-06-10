# Starter Typescript Server

This is a starter project for a Typescript server using Express. The project is configured to use MongoDB as the database and Redis to cache the data. Middleware are configured to verify the JWT token and the user is authenticated.

## Getting Started

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run dev` to start the server

## Configuration

You can configure the server by setting the environment variables in the `.env` file.

```
### Server
PORT=3000

### MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME="starter"

### JWT
JWT_SECRET=your_secret_key
```

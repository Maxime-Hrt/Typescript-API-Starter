# Étape 1 : Build TypeScript
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Étape 2 : Image finale
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

# Définir la variable par défaut
ENV NODE_ENV=staging

EXPOSE 3000

CMD ["npm", "run", "serve"]
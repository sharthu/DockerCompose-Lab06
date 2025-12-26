# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

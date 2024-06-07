# Stage 1: Build
FROM node:20.14-alpine3.20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Run
FROM node:20.14-alpine3.20

# Set working directory
WORKDIR /app

# Copy node_modules and built Prisma client from the previous stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/server.js ./server.js

# Setup environment variables
ENV PORT=8080
ENV HOST=0.0.0.0
ENV DATABASE_URL=mysql://user:password@db:3306/yourdatabase

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the app
CMD ["node", "server.js"]
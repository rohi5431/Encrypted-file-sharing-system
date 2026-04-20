FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install deps
RUN npm install --production

# Copy rest of backend
COPY . .

# Create encrypted upload directory
RUN mkdir -p uploads_encrypted

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]

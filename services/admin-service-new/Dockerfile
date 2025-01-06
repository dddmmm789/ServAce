# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs && \
    chown -R node:node logs

# Switch to non-root user
USER node

# Expose port
EXPOSE 3009

# Start application
CMD ["npm", "start"] 
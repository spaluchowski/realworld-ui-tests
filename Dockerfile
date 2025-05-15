FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Set environment variables
ENV CI=true
ENV NODE_ENV=production

# Run tests
CMD ["npm", "test"]
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# The command to run in development mode (will be used by compose.yml)
# For production, this would be 'npm run build' followed by 'npm start'
CMD ["npm", "run", "dev"]
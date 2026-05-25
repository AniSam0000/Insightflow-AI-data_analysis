FROM node:20-alpine

# Set environment to production for optimal performance
ENV NODE_ENV=production

WORKDIR /app

# Copy package files and change ownership
COPY --chown=node:node package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy source code and change ownership
COPY --chown=node:node . .

# Create uploads directory and ensure node user has write access
RUN mkdir -p uploads && chown -R node:node uploads

# Switch to non-root user for better security
USER node

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]

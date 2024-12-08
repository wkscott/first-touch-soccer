#!/bin/bash

# Pre-deployment checks
echo "Running pre-deployment checks..."

# Run tests
npm test

# Security audit
npm audit

# Build frontend
npm run build

# Database backup
echo "Creating database backup..."
mongodump --uri="$MONGODB_URI" --out="./backup/$(date +%Y%m%d)"

# Deploy
echo "Deploying application..."
git push heroku main

# Post-deployment checks
echo "Running post-deployment checks..."
curl -f "$PRODUCTION_URL/health"

echo "Deployment complete!" 
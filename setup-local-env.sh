#!/bin/bash

# Setup Local Environment Script for Vibe Manager
# This script helps set up the local environment for development

echo "Setting up local environment for Vibe Manager..."

# Check if .env.local already exists
if [ -f .env.local ]; then
  echo "Warning: .env.local already exists. Do you want to overwrite it? (y/n)"
  read answer
  if [ "$answer" != "y" ]; then
    echo "Setup cancelled. Your existing .env.local file was not modified."
    exit 0
  fi
fi

# Copy from example file if it exists
if [ -f .env.local.example ]; then
  cp .env.local.example .env.local
  echo "Created .env.local from .env.local.example"
else
  # Create .env.local with default values
  cat > .env.local << EOL
# Local environment variables for Vibe Manager
# These credentials are for local development only

# Google OAuth credentials for Calendar integration
# You need to replace these with your actual credentials from Google Cloud Console
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
REACT_APP_GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
EOL
  echo "Created .env.local with default values"
fi

echo ""
echo "Local environment setup complete!"
echo "IMPORTANT: .env.local contains sensitive credentials and is excluded from git."
echo "           Never commit this file to version control."
echo ""
echo "To start the development server, run: npm start"

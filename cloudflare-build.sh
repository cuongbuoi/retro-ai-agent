#!/bin/bash
set -e

# Echo commands before execution
set -x

# Setup environment
echo "Setting up Node.js environment..."
export NODE_ENV=production

# Install dependencies using Yarn
echo "Installing dependencies..."
yarn install --immutable

# Build the application
echo "Building application..."
yarn build

# Ensure output directory exists
if [ -d ".output/public" ]; then
  echo "Build successful! Output directory exists."
else
  echo "Build failed! Output directory does not exist."
  exit 1
fi

# Done
echo "Build completed successfully!" 
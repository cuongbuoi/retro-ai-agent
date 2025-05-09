#!/bin/bash
set -e

# Install dependencies using --immutable flag to prevent lockfile changes
yarn install --immutable

# Build the application for Cloudflare Pages with Functions support
NODE_VERSION=22 yarn build

# Ensure _routes.json is in the output directory
if [ ! -f ".output/public/_routes.json" ]; then
  cp public/_routes.json .output/public/
fi

echo "Build completed successfully!" 
#!/bin/bash
echo "Installing dependencies..."
yarn install

echo "Building Nuxt application..."
npx nuxt build

echo "Build completed!" 
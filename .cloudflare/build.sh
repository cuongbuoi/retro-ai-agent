#!/bin/bash
set -e

# Cài đặt Yarn 1.22.22 cụ thể
echo "Cài đặt Yarn 1.22.22..."
npm install -g yarn@1.22.22

# Hiển thị phiên bản Yarn đang sử dụng
yarn --version

# Install dependencies với frozen-lockfile để tránh thay đổi lockfile
yarn install --frozen-lockfile

# Build the application for Cloudflare Pages with Functions support
NODE_VERSION=22 yarn build

# Ensure _routes.json is in the output directory
if [ ! -f ".output/public/_routes.json" ]; then
  cp public/_routes.json .output/public/
fi

echo "Build completed successfully!" 
#!/bin/sh

# Ensure that we have the latest version
git pull

# Dependencies
npm install --legacy-peer-deps

# Build
export NODE_ENV=production
export DEMO_MODE=1

npm run build

# Copy files
rm -Rf demo
mkdir demo
cp -R dist/* demo

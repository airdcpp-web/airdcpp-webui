#!/bin/sh

# Ensure that we have the latest version
git pull

# Build
export NODE_ENV=production
export DEMO_MODE=1

npm install
npm run build

# Copy files
rm -Rf demo
mkdir demo
cp -R dist/* demo

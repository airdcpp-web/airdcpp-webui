# Ensure that we have the latest version
git pull
npm update

# Build
export NODE_ENV=production
export DEMO_MODE=1

npm run build

# Copy files
rm -Rf demo
mkdir demo
cp -R dist/* demo

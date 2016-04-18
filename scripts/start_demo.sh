export NODE_ENV=production

# Allow binding to port 80
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

node server.js --bindAddress=${1-0.0.0.0} --port=80

export NODE_ENV=production
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
nodejs server.js $@

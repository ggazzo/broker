    export PATH=/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript
    export PWD=/home/iot
    export HOME=/home/iot
    export BIND_IP=127.0.0.1
    export PORT=8080
    export HTTP_FORWARDED_COUNT=1
    export MONGO_URL=mongodb://localhost:27017/iot
    export ROOT_URL=https://gazzo.xyz
    # export NVM_DIR="$HOME/.nvm"
    # exec [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    # exec nvm install v4.6.2
    # exec node -v
    exec node /home/iot/bundle/main.js
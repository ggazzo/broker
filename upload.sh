#!/bin/bash
#set -e
### Configuration ###/
SERVER=root@gazzo.xyz
APP_DIR=/home/iot
KEYFILE="./../.ssh/id_rsa"
REMOTE_SCRIPT_PATH=/home/deploy.sh
### Library ###
function run() {
  echo "Running: $@"
  "$@"
}
# 
echo "initializing build"
# ### Automation steps ###
if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i$KEYFILE"
else
  KEYARG=
fi
# if [[ `meteor --version` =~ "Meteor 1.4."* ]]; then
  # run meteor build --server-only ../output --architecture os.linux.x86_64
  mv ../output/*.tar.gz ./package.tar.gz
# else
#   run meteor bundle package.tar.gz
# fi
# run mv ../*.tar.gz ./package.tar.gz
run scp $KEYARG package.tar.gz $SERVER:$APP_DIR/
run scp $KEYARG ./work.sh $SERVER:$REMOTE_SCRIPT_PATH
run scp $KEYARG ./run.sh $SERVER:/home/run.sh
run scp $KEYARG ./iot.conf $SERVER:/etc/init/iot.conf
echo ""
echo "---- Running deployment script on remote server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH
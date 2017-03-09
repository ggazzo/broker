#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/iot
RESTART_ARGS=

# Uncomment and modify the following if you installed Passenger from tarball
#export PATH=/path-to-passenger/bin:$PATH


### Automation steps ###

set -x

# Extract newly uploaded package
mkdir -p $APP_DIR/tmp
cd $APP_DIR/tmp
tar xzf $APP_DIR/package.tar.gz
rm -f $APP_DIR/package.tar.gz

# Install dependencies
cd $APP_DIR/tmp/bundle/programs/server
npm install --production
npm prune --production

# Switch directories, restart app
mv $APP_DIR/bundle $APP_DIR/bundle.old
mv $APP_DIR/tmp/bundle $APP_DIR/bundle
rm -rf $APP_DIR/bundle.old2

chown meteor:meteor /home/iot -R
restart iot

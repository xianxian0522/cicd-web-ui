#!/bin/sh

npm config set registry=http://172.16.97.41:9000/repository/npm/
npm i
export PATH=$(pwd)/node_modules/.bin:$PATH
npm run build

mv dist $APP
tar -czvf "$APP-$VERSION_NAME.tar.gz" $APP/

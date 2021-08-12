#!/bin/sh

srcDir=$1
appName=$2
packageName=$3
version=$4
thirdDir=$5

pack_app(){
  srcDir=$1
  appName=$2
  packageName=$3
  version=$4
  name=$packageName-$version

  npm config set registry=http://172.16.97.41:9000/repository/npm/
  npm i
  npm run build --prod

  mv dist $appName
  tar -czvf "$appName.tar.gz" $appName/
}

pack_app "$srcDir" "$appName" "$packageName" "$version"


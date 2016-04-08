#!/bin/bash
# TODO: Decrease dependence on global npm packages
echo "Assumes you have acquired private-spyglass git repo and CD'd into it as root"
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
yum install -y nodejs
npm install -y -g bower
npm install -y -g nodemon
npm install -y -g forever
npm install
cd lib/test-portal/static-web-content
bower install --allow-root
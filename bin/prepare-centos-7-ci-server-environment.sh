#!/bin/bash
echo "Assumes you have acquired private-spyglass git repo and CD'd into it as root"
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
yum install -y nodejs
npm install -y -g bower
npm install -y -g nodemon
npm install
cd lib/test-portal/static-web-content
bower install --allow-root
echo "Optional: Copy test results using scp -rp test-results root@10.10.1.101:/root/private-spyglass/"
echo "Use bin/run-test-portal to start CI server. Read lib/test-portal/readme.md for more info ont that"
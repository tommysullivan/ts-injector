#!/usr/bin/env bash
set -e
touch ~/.bashrc
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
export NVM_DIR="~/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
source ~/.bashrc
nvm install 5.0
nvm use 5.0
npm install
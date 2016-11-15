#!/usr/bin/env bash
set -e
bin/prepare-dependencies.sh
npm run build
npm test
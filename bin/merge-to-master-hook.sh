#!/usr/bin/env bash
set -e
bin/prepare-dependencies.sh
npm test
npm publish
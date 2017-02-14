#!/usr/bin/env bash
set -e
bin/prepare-dependencies.sh
export release=mapr6.0.0
export lifecyclePhase=development
export onDemandClusters=MesosDockerFarm:baseCentOS1Node
export portalId=lab
npm run build
bin/devops run cucumber -- --tags @packageInstallation
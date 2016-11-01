#!/usr/bin/env bash
set -e
bin/prepare-dependencies.sh
export release=mapr6.0.0
export lifecyclePhase=development
export clusterId=centos7.1
export portalId=lab
./bin/devops run featureSet --featureSetId esxiNonGUIInstallAndHealthCheck
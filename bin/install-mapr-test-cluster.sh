#!/usr/bin/env bashset -e
bin/prepare-dependencies.sh
export defaultRelease=mapr6.0.0
export defaultLifecyclePhase=development
export clusterId=centos7.1
export portalId=lab
./bin/devops run featureSet --featureSetId esxiNonGUIInstallAndHealthCheck
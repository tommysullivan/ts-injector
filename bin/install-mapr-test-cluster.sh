#!/usr/bin/env bash
set -e
devops/pipeline prepare-development-environment
export release=mapr6.0.0
export lifecyclePhase=development
export onDemandClusters=MesosDockerFarm:baseCentOS1Node,MesosDockerFarm:baseUbuntu141Node
export portalId=lab
export testName=core-6.0-promotion
npm run build
bin/devops run featureSet --featureSetId dockerInstallAndPackageCheck
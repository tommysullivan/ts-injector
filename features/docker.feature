Feature: Test support for docker

  @DockerTest1
  Scenario: Json for marathon is generated
    Given The docker information is set based on the following JSON
    """
     {
      "dockerInfrastructure" : {
      "dockerRepo": "maprdocker.lab",
      "mesosClusters": [
        {
        "id": "MesosDockerFarm",
        "mesosMasterIP": "10.10.12.6",
        "mesosMasterPort": "5050",
        "marathonIP": "10.10.12.6",
        "marathonPort": "8080",
        "mesosSlaves": [
          "10.10.12.6",
          "10.10.12.7"
        ],
        "dockerVolumeMountPath": "/mapr/aashreya.devops.lab/testDisks",
         "dockerVolumeLocalPath": "/dockerDisks"
        }
      ],
      "dockerClusters": [
        {
        "id": "devopsMapr5.2",
        "operatingSystem": "CentOS",
        "operatingSystemVersion": "6.6",
        "maprVersion": "5.2.0",
        "nodes": 1,
        "templateId": "template1",
        "imageNames": [
          {
            "name" : "mapr-1base:5.2.0",
            "instances" : 1
          }
        ],
        "defaultCPUsPerContainer": 2,
        "defaultMemoryPerContainer": 21504
        },
        {
        "id": "baseCentOS6.6",
        "operatingSystem": "CentOS",
        "operatingSystemVersion": "6.6",
        "imageNames": [
          {
            "name" : "centos:6.6",
            "instances": 1
          }
        ],
        "defaultCPUsPerContainer": 2,
        "defaultMemoryPerContainer": 5120
        }
      ]
    }
    }
    """
    And I set the image name in cluster testing config based on following JSON
    """
    {
         "clusterTesting": {
            "defaultDockerId": "devopsMapr5.2",
            "defaultMesosClusterId": "MesosDockerFarm"
         }
    }
    """
    Then I verify the Json being sent to marathon is the following
    """
{
   "id": "testdockername",
   "container": {
      "type": "DOCKER",
      "volumes": [{
        "hostPath":"/mapr/aashreya.devops.lab/testDisks/testCluster",
        "containerPath":"/dockerDisks",
        "mode":"RW"}
        ],
      "docker": {
         "image": "maprdocker.lab/mapr-1base:5.2.0",
         "network": "BRIDGE",
         "portMappings": null,
         "privileged": true,
         "forcePullImage": false
      }
   },
   "cpus": 2,
   "mem": 21504,
   "instances": 1,
   "maxLaunchDelaySeconds": 3600,
   "env": {
      "CLUSTERNAME": "testCluster"
   }
}
    """
    And I launch the docker image on marathon
    And I wait "30" seconds
    And I verify the image was created was "devopsmapr5.2"
    And I kill the created image with name "devopsmapr5.2"


  @DockerTest2
  Scenario: Launch Multi Node Mapr cluster
    Given The docker information is set based on the following JSON
    """
     {
      "dockerInfrastructure" : {
      "dockerRepo": "docker.io/maprtech",
      "mesosClusters": [
        {
        "id": "MesosDockerFarm",
        "mesosMasterIP": "10.10.12.6",
        "mesosMasterPort": "5050",
        "marathonIP": "10.10.12.6",
        "marathonPort": "8080",
        "marathonUser": "root",
        "marathonPassword": "mapr",
        "mesosSlaves": [
          "10.10.12.6",
          "10.10.12.7"
        ],
        "dockerVolumeMountPath": "/mapr/aashreya.devops.lab/testDisks",
        "dockerVolumeLocalPath": "/dockerDisks"
        }
      ],
      "dockerClusters": [
        {
        "id": "devopsMapr5.2Multi",
        "operatingSystem": "CentOS",
        "operatingSystemVersion": "6.6",
        "maprVersion": "5.2.0",
        "nodes": 2,
        "imageNames": [
          {
              "name" : "mapr-control-cent67:5.2.0",
              "type" : "control",
              "diskProvider" : true,
              "instances" : 1
          },
          {
              "name" : "mapr-data-cent67:5.2.0",
              "type" : "data",
              "diskProvider" : true,
              "instances" : 1
          }
        ],
        "defaultCPUsPerContainer": 2,
        "defaultMemoryPerContainer": 21504
        }
      ]
    }
    }
    """
    And I set the image name in cluster testing config based on following JSON
    """
    {
         "clusterTesting": {
            "defaultDockerId": "devopsMapr5.2Multi",
            "defaultDockerFarmId": "MesosDockerFarm"
         }
    }
    """
    Then I verify the Json being sent to marathon is the following
    """
{
   "id": "testdockername",
   "container": {
      "type": "DOCKER",
      "volumes": [
                    {
                        "hostPath": "/mapr/aashreya.devops.lab/testDisks/testCluster",
                        "containerPath": "/dockerDisks",
                        "mode": "RW"
                    }
          ],
      "docker": {
         "image": "docker.io/maprtech/mapr-control-cent67:5.2.0",
         "network": "BRIDGE",
         "portMappings": null,
         "privileged": true,
         "forcePullImage": false
      }
   },
   "cpus": 2,
   "mem": 21504,
   "instances": 1,
   "maxLaunchDelaySeconds": 3600,
   "env": {
      "CLUSTERNAME": "testCluster"
   }
}
    """
    And I launch the docker image on marathon
    And I wait "60" seconds
    And I verify the above group was created
    And I kill all created group


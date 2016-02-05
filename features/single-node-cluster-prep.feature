Feature: Single Node Cluster Preparation
  As a MapR Employee
  In order to test and demo Spyglass before it is available in the UI installer
  I prepare a Single Node MapR Cluster with the prerequisites documented in private/spyglass readme

  @WIP
  Scenario: Install on Docker Container


  # Simplified Goal:
  # 1.

  # Short term - skip the docker caching

  # Goal: I want to be able to run a single command where I specify the precise GUI Installer
  # version to use, and which operating system, and the precise Spyglass components to use,
  # and then the command transfers control to be inside
  # that precise operating system, uses curl to obtain the installer.sh file, then executes that with the
  # correct -u arguments.

  # Next, it would use the REST APIs to create a Spyglass-Ready MapR cluster with the appropriate
  # prerequisites.

  # Next, it would just make sure that the dashboard info was obtainable from MCS to prove that the thing
  # was up and running.

  # At that point, it could save a docker image, name it according to the unique OS / MapR Installer / -u Repo
  # combination and publish that to an appropriate Docker repo.

  # Later invocations of the same input args could reuse that existing repo.

  # Next, again within the container, it would run the appropriate yum and configure.sh script to install
  # Spyglass specific stuff. Upon completion,
  # it would run the Health Check and if that worked, it would save another docker container for the specific
  # version of the mentioned inputs plus the specific versions of the spyglass components.

  # Later invocations of the same input args could reuse that existing image and run a sanity health check
  # to verify the container is ready.

  # Finally, with the known working spyglass cluster, the remaining functional tests could be run against the container's
  # successfully running services.
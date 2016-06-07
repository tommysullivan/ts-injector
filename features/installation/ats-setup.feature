Feature: Package Manager Installation

  @atsSetup
  Scenario: Setup ATS after cluster install
    Given the cluster has MapR Installed
    And I install maven on a non-cldb node
    And I copy the maven settings file to the non-cldb node
    And I install git on the non-cldb node
    And I create the user "m7user1" with id "5025" group "m7group1" and password "m7user1"
    And I create the user "m7user2" with id "5026" group "m7group1" and password "m7user2"
    And I create the user "m7user3" with id "5027" group "m7group2" and password "m7user3"
    And I create the user "m7user4" with id "5028" group "m7group1" and password "m7user4"
    And I add the user "m7user4" to secondary group "m7group1"
    And I create the user "mapruser1" with id "5029" group "mapruser1" and password "mapruser1"
    And I create the user "mapruser2" with id "5030" group "mapruser2" and password "mapruser2"
    And I set the git ssh key
    And I clone ATS on the node from "git@github.com:mapr/private-qa.git"
    And I remove the git ssh key
    And I setup passwordless ssh from non-cldb node to all other nodes
    And I set StrictHostKeyChecking option to no on non-cldb node
    And I perform the following ssh commands on each node in the cluster:
    """
    #Give root user the permission to execute YARN jobs
    sed -i 's/allowed.system.users=mapr/allowed.system.users=root,mapr/g' /opt/mapr/hadoop/hadoop-2.7.0/etc/hadoop/container-executor.cfg
    """
    
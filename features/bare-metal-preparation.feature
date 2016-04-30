Feature: Bare Metal Preparation

  Scenario: Ubuntu & Red Hat Stress Cluster Preparation
    When I perform the following ssh commands on each node in the cluster:
    """
    yum install -y java curl
    id -u mapr || useradd -u 500 mapr
    """
    And  I scp "data/testing-resources/mapr.repo" to "/etc/yum.repos.d/mapr.repo" on each node in the cluster
    And  I scp "data/testing-resources/ecosystem.repo" to "/etc/yum.repos.d/ecosystem.repo" on each node in the cluster

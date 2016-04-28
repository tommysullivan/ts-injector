Feature: Bare Metal Preparation

  Scenario: Ubuntu & Red Hat Stress Cluster Preparation
    When I perform the following ssh commands on each node in the cluster:
    """
    yum install -y java curl
    """
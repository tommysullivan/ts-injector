@logs
Feature: Yarn Logs
  As a Spyglass User
  In order to centrally query for and view YARN logs using a number of relevant parameters
  I use the Spyglass-Provided ElasticSearch REST API (or Kibana, which in turn uses ES REST API)

  @SPYG-225
  Scenario: Logs for Successful YARN Jobs Appear in ElasticSearch with Application ID for services "nodemanager" and "resourcemanager"
    Given I have installed Spyglass
    And the cluster is running YARN
    And I perform the following ssh commands on each node in the cluster:
    """
    #Give root user the permission to execute YARN jobs
    sed -i 's/allowed.system.users=mapr/allowed.system.users=root,mapr/g' /opt/mapr/hadoop/hadoop-2.7.0/etc/hadoop/container-executor.cfg
    """
    When I run the following commands on any given node in the cluster:
    """
    hadoop fs -mkdir -p /spyglass-test-results/{testRunGUID}/yarn
    hadoop jar /opt/mapr/hadoop/hadoop-2.7.0/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.0-mapr-*.jar teragen 100 /spyglass-test-results/{testRunGUID}/teragen
    """
    And I obtain the application id from the stdout
    And I wait "3" seconds
    Then I should see logs in ElasticSearch containing the application ID when I filter by service name "nodemanager"
    Then I should see logs in ElasticSearch containing the application ID when I filter by service name "resourcemanager"

  Scenario: Compare logs on filesystem to logs in ES
  Scenario: Failing Hadoop Job Logs are Identifiable with Application ID
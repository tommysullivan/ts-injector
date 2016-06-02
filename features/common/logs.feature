Feature: Logs

  @healthCheck @logs
  Scenario Outline: Insert Log Lines directly and verify presence in ES
    Given I have installed Spyglass
    And the service of interest is "<service name>", tracked in elasticsearch as "<tracked as>"
    And the log file for the service is located at "<path>"
    When I append "5" fake log lines containing a string with the following format:
    """
    <service name>-{testRunGUID}-{lineNumber}
    """
    And I wait "15" seconds
    And for each host running the service, I query for logs containing the above string on that host
    Then I receive at least "4" results per host
    Examples:
      | service name         | tracked as       | path                                                               |
      | mapr-fileserver      | mfs              | /opt/mapr/logs/mfs.log-3                                           |
      | mapr-fileserver      | mfs_maprdb       | /opt/mapr/logs/mfs.log-5                                           |
      | mapr-cldb            | cldb             | /opt/mapr/logs/cldb.log                                            |
      | mapr-cldb            | cldbfssummary    | /opt/mapr/logs/cldbfssummary.log                                   |
      | mapr-webserver       | adminuiapp       | /opt/mapr/logs/adminuiapp.log                                      |
      | mapr-fileserver      | warden           | /opt/mapr/logs/warden.log                                          |
      | mapr-zookeeper       | zookeeper        | /opt/mapr/zookeeper/zookeeper-*/logs/zookeeper.log                 |
      | mapr-nfs             | nfsserver        | /opt/mapr/logs/nfsserver.log                                       |
      | mapr-resourcemanager | resourcemanager  | /opt/mapr/hadoop/hadoop-2.7.0/logs/yarn-mapr-resourcemanager-*.log |
      | mapr-nodemanager     | nodemanager      | /opt/mapr/hadoop/hadoop-2.7.0/logs/yarn-mapr-nodemanager-*.log     |
      | mapr-grafana         | grafana          | /opt/mapr/grafana/grafana-*/var/log/grafana/grafana.log            |
      | mapr-fluentd         | fluentd          | /opt/mapr/fluentd/fluentd-*/var/log/fluentd/fluentd.log            |
      | mapr-collectd        | collectd         | /opt/mapr/collectd/collectd-*/var/log/collectd/collectd_daemon.log |
      | mapr-opentsdb        | opentsdb         | /opt/mapr/opentsdb/opentsdb-*/var/log/opentsdb/opentsdb_daemon.log |

  @healthCheck @logs
  Scenario: Insert Log Lines directly and verify presence in ES
    Given I have installed Spyglass
    And the service of interest is "mapr-kibana", tracked in elasticsearch as "kibana"
    And the log file for the service is located at "/opt/mapr/kibana/kibana-*/var/log/kibana/kibana.log"
    When I append "5" fake json log lines containing a message property with the following format:
    """
    mapr-kibana-{testRunGUID}-{lineNumber}
    """
    And I wait "20" seconds
    And for each host running the service, I query for logs containing the above string on that host
    Then I receive at least "4" results per host
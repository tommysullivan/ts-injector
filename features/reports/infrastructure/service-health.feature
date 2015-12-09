Feature: Service Health

  Scenario: Are all services up?
  Scenario: Notifications / alerts
  Scenario: If there is a problem, how can I troubleshoot and fix?
  Scenario: How can I quickly look at service logs for errors?
  Scenario: At the time of the error, was the cluster fully utilized? If so, by what users or workloads?
  Scenario: At the time of the error, was the user's job in a queue that was maxed out? If so, what other jobs contributed to the queue being full?
  Scenario: At the time of the error, were there any node or network issues? How can I correlate system health with timing of issues?
  Scenario: Are my services (Drill, Hive (HS2), HBase) alive and fullfilling user requests? How available have they been over the past month? Am I meeting the SLA I communicated to my users?
  Scenario: How is the service performing?
  Scenario: How much load is the service under?
  Scenario: Filterable / searchable syslogs for the service
  Scenario: Service-specific health tests, such as TCP/HTTP connection checks
  Scenario: Arbitrary "test" script that performs test and returns status

  @p1
  Scenario: Service Logs Dashboard - This dashboard should be filtered to show logs for the service specified, but show logs for all nodes. Individual node IDs should be displayed with checkboxes giving the ability to filter out specific nodes. Services that should be supported here include -
    * MapR: CLDB, FS, WebServer, Gateway, NFS, ZK
    * YARN - RM, NM, ATSMR - HSSpark - HS
    * Hive - HS2, HiveMeta
    * HBase - HBM, HBRS, REST, Thrift
    * Drill - Drillbit
    * HttpFS
    * Hue
    * Oozie
    * P2: MRv1 JT/TT
    * P2: Spark Standalone Master/Slave
    * P2: Impala
    * P2: Storm
    * P2: Flume

  @p1
  Scenario: Each service page in new MCS should include a prominent link called ‘Logs’ which takes the user (in a new tab) to a service-specific dashboard in the logs GUI.


@draft @questions
Feature: Cluster Dashboard / Global Dashboard
  Several of the charts displayed at a cluster aggregate level must be effective at showing the cluster as
  a whole as well as any out-of-range nodes.


  Scenario: What is the storage utilization trend?
  Scenario: Do I need to add storage or compute resources? If so, when?
  Scenario: What user or group is consuming the majority of resources?
  Scenario: How is my cluster performing today vs. yesterday?
  Scenario: Are any resources (slots, RAM, other) becoming fully utilized? If so, what jobs, users, or tenants contributed?
  Scenario: Are some FairScheduler queues full while others aren't? This is in RM page but perhaps Spyglass can yield answers around which groups (queues) are more heavily used than others.
  Scenario: Dashboard with visualizations of containers, slots, ram, cpu, etc. Ability to drill down into what contributed to utilization - queues -> users -> jobs -> tasks

  @p2
  Scenario: Average Trend - boldest line represents the average utilization of all nodes. This allows users to spot periods of unusual load - maybe a user submitted a bad job, or maybe something clogged up job submission so the whole cluster plummeted for a period of time.

  @p2
  Scenario: Outliers - equally important to showing the average is showing specific cases that are out-of-average. If a particular node is under-utilized, it may mean services aren’t healthy and it isn’t accepting work. If a node is over-utilized, it could mean data layout isn’t optimal and hotspotting is occurring. Care must be taken not to show too many outliers as it could easily clog a graph. A healthy medium should be to show no more than 4 individual lines in addition to the average. If it isn’t feasible to display multiple outliers, at least a ‘min’ and ‘max’ line should be shown representing the least and most utilized node.

  @p2
  Scenario: Line w/view finder chart. Cluster average + up to 4 outliers. Click an outlier series to be taken to the page for that node:
    * CPU Utilization Percentage
    * Memory Utilization Percentage
    * I/O Throughput (Read+Write)
    * I/O Ops (Read+Write)
    * DB Ops (R+W Get, Put, Scan)
    * Network Throughput (Send+Recv)
    * Line w/view finder chart

  @p2
  Scenario: YARN Containers (allocated, pending)
    * Stacked Area Chart: - Storage Utilization Trend - largest 5 volumes plus ‘other volumes’.
    * Donut Chart: - Storage Utilization By Volume - largest 9 volumes plus ‘other’.

  @p1
  Scenario: 3rd Party Dashboard
    * Pre-built third-party dashboard with identical configuration to that described in ‘Global Dashboard’. Global dashboard in MCS should link to this.
    * This will be used by users that want to customize their global dashboard.

  # From whiteboard capture
  Scenario: Dashboard
    * Cluster Heatmap
    * CPU trend
    * Memory trend
    * Storage Trend
    * YARN containers
    * more
    * Alarms and Alerts - name (container under and threshold - cpu cited), time interval (30s, 1m), nodename (single node?)

  @us-3
  Scenario: Administrator has been alerted to service not running and wants to troubleshoot
    Given administrator has been alerted via mapr node alarm, 3rd party alert, or an outlier discovered in global dashboard
    When administrator browses to affected node dashboard (would they need to do this for each node service is running on?)
    Then administrator sees a "memory utilization per service" chart with maybe other services hogging memory
    And can click "logs" next to the affected service
    And this results in viewing the logs dashboard, pre-filtered for that node+service combination. (why wouldn't they want to see all logs since the issue might be happening across multiple nodes?)

  @cisco
  Scenario: Cumulative view of cluster utilization and health

  @rubicon
  Scenario: Historical out of memory troubleshooting
    * run out of memory across cluster and nodes will start to swap
    * if nobody from ops team is online at the time then they can't tell what jobs caused the issue
    * want a graph showing task-ram usage over time, by job-id or by user

  @uhg
  Scenario: cluster cpu, aggregated and per host

  @uhg
  Scenario: Forecasting - show based on current trend whether new hardware needs to be added



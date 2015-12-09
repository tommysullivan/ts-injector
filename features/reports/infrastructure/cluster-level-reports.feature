Feature: Cluster Utilization
  Several of the charts displayed at a cluster aggregate level must be effective at showing the cluster as
  a whole as well as any out-of-range nodes.


  Scenario: What is the storage utilization trend?
  Scenario: Do I need to add storage or compute resources? If so, when?
  Scenario: What user or group is consuming the majority of resources?
  Scenario: How is my cluster performing today vs. yesterday?
  Scenario: Are any resources (slots, RAM, other) becoming fully utilized? If so, what jobs, users, or tenants contributed?
  Scenario: Are some FairScheduler queues full while others aren't? This is in RM page but perhaps Spyglass can yield answers around which groups (queues) are more heavily used than others.
  Scenario: Dashboard with visualizations of containers, slots, ram, cpu, etc. Ability to drill down into what contributed to utilization - queues -> users -> jobs -> tasks

  @P2
  Scenario: Average Trend - boldest line represents the average utilization of all nodes. This allows users to spot periods of unusual load - maybe a user submitted a bad job, or maybe something clogged up job submission so the whole cluster plummeted for a period of time.

  @P2
  Scenario: Outliers - equally important to showing the average is showing specific cases that are out-of-average. If a particular node is under-utilized, it may mean services aren’t healthy and it isn’t accepting work. If a node is over-utilized, it could mean data layout isn’t optimal and hotspotting is occurring. Care must be taken not to show too many outliers as it could easily clog a graph. A healthy medium should be to show no more than 4 individual lines in addition to the average. If it isn’t feasible to display multiple outliers, at least a ‘min’ and ‘max’ line should be shown representing the least and most utilized node.

  @P2
  Scenario: Line w/view finder chart. Cluster average + up to 4 outliers. Click an outlier series to be taken to the page for that node:
    * CPU Utilization Percentage
    * Memory Utilization Percentage
    * I/O Throughput (Read+Write)
    * I/O Ops (Read+Write)
    * DB Ops (R+W Get, Put, Scan)
    * Network Throughput (Send+Recv)
    * Line w/view finder chart

  @P2
  Scenario: YARN Containers (allocated, pending)
    * Stacked Area Chart: - Storage Utilization Trend - largest 5 volumes plus ‘other volumes’.
    * Donut Chart: - Storage Utilization By Volume - largest 9 volumes plus ‘other’.

  @p1 @id-1
  Scenario: 3rd Party Dashboard -
    Pre-built third-party dashboard with identical configuration to that described in ‘Global Dashboard’. Global dashboard in MCS should link to this.
    This will be used by users that want to customize their global dashboard.




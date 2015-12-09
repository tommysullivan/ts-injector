Feature: Node Health

  Scenario: Are all nodes healthy?
  Scenario: Are nodes evenly utilized?
  Scenario: Notifications
  Scenario: If there is a problem, how can I troubleshoot and fix?
  Scenario: How utilized are my nodes?
  Scenario: Is the cluster load evenly distributed?
  Scenario: Are my nodes healthy?
  Scenario: Global dashboard with historical utilization of aggregate node statistics (cpu, memory, disk, n etwork, etc) as well as aggregated filterable/searchable syslogs (default to only showing errors)
  Scenario: Node dashboard with historical utilization of node-specific statistics (cpu, memory, disk, network, etc) as well as logs for that node

  @p1 @metrics @id-2
  Scenario: Node Metrics Dashboard
    * CPU Utilization - Stacked area chart with categories of CPU - nice, system, user.
    * CPU Utilization Per Service - Stacked area chart with services running - RM, HS2, etc
    * Memory Utilization - Stacked area chart with categories of CPU - nice, system, user.
    * Memory Utilization Per Service - Stacked area chart with services running - RM, HS2, etc
    * Swap Rate - Stacked area chart.Network Throughput - Line w/view finder - in, out.
    * MFS Throughput - Line w/view finder - read, write. Aggregate across all instances.
    * MFS IOPS - Line w/view finder - read, write. Aggregate across all instances.
    * MFS Latency - TBD.
    * Network throughput - bps - read,write.
    * Network TCP send queue size.

  @p1 @metrics @id-3
  Scenario: Node Metrics Dashboard (if YARN)
    * YARN Containers - Line w/view finder - numContainers
    * YARN Memory - Line w/view finder - used MemoryMB & top line with used MemoryMB+availMemoryMB.
    * YARN Cores - Line w/view finder - used
    * VirtualCores & top line with used VirtualCores+availableVirtualCores.

  @p1 @logs @id-4
  Scenario: Node Logs Dashboard
     This dashboard should be pre-filtered to only show logs for the node specified, but show both linux syslogs and service logs. Specific services should have checkboxes associated with them giving the ability to further filter in/out specific services.

  @p1
  Scenario: Vague Node Metrics - At a minimum, collect enough node metrics to populate the ‘Node Metrics Dashboard’ requirement. It’s desirable to collect as many additional metrics as are available through the collection framework for users to build custom dashboards from.

  @p1
  Scenario: Node syslog - /var/log/messages, others?
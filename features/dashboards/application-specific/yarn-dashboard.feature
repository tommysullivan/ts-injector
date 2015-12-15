@draft @questions @cisco
Feature: YARN Dashboard

  @p2
  Scenario: Aggregate Metrics (cluster wide) -   Full list of metrics that should be shown on the YARN service page include
    * Active Applications - Line w/view finder - appsPending, appsRunning.
    * Containers - Line w/view finder - containersAllocated, containersReserved, containersPending.
    * Memory - Line w/view finder - reservedMB, availableMB, allocatedMB with top line showing totalMB.
    * Cores - Line w/view finder - reservedVirtualCores, available
    * VirtualCores, allocatedVirtualCores with top line showing totalCores.
    * Nodes - Line w/view finder - totalNodes, activeNodes, unhealthyNodes, lostNodes.
    * absoluteUsedCapacity by queue. Stacked area graph of all leaf queues.

  @p2
  Scenario: FairScheduler Queue-Specific Dashboard - In addition to the aggregate information above, users should be able to obtain relevant information about a particular fairscheduler queue. The queue hierarchy should be displayed as a tree. Leaf nodes in the tree should be clickable, with the following graphs displayed -
    * Active Applications - Line w/view finder - appsPending, appsRunning.
    * Capacity (Absolute) - absoluteCapacity, absoluteUsedCapacity & absoluteMaxCapacity.
    * Containers used

  @p1.5
  Scenario: Yarn App Metrics Dashboard - (P1 unless significant technical challenge) YARN application, attempt, or container ids to see time-series graphs of metrics corresponding to that application. Metrics include -
    * Active containers
    * memorySeconds
    * vcoreSeconds
    * progress
    * allocatedMB
    * allocatedVcore

  @p1
  Scenario: Defaults to showing all logs for all YARN applications. Individual YARN application, attempt, or container ids can be plugged into a search box to filter. This page should be linked to from the YARN service page in MCS, called 'YARN Application Logs'.

  @p1
  Scenario: YARN Service - At a minimum, collect enough node metrics to populate the ‘YARN Metrics Dashboard’ requirement. It’s desirable to collect as many additional metrics as are available through the collection framework for users to build custom dashboards from.

  @p1
  Scenario: YARN logs - RM, NM, ATS

  @p1.5
  Scenario: YARN stdout - (P1 unless significant technical challenge) - Catch/store stdout from of all YARN applications.

  @us-5
  Scenario: Job / App slowness for a given user (Hadoop / YARN)
    Given that totalNodes == activeNodes
    And memory or virtual cores are exhausted
    And user's FairScehduler queue is at capacity
    When I look at absoluteUsedCapacity by queue
    Then I can click the leaf queue the user belongs to to see if usedCapacity is at maxCapacity

  @us-5
  Scenario: Failed YARN applications
    Given there are YARN application failures
    And the user knows the application ID of the failures
    When the user goes to the YARN Application Logs dashboard
    And the user enters the application ID into the "application ID" search box
    Then logs across all nodes for that particular application will show up (will they continue to stream in after that?)
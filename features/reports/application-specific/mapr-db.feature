Feature: MapR-DB

  @p1
  Scenario: In addition to collecting enough node metrics to populate the ‘Global and Node Metrics Dashboard’ requirements, all metrics from 'guts' and 'iostat' should be collected. Below are the most interesting - Guts - to show
    * CPU idle per core
    * RPCs in
    * cache hits, cache miss
    * general FS cache
    * value cache hit, value cache miss
    * DB cache
    * rsf (memory reserved for puts)
    * db gets/puts/scans

  #Taken from US6 in PRD
  Scenario: Hotspotting
    Given there is a poorly designed application, disk issues, MFS is bottlenecked or there are bugs
    When I check whether application hotspotting exists by checking global dashboard average / outlier graphs for abnormally utilized DB ops
    Then I can browse to a table (?), check region list for node placement and sizes to verify if regions are evenly spread scross nodes.
    And if they are then I should note key range and then ???
    And if they are not then the region is properly spread but row-keys are not randomly spread (requires change in app)

  #Taken from US6 in PRD
  Scenario: MapR DB is slow but all else fails
    Given I have tried to figure out slowness in other ways and nothing was obvious
    When I navigate to MCS
    And I click 'Logs'
    And I find error messages associated with an FID
    Then I can search error in "community support portal" to troubleshoot
    And if I find nothing, I should open a support ticket and include the logs

  #Taken from US6 in PRD
  Scenario: MapR DB is slow but all else fails
    Given I have tried to figure out slowness in other ways and nothing was obvious
    When I navigate to MCS
    And I click 'Logs'
    And I find DHL messages associated with FID
    Then I should find that MapR community portal would indicate this means operations are taking a long time to complete
    And I would find that this is often a problem with the node - bad disk, runaway process, or slow network
    And I would be directed to go to the node page in MCS to see if there is CPU/memory overutilization by checking metrics charts
    And I would also be directed to look at network statistics to see if the network is slow, best indicated by "TX queue depth" being full
    And I would also be directed to click "Logs" and inspect syslogs for indiciations of the issue

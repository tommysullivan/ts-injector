Feature: MapR-FS & MapR-DB metrics

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
  Scenario: Admin has received report of DB slowness and wants to troubleshoot
    Given there is a poorly designed application, disk issues, MFS is bottlenecked or there are bugs


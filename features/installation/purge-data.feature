Feature: Purge ES and TSDB Data Feature

  @SPYG-399 @purge
  Scenario: Check if cron jobs are started
    Given the cluster has MapR Installed
    And I make sure cron job for ES is started on nodes hosting elasticsearch
    And I make sure cron job for tsdb is started on nodes hosting opentsdb

Feature: Storage
  Scenario: How is overall storage utilization trending over time?
  Scenario: When do more servers need to be added?
  Scenario:
    Given storage utilization has spiked
    When I check which volume(s) contributed most
    Then I get a clear answer
  Scenario: How is my compression ratio trending over time?
  Scenario: Visualizaation of historical storage utilization (separate graphs for pre/post compression) which indication of what volumes contribute most to total size
  Scenario: Per volume historical utilization chart with pre/post compression size
  Scenario: Per-user historical utilization chart
  Scenario: User storage dashboard, same as above dashboard, but admin enters a username and it filters all charts for that user. User in this context is the same as "chargeable entity"
  Scenario: Volume storage dashboard, which only shows data for a single volume.

#  From all storage entities (volume, table, stream) there should be a link labeled ‘Search in Logs...’. When clicked, a page should be opened in the logs viewer that searches for the id of that entity across all node logs.
#  This may require a translation layer. For example, tables will be referenced in MCS logs by their FID, not table name, so a translation is needed. Volumes will also have an ID.

  @p1
  Scenario: Metrics Stroage - Per-volume -
    * Data Size
    * Volume Size
    * Snapshot Size
    * Total Size

  # Taken from User Stories US1 in the PRD
  Scenario: Understand storage utilization trends and whether cluster expansion or file deletion is necessary
    Given I am an administrator within MCS
    When I navigate to Storage Utilization Trend dashboard
    Then I can see how closely the total storage utilization is to the top line of cluster capacity

  # Expanding on US1 for sub cases
  Scenario: Sudden spike in storage utilization
    Given I am an administrator within MCS
    And I have navigated to Storage Utilization Trend dashboard
    And I have seen a large spike in storage utilization
    And one of the volumes represented in the stacked area chart also grew the same amount
    When I click on the volume name in the chart
    Then I am taken to the volume page where I can see "Accountable Entity"

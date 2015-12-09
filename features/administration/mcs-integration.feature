Feature: MCS Integration

  @p1, @web
  Scenario: Classic MCS will have two links - Log UI and Metrics UI - in the bottom left corner with other pluggable services. It will always be visible.

  @P2, @web
  Scenario: The new MCS should include generic, global links to any third-party monitoring tools through the pluggable services framework.

  @P2, @web
  Scenario: MCS should have the ability to display charts natively on various pages. These charts should be interactive, meaning
    * Click to zoom to full-window modal
    * Select->Drag to adjust time range
    * Click on a series in the graph to drill down, potentially going to a new page

  @p1
  Scenario: Any tools used by Spyglass should be managed and monitored by MCS and Warden

  @p1
  Scenario: The following configuration options should be configurable through maprcli and MCS GUI:
  ([ Node, Service ] * [ Metrics, Logs ] + [Application, Audit ] * Logs) * [On/Off, Retention Period]

  Scenario: Storing spyglass data in MapRDB + OpenTSDB and ElasticSearch/Solr will not cause an infinite loop
  Scenario: Link to 3rd party custom dashboard referred to in @id-1, @id-2, @id-3, @id-5, @id-6
  Scenario: Each node page (see @id-4) in MCS should include a prominent link called ‘Logs’ which takes the user (in a new tab) to a node-specific dashboard in the logs GUI.
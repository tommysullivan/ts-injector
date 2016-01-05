@draft @questions
Feature: MCS Integration

  # Q: A lot of the PRD seems to be written as if we are enhancing MCS / Monet. Is that part of the plan
  #    and when will that happen? What are the interdependencies? Can we leverage requirements or tests or both
  #    over both a Kibana / Grafana implementation vs. MCS

  # Q: How will user get from MCS to kibana / grafana dashboards?
  # A: There will be two links to the main pages of those and they can navigate from there

  @p1, @web
  Scenario: Classic MCS will have two links - Log UI and Metrics UI - in the bottom left corner with other pluggable services. It will always be visible.

  @p2, @web
  Scenario: The new MCS should include generic, global links to any third-party monitoring tools through the pluggable services framework.

  @p2, @web
  Scenario: MCS should have the ability to display charts natively on various pages. These charts should be interactive, meaning
    * Click to zoom to full-window modal
    * Select->Drag to adjust time range
    * Click on a series in the graph to drill down, potentially going to a new page

  Scenario: Storing spyglass data in MapRDB + OpenTSDB and ElasticSearch/Solr will not cause an infinite loop
  Scenario: Each node page in MCS should include a prominent link called ‘Logs’ which takes the user (in a new tab) to a node-specific dashboard in the logs GUI.
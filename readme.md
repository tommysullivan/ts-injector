Spyglass
--------

Spyglass is a product for collecting logs and metrics from a MapR cluster
and enabling historical and realtime querying and reporting of those data
in order to answer MapR cluster administrators' questions around cluster,
node and application health, performance, stability and scalability.
 
[Spyglass Google Docs & Spreadsheets](https://docs.google.com/document/d/1LR8kv0MMymI6UZ7_gnwfM_PH4LnGN9W8GM3kDz_4tf4/edit),

## Intent of this Repository

This repository is proposed to be the official home of:

1. The [requirements specification](features) for the Spyglass Product
2. The [integration tests](features/step_definitions) that verify the specification has been met
3. The [issues](https://github.com/mapr/private-spyglass/issues) that track work item status
4. The [wiki](https://github.com/mapr/private-spyglass/wiki) that contains supporting documentation
5. The [code](#) that prepares a Spyglass environment for testing purposes

## Project Delivery Plan

In order to deliver the Spyglass capability as a beta to our customers, there is much
work to be done. At a high level, this is the approach Tommy Sullivan recommends:

1. Derive github issues (use cases) from PRD & other sources
2. Categorize & Organize issues using labels and milestones
3. Drive development via Automated Testing. For each issue: 
    1. Author and agree on Definition of Done (DoD)
        1. Create a fork of the repository (if it doesn't exist)
        2. Clone the fork to your local (if it doesn't exist)
        3. Create a branch associated with the feature (if it doesn't exist)
        4. Create feature file(s) containing acceptance criteria (DoD) in "executable" Gherkin format
        5. Generate skeleton of "glue" that ties DoD in gherkin form to test / verification steps
        6. Commit to the fork, including the github issue number as an [issue mention](https://github.com/blog/957-introducing-issue-mentions)
        7. Perform a pull request to merge into the feature branch of origin
        8. Using "Conversation" about the PR, @mention stakeholders and reviewers, seeking approval to merge
    2. Propose Solution Design(s) & Choose One
        1. If necessary, perform research and prototyping within prototype subbranches of the feature
        2. Use github's social features to get feedback on different options
        3. For simpler issues, this step may be very informal or completely skipped
    3. Implement Solution
        1. Make changes across the required repositories
        2. Update step definitions to implement or update tests of those changes
        3. Once all Gherkin tests pass, follow same commit, PR procedure as was used earlier
        4. Perform a Pull Request from branch to origin/master and let repository owners pull in changes
4. Integration / Stress / Longevity / Release Testing
5. Roll up information into existing Project Plan tools / documents in non-disruptive manner

## Scope

While we will link to grafana and kibana from MCS, we will not have links to specific time periods, metrics, logs.
We will replace the UI with the new MCS (Monet). Prashant would like to have the metrics available on the dashboard 
of Monet. There are two things Prashant wants to achieve with phase one: packaging everything except for the UI to get
a robust data layer with documentation and all that. The UI is just like a "community release" to demonstrate the
power of the underlying data system.

The following systems will be out of scope for Spyglass:

MapReduce v1
Spark Standalone

## Releases

May timeframe and fall timeframe. Probably Spyglass would be released in May; but it depends on if Monet is there. If
we were to release Spyglass prior to Monet, we would link to it in a not-so-visible manner (such as where MCS
links to Resource Manager). Prashant believes that mid-January we should finalize the Spyglass plan. There is 
some installer decisions being made tomorrow. 

Dave Tucker has a python library that can call the UI installer in order to set up environments. There is a question of
whether or not the "quick installer" CLI should be deprecated with the 5.1 release. But then again there are not any
changes to quick installer for 5.1 release so it may be ok to leave it in the next release.

## Customers

UHG, Cisco, Rubicon, Comscore, MachineZone

## Risks

* Significant amount of log traffic might congest the network. perhaps we should isolate log / metrics reporting nodes 
  from the rest or ensure there are reasonable throttle limits on those computing tasks
* collectd / fluentd collect metrics from filesystem, maprdb, elastic but then send records to those systems, 
  potentially causing a loop if not careful
* querying across log and metric data and joining will not be possible under current architecture - it will be browser
  clicking back and forth and no unified view / reports / alerts. perhaps with drill in future we can offer a more 
  robust query / ui / alert engine while still allowing kibana / grafana ui and other pluggable consumers
* What are the security implications for a tool like this that shows log and metrics data that could include personal
  or sensitive data?
* What kind of scale can we expect Spyglass to support?
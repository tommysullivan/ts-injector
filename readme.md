Spyglass
--------

Spyglass is a product for collecting logs and metrics from a MapR cluster
and enabling historical and realtime querying and reporting of those data
in order to answer MapR cluster administrators' questions around cluster,
node and application health, performance, stability and scalability.

## Intent of this Repository

This repository is proposed to be the official home of:

1. The [requirements specification](features) for the Spyglass Product
2. The [integration tests](features/step_definitions) that verify the specification has been met
3. The [issues](https://github.com/mapr/private-spyglass/issues) that track work item status
4. The [wiki](https://github.com/mapr/private-spyglass/wiki) that contains supporting documentation
5. The [code](#) that prepares a Spyglass environment for testing purposes

## Team Roles & Responsibilities

Role               | Person / Team / Company
-------------------|-------------------------------------------
Customers          | UHG, Cisco, Rubicno, Comscore, MachineZone
Project Sponsor    | Suresh
Product Manager    | Prashant Rathi
Project Manager    | Leslie
Solution Architect | Todd
Developers         | Naveen
QA                 | Tommy, Vivian, Terry He

## Dependencies

* [collectd](https://github.com/mapr/private-collectd/tree/master/ext-conf)
* [kibana](https://github.com/mapr/private-kibana)
* [grafana](https://github.com/mapr/private-grafana)
* [fluentd](https://github.com/mapr/private-fluentd)
* [elasticsearch](https://github.com/mapr/private-elasticsearch)
* packaging / release repositories (?)
* installer (?)

## Links to Project Information / Status

* [Product Requirements Document (PRD)](https://docs.google.com/document/d/11EU6l3wc_yaGWgloaXjJIzhpnQicgdRlmR7C-pJJoJA/edit#heading=h.3tsrqayzbm1)
* [Technical Specification and Details](https://docs.google.com/document/d/1ZyrtCg9SexR-k_VGIo6dEU5e9wd1BrlNzFJep7k87rs/edit#heading=h.c6l8pz106k6r)	
* [Feature Status List](https://docs.google.com/spreadsheets/d/13gyxRlhiB6d_dKQc6H_i0O-nRHF19bbVjwsCd_sKXPs/edit#gid=0&vpid=A1)
* [EStaff Engg Status Update](https://docs.google.com/spreadsheets/d/1xJyr7fsCRdwZb6ZxLZ7XaulX_GXcUNyuRePxVPgtkTE/edit#gid=288618273&vpid=B2)
* [Architecture Diagrams](https://drive.google.com/open?id=0B7EWOFmgXzOZS0J3NHMtdUo5cEE)
* [Todd’s Task List](https://docs.google.com/document/d/1zae1Ie3xHLXZ7nspo5e1LvppgLd2OrDijqvUzeuRdaY/edit)
* [Leslie’s Smartsheet for Spyglass Project](https://app.smartsheet.com/b/home)

## Presentation(s)

* [Demo Presentation](https://docs.google.com/a/maprtech.com/presentation/d/1xXE0lf5Gmb-IPYF3RU5yjDgtvqysDsGn-i3bAyt8JW0/edit?usp=sharing_eid&ts=565f7cee)

## Testing

### Run the cucumber tests in this repository

After cloning this repository, and ensuring you have installed 'npm' on your system:

    npm install
    npm test
    
### Terry's Team Testing Links

* [QA Testing Effort Timeline](https://docs.google.com/spreadsheets/d/1Bn3a8WpNcYoflH9H59vvYthAzQuReYenkv07PQaso6o/edit?ts=565e1cb5#gid=0&vpid=A1)
* [QA Test Plan](https://docs.google.com/spreadsheets/d/1ymN1LxxvuPyUgf8dC6SFgu_pjDYneKodsVY6KTQol0E/edit?ts=565e1cbf#gid=0&vpid=A1)
* [Terry’s Smoke Test Setup Guide](https://docs.google.com/document/d/12VBKeMgXKhWm0qIcRlrxpSJ-1GPUq463KlaWKrDB3qU/edit?ts=56685b1a#heading=h.vgktbnvy3cxo)

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

In the PRD as of 12/11, the milestones are listed as:

* 8/30 - M1(Demo, no installation packaging, alpha/rough Kibana/Grafana dashboards)
* 9/30 - M2(QA start, includes packaging for most services, draft Kibana/Grafana dashboards)
* 10/30 - M3(Beta, complete packaging, early preview of Spyglass chart on Monet framework)
* 12/15 - M4 Final

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

## Frequently Asked Questions

* Q: Why are we building components from source or forking repositories if we are only configuring those items for the
  particular purpose of spyglass? 
* A: This is not an answer yet but just some thoughts on the question:  
  If we need to vary code (for example, open source code has a bug and we cannot
  afford to wait for the fix), we can always fork at that instant (it takes a few seconds), then go through the process
  of building an artifact and deploying it to an artifact store using a unique branch / version identifier. Is it just
  so that if we do find such a bug, we do not have to go through the preparatory steps at that time? Even if we do
  fork and build from source in order to be prepared for such a situation, we still need not put the configuration 
  which is specific to spyglass into the forked repo for the OSS. Though perhaps there is a rationale around that? It
  seems to me it would still be better to have our configuration in a spyglass repository and then pull in a built 
  version of the OSS components, even if we build them ourselves, using something like artifactory and some dependency
  management tool like gradle or maven or what have you.
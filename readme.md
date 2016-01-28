Spyglass
--------

Spyglass is a product for collecting logs and metrics from a MapR cluster
and enabling historical and realtime querying and reporting of those data
in order to answer MapR cluster administrators' questions around cluster,
node and application health, performance, stability and scalability.

## Table of Contents

* [Intent of this Repository](#intent-of-this-repository)
* [Team Roles and Responsibilities](#team-roles-and-responsibilities)
* [Solution Architecture](#solution-architecture)
* [Links](#links)
* [Scrum Development Methodology](#scrum-development-methodology)
* [Testing](#testing)
* [Infrastructure Automation](#infrastructure-automation)
* [Releases](#releases)
* [Risks](#risks)
* [Questions](#questions)

## Intent of this Repository

This repository is proposed to be the system of record for:

1. The [detail requirements specification](features) for the Spyglass Product (traceable to high level JIRAs)
2. The [integration tests](features/step_definitions) that verify the specification has been met (cucumber, ATS)
5. The [infrastructure and deployment code](#) that prepares a Spyglass environment for testing purposes (terraform, docker)

## Team Roles and Responsibilities

Role               | Person / Team / Company
-------------------|-------------------------------------------
Customers          | UHG, Cisco, Rubicno, Comscore, MachineZone
Project Sponsors   | Anil Gadre, Pinaki Mukerji, MC Srivas
Program Manager    | Leslie Lin
Product Manager    | Prashant Rathi
Solution Architect | Todd Richmond
Developers         | Naveen Tirupattur, Lars Fredriksen
Automation         | Tommy Sullivan
QA                 | Vivian Summers, Additional Resource
Scrummaster        | Rotating, start with Tommy

## Solution Architecture

Please start with [Architecture Diagrams](https://drive.google.com/open?id=0B7EWOFmgXzOZS0J3NHMtdUo5cEE) and then
see the below components that are used in Spyglass:

* [collectd](https://github.com/mapr/private-collectd/tree/master/ext-conf)
* [kibana](https://github.com/mapr/private-kibana)
* [grafana](https://github.com/mapr/private-grafana)
* [fluentd](https://github.com/mapr/private-fluentd)
* [elasticsearch](https://github.com/mapr/private-elasticsearch)
* packaging / release repositories (?)
* installer (?)
* demo / test triggers - way to cause system behaviors interesting to Spyglass Demo & Testing

## Links

#### Environment Links

At the moment there is only one environment running Spyglass, and that setup is not automated. We 
plan to manually or automatically create at least 1 test and 1 demo environment in the near term. 
For testing purposes across multiple cluster configurations, there will likely be several testing
environments set up.

* Dev
    * [Grafana](http://10.10.88.97:3000/login) use admin/admin as credentials
    * [Kibana](http://10.10.88.98:5601/) dashboards -> open folder -> demo -> choose last 24 hours
    * MCS - Not set up
    * Installer - Not set up
* Test - TBD around January 25th
    * Grafana - Not set up
    * Kibana - Not set up
    * MCS - Not set up
    * Installer - Not set up
* Demo / Acceptance - No ETA
    * Grafana - Not set up
    * Kibana - Not set up
    * MCS - Not set up
    * Installer - Not set up
    
#### Google Docs / Spreadsheets / Presentations    

* [Product Requirements Document (PRD)](https://docs.google.com/document/d/11EU6l3wc_yaGWgloaXjJIzhpnQicgdRlmR7C-pJJoJA/edit#heading=h.3tsrqayzbm1)
* [Technical Specification and Details](https://docs.google.com/document/d/1ZyrtCg9SexR-k_VGIo6dEU5e9wd1BrlNzFJep7k87rs/edit#heading=h.c6l8pz106k6r)	
* [Feature Status List](https://docs.google.com/spreadsheets/d/13gyxRlhiB6d_dKQc6H_i0O-nRHF19bbVjwsCd_sKXPs/edit#gid=0&vpid=A1)
* [EStaff Engg Status Update](https://docs.google.com/spreadsheets/d/1xJyr7fsCRdwZb6ZxLZ7XaulX_GXcUNyuRePxVPgtkTE/edit#gid=288618273&vpid=B2)
* [Todd’s Task List](https://docs.google.com/document/d/1zae1Ie3xHLXZ7nspo5e1LvppgLd2OrDijqvUzeuRdaY/edit)
* [Leslie’s Smartsheet for Spyglass Project](https://app.smartsheet.com/b/home)
* [Demo Presentation](https://docs.google.com/a/maprtech.com/presentation/d/1xXE0lf5Gmb-IPYF3RU5yjDgtvqysDsGn-i3bAyt8JW0/edit?usp=sharing_eid&ts=565f7cee)
* [Spyglass Metric Names](https://docs.google.com/spreadsheets/d/1SxKCnhT0YWdCMuiZ_sYv_ypp1le7200LsBunqcY9v7w/edit?ts=5679d1c7#gid=0)
* [Guts Documentation](https://docs.google.com/document/d/1VnX7hJIGzHMiz2IjqG743dx4j9CFkYy7ldYYN-iCTA4/edit#heading=h.i0yh4plti785)

## Scrum Development Methodology

For an overview of our methodology, please take a few moments and
[view this presentation](https://drive.google.com/open?id=14rQg8KP44om_A8k4wU-44uDQv0KeZ3_8xj8IS_be8fI)

We are using [Spyglass JIRA Project](https://maprdrill.atlassian.net/secure/RapidBoard.jspa?rapidView=3&projectKey=SPYG)
to track day to day work and reporting into [Smartsheet](https://app.smartsheet.com/b/home) for 
Program / Project Management Visibility.

JIRA is organized in the following manner:

* *Versions* are used for particular Release Versions, and contain pointed user stories
* *Points* are an abstract measure for estimating Stories - considering complexity, unknowns, and size of change
* *Components* are used to denote the "pieces of the solution"
* *There* are templates to clone for recurring tasks
  * Retrospectives
  * Planning Meetings
  * Mid Sprint Grooming
  * Team Demo
* *Labels* associate JIRA issues with:
  * Roles / Personas affected (both internal and customer roles / personas)
  * Certain types of work (planning, meeting)
  * Custom Tags (categorize freely and at will!)
* *Epics* are used when a feature's stories span multiple Sprints (avoid unless very simple hierarchical relationship)
* *Statuses* are used to move a JIRA issue through its lifecycle

For discussion on Scrum please see this [JIRA Question](https://maprdrill.atlassian.net/browse/SPYG-63)

## Testing

Please see [this high level approach to testing](https://maprdrill.atlassian.net/browse/SPYG-82) in order to get the big picture.

### Run Tests

After cloning this repository, and ensuring you have installed 'npm' on your system:

    npm install
    npm test

### Testing Links

* [QA Testing Effort Timeline](https://docs.google.com/spreadsheets/d/1Bn3a8WpNcYoflH9H59vvYthAzQuReYenkv07PQaso6o/edit?ts=565e1cb5#gid=0&vpid=A1)
* [QA High Level Plan](https://docs.google.com/spreadsheets/d/1Bn3a8WpNcYoflH9H59vvYthAzQuReYenkv07PQaso6o/edit?ts=568d60ba#gid=0)
* [QA Functional Test Plan](https://docs.google.com/spreadsheets/d/1ymN1LxxvuPyUgf8dC6SFgu_pjDYneKodsVY6KTQol0E/edit?ts=565e1cbf#gid=0&vpid=A1)
* [Terry’s Smoke Test Setup Guide](https://docs.google.com/document/d/12VBKeMgXKhWm0qIcRlrxpSJ-1GPUq463KlaWKrDB3qU/edit?ts=56685b1a#heading=h.vgktbnvy3cxo)
* [OS Support Matrix](http://doc.mapr.com/display/MapR/OS+Support+Matrix)

### Test Tagging

Features and Scenarios can be "tagged" using @tagName syntax. A tagged feature is the same thing as
tagging each individual scenario in the feature. A given feature or scenario can have any number of tags.
For more information on tagging, please see [cucumber wiki](https://github.com/cucumber/cucumber/wiki/Tags)

Here is how to run scenarios with either @p1 or @p2 tags on them:

    npm test -- --tags @p1, @p2

We can also run scenarios that have *both* @p2 and @p2 tags:

    npm test -- --tags @p1 --tags @p2

#### Traceability / Relationship Tags:

Tag Name                                         | Meaning
-------------------------------------------------|---------------------------------------
@gh-[n]                                          | relates to Github issue number [n]
@jira-[n]                                        | relates to JIRA issue number [n]
@us-[n]                                          | relates to User Story [n]
@cisco @ahg @rubicon @comscore @machinezone      | A customer-specific feature

#### Type of Testing:

Tag Name           | Meaning
-------------------|---------------------------------------------------------------------
@manual            | No plans to automate this test  
@longevity         | Indicates a longevity test
@stress            | Indicates a stress test
@performance       | Indicates a performance test
@security          | Indicates a security test
@whitebox          | the test requires knowledge / access to system internals
@browser           | includes browser testing

#### Implementation Testing Framework / Language:

Tag Name           | Meaning
-------------------|-------------------------------------------------------------
@testNG            | [Test NG](http://testng.org/doc/index.html)
@cucumber.js       | [Cucumber.js](https://cucumber.io/docs/reference/javascript)
@ats               | [MapR's QA ATS framework](https://docs.google.com/document/d/12VBKeMgXKhWm0qIcRlrxpSJ-1GPUq463KlaWKrDB3qU/edit?ts=56685b1a#heading=h.vgktbnvy3cxo)

#### Release / Priority Information:

Tag Name           | Meaning
-------------------|--------------------------------------------------------------
@deferred          | the feature is deferred and may not be released in the future
@release-M.m.p     | the test must pass for release M.m.p
@p1 @p1.5 @p2 @p3  | Priorities 1, 1.5 (1 unless technically challenging), 2 and 3
@m1 @m2 ...        | Milestone 1, 2 (as specified in [PRD Feature list](https://docs.google.com/spreadsheets/d/13gyxRlhiB6d_dKQc6H_i0O-nRHF19bbVjwsCd_sKXPs/edit#gid=0))

#### Test Lifecycle Tags: 

Tag Name           | Meaning
-------------------|---------------------------------------------------------------------------------------
@proposed          | a proposed feature that should be evaluated when time permits
@questions         | need answers to continue (if no explicit questions nearby, general explanation needed)
@draft             | it is a definite requirement but the Gherkin needs work / organizing
@wip               | the scenario / feature is actively being worked on
@awaiting-approval | the scenario / feature is ready and awaiting approval
@approved          | the product, engineering and QA representatives have approved

### Why Gherkin?

Please see [this question](https://maprdrill.atlassian.net/browse/SPYG-72)

### Why Version Control the Product Requirements?

Please see [this question](https://maprdrill.atlassian.net/browse/SPYG-69)

## Infrastructure Automation

Please see [this high level approach to infrastructure automation](https://maprdrill.atlassian.net/browse/SPYG-82) 
in order to get the big picture.

## Releases

Please see [JIRA Releases View](https://maprdrill.atlassian.net/projects/SPYG?selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page&status=unreleased)

## DevOps Pipeline

Over time, DevOps will introduce & enhance a "Software Development Pipeline", enabling higher levels of efficiency,
predictability, traceability and other desired properties to our software development practice in a cross-team, 
cross-project manner. 

While those improvements are still being planned, there are some fundamental basic things we can do which will benefit
the whole team and make it easy for Spyglass to work well with said future pipeline, regardless of its eventual
implementation details. Those have been captured as non-functional requirements in the
[devops-integration.feature](features/non-functional/devops-integration.feature) file.

## Risks

* Significant amount of log traffic might congest the network. perhaps we should isolate log / metrics reporting nodes 
  from the rest or ensure there are reasonable throttle limits on those computing tasks
* could logging cause infinite loop? [see this](https://maprdrill.atlassian.net/browse/SPYG-53)
* joining across logs and metrics not possible under current architecture [see this](https://maprdrill.atlassian.net/browse/SPYG-53)

## Questions

Questions about this project can be created / searched using [this JIRA page](https://maprdrill.atlassian.net/browse/SPYG-75?jql=Type%3DQuestion%20and%20Project%3DSpyglass)

## JIRA

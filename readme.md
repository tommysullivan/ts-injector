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
* [Installation](#installation)
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

* [collectd](https://github.com/mapr/private-collectd)
* [kibana](https://github.com/mapr/private-kibana)
* [grafana](https://github.com/mapr/private-grafana)
* [fluentd](https://github.com/mapr/private-fluentd)
* [elasticsearch](https://github.com/mapr/private-elasticsearch)
* packaging / release repositories (?)
* installer (?)
* demo / test triggers - way to cause system behaviors interesting to Spyglass Demo & Testing

## Installation

All packages will be available on MapR Repos and will be installable using MapR UI Installer. The prerequisites for running opentsdb are hbase and async hbase 1.6. It is assumed that these packages are already installed on the nodes running opentsdb. This section lists package names and the steps performed when each one is installed:

* mapr-collectd
   * installs collectd at MAPR_HOME/collectd/collectd-*
   * expected on each node
   * conf file is located at MAPR_HOME/collectd/collectd-*/etc/collectd.conf
   * changes MAPR_HOME/hadoop/hadoop-*/bin/yarn to enable jmx for RM and NM (uses ports 8025 for RM 8027 for NM) and adds         the following JMX options if this node is an RM:
      JMX_OPTS="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.authenticate=false                         -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.port"'
   * enables the section in collectd.conf between MAPR_CONF_TAG and MAPR_CONF_TAG_END and configures JMX connections for         applicable services
   * enables and configures the opentsdb plugin in collectd.conf
   * copies warden.collectd.conf to MAPR_HOME/conf/conf.d

* mapr-elasticsearch
   * installs elasticsearch in MAPR_HOME/elasticsearch/elasticsearch-*
   * expected on 3 nodes for HA will work with less (need algorithm to determine N)
   * conf file is located at 
     MAPR_HOME/elasticsearch/elasticsearch-*/etc/elasticsearch/elasticsearch.yml
   * sets the cluster.name to maprMonitoring
   * sets the network.host to node ip
   * sets path.data to directory where you want the database to be (via -ESDB option) (optional)
   * sets discovery.zen.ping.unicast.hosts to the list of elasticsearch servers
   * sets discovery.zen.minimum_master_nodes (typically odd number >= 3 for HA)
   * sets the kernel limit for vm.max_map_count to 262144 if it is less (also modifies /etc/sysctl.conf)
   * copies warden.elasticsearch.conf to MAPR_HOME/conf/conf.d
   * (manual requirement for M2) once ES is running, execute loadtemplate.sh script in the elasticsearch bin directory once per cluster to load the mapr monitoring template

* mapr-fluentd
   * installs fluentd at MAPR_HOME/fluentd/fluentd-*
   * expected on each node
   * conf files are located at
      MAPR_HOME/fluentd/fluentd/etc/es_config.conf
      MAPR_HOME/fluentd/fluentd/etc/marfs_config.conf
      MAPR_HOME/fluentd/fluentd/etc/fluentd.conf
   * configure host and port in es_config.conf
   * uncomment and configure host and port in maprfs_config.conf if global logging is turned on via the -logHTTPFS option (not fully implemented)
   * copies warden.fluentd.conf file to MAPR_HOME/conf/conf.d

* mapr-opentsdb
   * installs opentsdb at MAPR_HOME/opentsdb/opentsdb-*
   * expected on every X nodes (not determined yet). Test with 1 or more
   * conf file is located at MAPR_HOME/opentsdb/opentsdb-*/etc/opentsdb/opentsdb.conf
   * copies async hbase 1.6 jar file to MAPR_HOME/opentsdb/opentsdb-*/share/opentsdb/lib
   * updates the zookeeper information in the conf file
   * creates tsdb tables
   * copies warden.opentsdb.conf file to MAPR_HOME/conf/conf.d

* mapr-grafana
   * installs grafana at MAPR_HOME/grafana/grafana-*
   * expected on one node
   * conf file is located at MAPR_HOME/grafana/grafana-*/etc/grafana/grafana.ini
   * copies warden.grafana.conf file to MAPR_HOME/conf/conf.d
   * sets up OpenTSDB data source -- TODO

* mapr-kibana
   * installs kibana at MAPR_HOME/kibana/kibana-*
   * expected on one node
   * conf file is located at MAPR_HOME/kibana/kibana-*/config/kibana.yml
   * updates the ES host in the conf file
   * copies warden.kibana.conf file to MAPR_HOME/conf/conf.d

Example configure.sh invocation:
configure.sh -OT 10.10.10.81 -ES 10.10.10.82 -ESDB=/opt/mapr/es -R (-ESDB on ES server nodes only)

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
    
#### Running tests for all the User Stories in a JIRA release

To generate a command that you can use to run only the right subset of tags for a JIRA release, run:
    
    private-spyglass$ ./bin/run-tests-for-release
    prompt: Enter username for JIRA located at https://maprdrill.atlassian.net:  (tsullivan@maprtech.com) 
    prompt: Enter corresponding password:  
    prompt: Enter the name of the release (the value of "Fix Version"):  (1.0.alpha) 
    Run the following command to execute cucumber tests for release: 1.0.alpha
    npm test -- --tags @SPYG-126,@SPYG-125,@SPYG-124,@SPYG-123,@SPYG-1
    
You may change the default credentials, release, or JIRA hosts / paths in configuration/config.json.

Non-Interactive Mode:

    private-spyglass$ ./bin/run-tests-for-release -y -p $PASSWORD
    Run the following command to execute cucumber tests for release: 1.0.alpha
    npm test -- --tags @SPYG-126,@SPYG-125,@SPYG-124,@SPYG-123,@SPYG-1

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



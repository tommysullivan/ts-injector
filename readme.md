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
* [Builds](#)
* [Packaging](#packaging)
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
Project Sponsors   | Anil Gadre, Pinaki Mukerji
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

### Automated Installation (For Dev / Testing / Demo Purposes Only)

Please see the following links for automated installation information. Still working out some
kinks as well:

* [Docker-Based Automation](https://maprdrill.atlassian.net/browse/DEVOPS-101)
* [Installation Feature](features/installation.feature)
* [shell scripts used for testing purposes](bin)

### Manual Installation

All packages are available on MapR Repos and will be installable using MapR UI Installer. 
The prerequisites for running opentsdb are hbase and async hbase 1.6.
It is assumed that these packages are already installed on the nodes running opentsdb. 
This section lists package names and the steps performed when each one is installed:

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
   * (manual requirement for M2) once ES is running, execute es_cluster_mgmt.sh -loadTemplate <hostname> script in the elasticsearch bin directory once per cluster to load the mapr monitoring template

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
   * sets up OpenTSDB data source
   * The dashboards can be found in [the dashboards folder of this repo](dashboards). These are .json files which you can import into Grafana
   * **NOTE** Grafana does not work well with Safari!

* mapr-kibana
   * installs kibana at MAPR_HOME/kibana/kibana-*
   * expected on one node
   * conf file is located at MAPR_HOME/kibana/kibana-*/config/kibana.yml
   * updates the ES host in the conf file
   * copies warden.kibana.conf file to MAPR_HOME/conf/conf.d
   * [Manual step for M2] **After running configure.sh, when Kibana page loads on port 5601 (default port for Kibana) you will see message for "Configuring index pattern". Please enter "mapr_monitoring-*" for Index name or pattern field and "@timestamp" for Time-field name.**

#### Example configure.sh invocation:
  * configure.sh -OT 10.10.10.81 -ES 10.10.10.82 -ESDB=/opt/mapr/es -R (-ESDB on ES server nodes only)

#### Installer support
**The lastest build of the installer (2/29/2016) does now do this for you. ESDB is for now hard coded to /opt/mapr/es_db.**

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
* Test - 10.10.1.102
* Demo / Acceptance - 10.10.1.103
    
For more information on environments please see [infrastructure](lib/infrastructure)

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

## Packaging

See [this google doc](https://docs.google.com/document/d/1OEotrGYY-Ii3jqr_gz-xivKu_4tg3XlizRNqjEv3wtw/edit?ts=56b13507) for 
information on where packages are stored at various points in the lifecycle and for
various parts of the system.

## Testing

Please see [this high level approach to testing](https://maprdrill.atlassian.net/browse/SPYG-82) in order to get the big picture.

### Running Tests

#### IntelliJ IDEA Setup

Make sure the following plugins are enabled in IntelliJ Idea:

- node.js
- cucumber.js

Make sure under IntelliJ IDEA -> preferences -> Languages & Frameworks -> JavaScript that you are
set to use EcmaScript 6.0

#### Run in Jenkins

Navigate to [Integration Test Job](http://10.10.1.153:8080/job/spyglass-health-check/) and click 
"Build with Parameters". From here you can override default test parameters or go with the defaults.

#### Run Locally 

    Prerequisite: node.js 5.0 or above

After cloning this repository, from the root directory:

    npm install
    phase=[latestBuild|others] clusterUnderTestId=[id of cluster to test] npm test
    
The phase should be set to one of the phases in the repositories listed in configuration/config.json
under the "repositories" property. You may omit phase and the CLI will yield a list of the available
configured phases for your convenience.

ID of Cluster Under Test should be the id of one of the clusters defined in configuration/config.json
under the "testClusters" property. For example "tommy-cluster-1".
    
### Viewing Results

Test Runs send colored text to stdout for quick viewing, as well as store JSON in the test-results folder.

One can view using an interactive web interface by running the [CI Server](lib/test-portal/readme.md) and then
navigating to the generated URL using your browser of choice.

One may also make a REST call to "publish" or update the test result to the QA version of the CI Server.
To do that, review [the readme](lib/test-portal/readme.md)

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

#### General Rules for Running Cukes based on Tags

Here is how to run scenarios with either @tag1 or @tag2 tags on them:

    npm test -- --tags @tag1, @ptag2

We can also run scenarios that have *both* @tag1 and @tag2 tags:

    npm test -- --tags @tag1 --tags @tag2
   
Run scenarios that *do not* have a tag1:

    npm test -- --tags ~@tag1
    
#### Running tests based on JIRA issues

To run tests based on issues in JIRA, use /bin/jql-to-cuke-tags along with an inline JIRA JQL query:

    $ ./bin/jql-to-cuke-tags --username tsullivan@maprtech.com --jql "status = Proposed"
    prompt: Enter corresponding password:  
    Run the following command to execute cucumber tests:
    npm test -- --tags @SPYG-97,@SPYG-81

You will be prompted for data not provided via CLI args:

    $ ./bin/jql-to-cuke-tags
    prompt: Enter username for JIRA located at https://maprdrill.atlassian.net:  (tsullivan@maprtech.com) 
    prompt: Enter corresponding password:  
    prompt: Inline JQL or one of these preconfigured keys: (1.0.alpha,proposed):  (1.0.alpha) 
    Run the following command to execute cucumber tests:
    npm test -- --tags @SPYG-177,@SPYG-176,@SPYG-175,@SPYG-174,@SPYG-173

In the above example, rather than providing inline JQL, a "preconfigured key" was used - 1.0.alpha. This
key corresponds to a preconfigured query in the /configuration/config.json file.

Non-Interactive Mode (uses CLI args or configured defaults in configuration/config.json):

    $ ./bin/jql-to-cuke-tags -y -p $PASSWORD
    Run the following command to execute cucumber tests:
    npm test -- --tags @SPYG-177,@SPYG-176,@SPYG-175,@SPYG-174,@SPYG-173


#### Debugging Tests

To quickly see HTTP traffic going back and forth from tests, set the
configuration/config.json/debugHTTP to true. For more advanced debugging
use node debugger.

#### Traceability / Relationship Tags:

Tag Name                                         | Meaning
-------------------------------------------------|---------------------------------------
@SPYG-[n]                                        | relates to SPYG-[n] JIRA User Story
@Manual                                          | Is a Manual Test
@HealthCheck                                     | Health Check a live Spyglass Cluster
@WIP                                             | A Work in Progress (may yield bad results)
@ESXI                                            | Applicable only to ESXI-enabled Clusters

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

Questions about this project can be created / searched using 
[this JIRA page](https://maprdrill.atlassian.net/browse/SPYG-75?jql=Type%3DQuestion%20and%20Project%3DSpyglass)
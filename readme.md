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
* [Testing](features)
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

All packages are available on MapR Repos [Redhat](http://yum.qa.lab/opensource/), [Ubuntu](http://apt.qa.lab/opensource/) and will be installable using MapR UI Installer. 
The prerequisites for running opentsdb are hbase and async hbase 1.7.
It is assumed that these packages are already installed on the nodes running opentsdb. 
This section lists package names and the steps performed when each one is installed:

There is a bug in 5.1 server/configure.sh that needs to be batched before manual configuration of ES and OT works well:
Here is a snippet to do it - apply it before running server/configure.sh

    # XXX Temporarily fix bug in configure.sh -only needed if you are using 5.1
    if ! fgrep -q FixedCheckIPInList $MAPR_HOME/server/configure.sh ; then
        cp $MAPR_HOME/server/configure.sh $MAPR_HOME/server/configure.sh.sv_fix > /dev/null 2>&1
        sed -i -e "s/regex=\$currentIP'\[\[:space:\],:\\\$\]'/local host/;s/ *\[\[ \$1 =~ \$regex \]\]/  local ip/;s/ *return \$?/  \[\[ -z \"\$1\" \]\] \&\& return 1\n  for host in \${1\/\/,\/ } \; do\n    ip=\$\(getIpAddress \${host%%:\*}\)\n    \[\[ \$ip = \$currentIP \]\]\n    \[ \$? -eq 0 \] \&\& return 0\n    shift 1\n  done\n  return 1\n  \#\# FixedCheckIPInList/;s/# ConstructMapRMonitoringConfFile/ ConstructMapRMonitoringConfFile/" $MAPR_HOME/server/configure.sh
    fi

There is a bug in 5.1 where warden gets started before /opt/mapr/conf/conf.d got created, causing it not to notice files in /opt/mapr/conf/conf.d. Here is the patch to fix that:
Here is a snippet to do it - apply it before running server/configure.sh
    if grep -q 'mkdir -p \"\${INSTALL_DIR}/conf\"$' $MAPR_HOME/server/configure-common.sh ; then
        cp $MAPR_HOME/server/configure-common.sh $MAPR_HOME/server/configure-common.sh.sv_fix > /dev/null 2>&1
        sed -i -e 's/mkdir -p \${INSTALL_DIR}\/conf/mkdir -p \${INSTALL_DIR}\/conf\/conf\.d/' $MAPR_HOME/server/configure-common.sh
    fi


* mapr-collectd
   * installs collectd at MAPR_HOME/collectd/collectd-*
   * expected on each node
   * conf file is located at MAPR_HOME/collectd/collectd-*/etc/collectd.conf
   * changes MAPR_HOME/hadoop/hadoop-*/bin/yarn to enable jmx for RM and NM (uses ports 8025 for RM 8027 for NM) and adds         the following JMX options if this node is an RM:
      JMX_OPTS="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.authenticate=false                         -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.port"'
   * enables the section in collectd.conf between MAPR_CONF_TAG and MAPR_CONF_TAG_END and configures JMX connections for         applicable services
   * enables and configures the opentsdb plugin in collectd.conf
   * copies warden.collectd.conf to MAPR_HOME/conf/conf.d
   * If you have to gather metrics from more then one queue in RM. Please follow the steps listed in this JIRA      https://maprdrill.atlassian.net/browse/SPYG-333

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
   * copies async hbase 1.7 jar file to MAPR_HOME/opentsdb/opentsdb-*/share/opentsdb/lib
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

#### Example of simple manual pacakge installation (RPM):
  * Assuming core is already installed.
  * On the node where you plan to install ES & OpenTSDB
    * yum install mapr-asynchbase-1.7* mapr-elasticsearch mapr-opentsdb-2.2* mapr-grafana mapr-kibana mapr-collectd mapr-collectd-fast-jmx mapr-fluentd
  * On the node where you only plan to install the collection agents (collectd and fluentd)
    * yum install mapr-collectd mapr-collectd-fast-jmx mapr-fluentd

#### Example configure.sh invocation:
  * The configuration happens in two stages. 
  * Stage1 - initial configuration that can be done without core running
  * Stage2 - configuration that can only happen once core is up
  * configure.sh -C 10.10.10.81 -Z 10.10.10.81,10.10.10.82 -OT 10.10.10.81 -ES 10.10.10.82 -ESDB /opt/mapr/es (-ESDB on ES server nodes only) - Replace the IPs for ZK, OpenTSDB and ElasticSearch with your cluster's actual IP addresses.
  * service mapr-zookeeper start
  * service mapr-warden start
  * configure.sh -R

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

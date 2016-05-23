# Spyglass Testing Readme

Welcome to the Spyglass Testing Readme

## Table of Contents

* [Testing Scope](#testing-scope)
    * [Operating Systemd Under Test](#operating-systems-under-test)
    * [Cluster Configurations Under Test](cluster-configurations-under-test)
    * [Other Testing Variance](#other-testing-variance)
* [Set Up](#setup)
    * [IntelliJ IDEA Set Up](#intellij-idea-setup)
* [Running Tests](#running-tests)
    * [Run in Jenkins](#run-in-jenkins)
    * [Run in IntelliJ IDEA](#run-in-intellij-idea)
    * [Run from CLI](#run-from-cli)
* [Viewing Results](#viewing-results)
* [Testing Links](#testing-links)
* [Test Tagging](#test-tagging)

## Testing Scope

### Operating Systems Under Test

* CentOS 
    * 7.1 - Installation Completes, Some Tests Fail
    * 6.5 - SSH Access to Cluster Not Working
* Ubuntu 12 and 14
* SuSE 12 (core requires compatibility library, may not be installed automatically by the UI installer, Kevin can find out)

### Cluster Configurations Under Test

* Between 1 and 1000 nodes
* Node Hardware (CPU, RAM, NICs, DISKS)
* Network (Speed, Routers, Bridges, Switches, Gateways, Proxies, etc)
* Operating Systems (CentOS 6.5?, 7.0, 7.1?; SuSE 12; Ubuntu 12.04, 14.04, 16?, Others?) (Heterogenous / Homogenous)
* Prerequisites (Java, Compilers, Network Configuration, Users, Repository Configs, etc)
* MapR Core (5.1, with and without minor versions or patches; default / future 5.2, which builds?)
* ASync HBase (versions)
* YARN (versions)
* HBase maprdb common (versions)
* Streams, DB, FS (configurations)
* EcoSystem Components (versions)
* Spyglass Components (versions)

### Other Testing Variance

Other Factors by which Test Runs may Vary in Content or Result include: 

* Test Definition (automated and manual) (versions)
* Requirements Definition

## Set Up

After cloning the repository from git, make sure to run: 

    npm install
 
### IntelliJ IDEA Setup

Make sure the following plugins are enabled in IntelliJ Idea:

- node.js
- cucumber.js

Make sure under IntelliJ IDEA -> preferences -> Languages & Frameworks -> JavaScript that you are
set to use EcmaScript 6.0.

You may either use git to clone the repo and then open it as a new project in IntelliJ, or from within
IntelliJ, use VCS -> Checkout from Version Control and follow the prompts.

## Running Tests

Regardless of how you run, you will need to at least provide the following environment variables:

    phase=[latestBuild|others] \
    clusterId=[id of cluster to test] 

Some utility scripts will set defaults on your behalf if you do not specify them, but be careful
that you do not interrupt testing on the default clusters!

To see the available cluster configuration ids, run:

    bin/view-cluster-configuration.js

You can select the subset of tests to run by using [Test Tagging](#testTagging) or by listing
the .feature files in the order you'd like to run them, omitting those you wish not to run.

### Run in Jenkins

Navigate to [Integration Test Job](http://10.10.1.153:8080/job/spyglass-health-check/) and click 
"Build with Parameters". From here you can override default test parameters or go with the defaults.

### Run in IntelliJ IDEA
 
Make sure you have pulled in dependencies by running:

    npm install
 
Assuing you have installed the cucumber.js plugin for IntelliJ IDEA, you may right click on a feature
and run / debug it. You may also choose Run -> Edit Configurations to create a more specific
cucumber run configuration.

### Run from CLI

    Prerequisite: node.js 5.0 or above

After cloning this repository, from the root directory:

    npm install
    phase=[latestBuild|others] clusterId=[id of cluster to test] npm test -- [optional cucumber.js framework args]
    
The phase should be set to one of the phases in the repositories listed in configuration/config.json
under the "repositories" property. You may omit phase and the CLI will yield a list of the available
configured phases for your convenience.

ID of Cluster Under Test should be the id of one of the clusters defined in configuration/config.json
under the "clusters" property. For example "tommy-cluster-1".
    
## Viewing Results

Test Runs send colored text to stdout for quick viewing, as well as store result and config JSON in
the test-results, test-configs, and test-cli-invocations folders.

One can view using an interactive web interface by running the [CI Server](../lib/test-portal/readme.md) and then
navigating to the generated URL using your browser of choice.

One may also make a REST call to "publish" or update the test result to the QA version of the CI Server.
To do that, review [the readme](lib/test-portal/readme.md)

## Sharing Results

To share your test results to the server, you may use [the REST API](lib/test-portal/readme.md).

Alternatively, you may use:

    bin/sync-test-results-to-server.sh 
    
This script will rsync all of your results to the server, leaving any that were previously there
untouched. 

NOTE: You will need to enter the password three times, once per test result folder.

NOTE: If you have updated a local script and wish to sync it with a previous version of the
script on the server, you must use the REST API.

## Testing Links

* [QA Testing Effort Timeline](https://docs.google.com/spreadsheets/d/1Bn3a8WpNcYoflH9H59vvYthAzQuReYenkv07PQaso6o/edit?ts=565e1cb5#gid=0&vpid=A1)
* [QA High Level Plan](https://docs.google.com/spreadsheets/d/1Bn3a8WpNcYoflH9H59vvYthAzQuReYenkv07PQaso6o/edit?ts=568d60ba#gid=0)
* [QA Functional Test Plan](https://docs.google.com/spreadsheets/d/1ymN1LxxvuPyUgf8dC6SFgu_pjDYneKodsVY6KTQol0E/edit?ts=565e1cbf#gid=0&vpid=A1)
* [Terry’s Smoke Test Setup Guide](https://docs.google.com/document/d/12VBKeMgXKhWm0qIcRlrxpSJ-1GPUq463KlaWKrDB3qU/edit?ts=56685b1a#heading=h.vgktbnvy3cxo)
* [OS Support Matrix](http://doc.mapr.com/display/MapR/OS+Support+Matrix)
* [High level approach to testing](https://maprdrill.atlassian.net/browse/SPYG-82)

## Test Tagging

Features and Scenarios can be "tagged" using @tagName syntax. A tagged feature is the same thing as
tagging each individual scenario in the feature. A given feature or scenario can have any number of tags.
For more information on tagging, please see [cucumber wiki](https://github.com/cucumber/cucumber/wiki/Tags)

### General Rules for Running Cukes based on Tags

Here is how to run scenarios with either @tag1 or @tag2 tags on them:

    npm test -- --tags @tag1, @ptag2

We can also run scenarios that have *both* @tag1 and @tag2 tags:

    npm test -- --tags @tag1 --tags @tag2
   
Run scenarios that *do not* have a tag1:

    npm test -- --tags ~@tag1
    
### Running tests based on JIRA issues

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

### Traceability / Relationship Tags:

Tag Name                                         | Meaning
-------------------------------------------------|---------------------------------------
@SPYG-[n]                                        | relates to SPYG-[n] JIRA User Story
@Manual                                          | Is a Manual Test
@healthCheck                                     | Health Check a live Spyglass Cluster
@WIP                                             | A Work in Progress (may yield bad results)

## Frequently Asked Questions

### How do I Debug a Test?

To quickly see HTTP traffic going back and forth from tests, set the
configuration/config.json/debugHTTP to true. 

For more advanced debugging, use node debugger. IntelliJ IDEA has an advanced visual debugger
with traditional controls like break, jump into, watch, and immediate expression evaluation.

### Why Gherkin?

Please see [this question](https://maprdrill.atlassian.net/browse/SPYG-72)

### Why Version Control the Product Requirements?

Please see [this question](https://maprdrill.atlassian.net/browse/SPYG-69)

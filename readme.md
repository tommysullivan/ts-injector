# DevOps Automation Framework

Welcome to the DevOps Automation Framework Readme

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

After cloning the repository from git, make sure to run: 

    npm install
    npm run build
 
### IntelliJ IDEA Setup

Make sure the following plugins are enabled in IntelliJ Idea:

- node.js
- cucumber.js

Make sure under IntelliJ IDEA -> preferences -> Languages & Frameworks -> JavaScript that you are
set to use EcmaScript 6.0.

You may either use git to clone the repo and then open it as a new project in IntelliJ, or from within
IntelliJ, use VCS -> Checkout from Version Control and follow the prompts.

## Running Tests

### Considerations before running

There are many ways to run tests. The main considerations to make prior to running a test are:

1. Which features do I want to run and in which order?
2. Which clusters do I want to use for the test run? Do the features I run depend on which clusters I use?
3. What versions of all of the packages do I want to use, and from where do I want to install them, and how?
4. Do I want to save the result(s) of my tests to http://testing.devops.lab?


### Run Cucumber.js with the Test Framework

This type of run captures additional information about the cluster and the testing environment, producing
additional JSON output of the test run which may in turn be viewed at http://testing.devops.lab (or a locally
running test-portal) if the portalId environment variable is set. It can also run cucumber against several clusters
in parallel and report all of their results plus the net result.

#### Run Framework with Plain Cucumber Arguments

    > bin/devops-automation run cucumber [optional cucumber args here]
    
#### Run Framework with Plain Cucumber Arguments plus "FeatureSet"

Instead of typing out the feature files in the order you'd like to run them as a cucumber argument, one may
instead opt to run a featureSet, which uses the id of a list of feature files in the configuration/config.json file:

    > bin/devops-automation run featureSet [featureSetName] [optional cucumber args here]

### List Available Cluster Ids

    bin/devops-automation cluster ids

You can select the subset of tests to run by using [Test Tagging](#testTagging) or by listing
the .feature files in the order you'd like to run them, omitting those you wish not to run.

## Framework Setup to Install MapR
In any required folder run [ local machine or remote node ]:

    echo "registry = http://artifactory.devops.lab/artifactory/api/npm/npm-all/" > .npmrc
    npm install private-devops-automation-framework

Add your cluster details to the config file in the following location :

    ./node_modules/private-devops-automation-framework/configuration/config.json

Add you cluster details under 'clusters' section similar to the other clusters entered.
Give your cluster a unique ID.

#### Install MapR

Run the following to install MapR after the setup is complete.
NOTE: The existing repos must be removed before running this as this adds repo files under /etc/yum/* or /etc/apt/*.
      The config file has 2 parameters defaultRelease and defaultLifecyclePhase [ takes the values development, testing, staging ]
      Based on these set values the repo locations are automatically determined by the framework.

    export clusterId=<clusterID>
    export configPath=node_modules/private-devops-automation-framework/configuration/config.json
    ./node_modules/private-devops-automation-framework/bin/devops-automation run cucumber --require ./node_modules/private-devops-automation-framework/dist/support --require ./node_modules/private-devops-automation-framework/dist/step-definitions --tags @packageInstallation

This should successfully run a series of steps to install a cluster.


#### Setup ATS

ATS (Automated Test System) is a TestNG based set of Integration Tests. For more information
visit the (ATS Github Page)[https://github.com/mapr/private-qa]

After following the above steps to setup the framework. Please run the following command to setup ATS.

    export clusterId=<clusterID>
    export configPath=node_modules/private-devops-automation-framework/configuration/config.json
    ./node_modules/private-devops-automation-framework/bin/devops-automation run cucumber --require ./node_modules/private-devops-automation-framework/dist/support --require ./node_modules/private-devops-automation-framework/dist/step-definitions --tags @atsSetup

NOTE: ATS is installed on the first non-cldb node to reduce load on the CLDB.

### Run in IntelliJ IDEA
 
Make sure you have pulled in dependencies by running:

    npm install
    npm run build
 
NOTE: IntelliJ will automatically file watch and compile your typescript files if you have configured it do
do so in preferences. If you have done this, the second command is unnecessary.

Assuing you have installed the cucumber.js plugin for IntelliJ IDEA, you may right click on a feature
and run / debug it. You may also choose Run -> Edit Configurations to create a more specific
cucumber run configuration.

### Run from CLI

    Prerequisite: node.js 5.0 or above

After cloning this repository, from the root directory:

    npm install
    export clusterId=[clusterId] 
    bin/devops-automation run [cucumber | featureSet] - run either command to see more details
    
The promotionStatus should be set to one of the promotionStatuses in the repositories listed in configuration/config.json
under the "repositories" property. You may omit promotionStatus and the CLI will yield a list of the available
configured promotionStatuses for your convenience.

ID of Cluster Under Test should be the id of one of the clusters defined in configuration/config.json
under the "clusters" property. For example "tommy-cluster-1".
    
## Viewing Results

Test Runs send colored text to stdout for quick viewing, as well as store result and config JSON in
the test-results, test-configs, and test-cli-invocations folders.

One can view using an interactive web interface by running the 
[Devops Portal](https://github.com/mapr/private-devops-test-portal) and then
navigating to the generated URL using your browser of choice.

One may also make a REST call to "publish" or update the test result to the QA version of the CI Server.
To do that, review [the readme](lib/test-portal/readme.md)

## Sharing Results

Simply run bin/devops-automation run [cucumber | featureSet] with environment variable "portalId" set to
either "local" or "lab" to sync result records to either your local portal or testing.devops.lab.

To share your test results to the server, you may also use [the REST API](lib/test-portal/readme.md).

## Testing Links

* [OS Support Matrix](http://doc.mapr.com/display/MapR/OS+Support+Matrix)

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
    

### Traceability / Relationship Tags:

Tag Name                                         | Meaning
-------------------------------------------------|---------------------------------------
@DEVOPS-[n]                                      | relates to DEVOPS-[n] JIRA User Story
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

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
    node_modules/typescript/bin/tsc
 
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

### Run Cucumber.js Executable

This is the simplest and most direct way to run the tests with minimal MapR-specific framwork involved.
Depending on the tests being run, you may be prompted to enter certain environment variables.

Either install cucumber globally and run it:

    > sudo npm install -g cucumber
    > cucumber.js
    
Or use the local cucumber after doing an npm install:

    > node_modules/cucumber/bin/cucumber.js
    
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

### Run in IntelliJ IDEA
 
Make sure you have pulled in dependencies by running:

    npm install
    node_modules/typescript/bin/tsc
 
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

One can view using an interactive web interface by running the [CI Server](../lib/test-portal/readme.md) and then
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

    npm test -- --require build/features --tags @tag1, @ptag2

We can also run scenarios that have *both* @tag1 and @tag2 tags:

    npm test -- --require build/features --tags @tag1 --tags @tag2
   
Run scenarios that *do not* have a tag1:

    npm test -- --require build/features --tags ~@tag1
    

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
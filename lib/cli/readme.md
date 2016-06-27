spyglass-tester cli
-------------------

The spyglass-tester CLI can be used to manage the various capabilities of the
test suite.

# Prerequisites

Please ensure the following is installed and working in your environment:

- node.js 5.0 or above


# Installation

After pulling the source locally, execute the following:

    npm install


# Usage

Here is the general usage pattern:

    bin/devops-automation [command] [...]

Where [command] is one of the following commands and some of the commands require
additional parameters [...]

## tags

Get a list of all the unique tags in the test, which can be used to run subsets of
tests across multiple feature files using the "run tags" command

    bin/devops-automation tags
    
NOTE: There is a known defect where you must set environment variable clusterId in order
to view tags, even though tags do not depend on which cluster you use.
    
## cluster

Use this command to manage the clusters involved in testing. It has several subcommands
and takes the following form:

    bin/devops-automation cluster [subCommand] [...]

### cluster ids

List the ids of all the configured clusters. These ids can be used with the "run" command as
well as the "cluster snapshot" subcommand.

    bin/devops-automation cluster ids
    
### cluster hosting

List the ids of the clusters that contain a particular host.

    bin/devops-automation cluster hosting [hostName]
    
### cluster hosts

List the hosts for a particular cluster

    bin/devops-automation cluster hosts for [hostName]
    
### cluster config for

This shows the flattened configuration json for the requested cluster id. Since cluster
configurations can contain an optional "inheritsFrom" property with the id of the 
cluster from which it is inherited, this can be useful for viewing the "resolved" configuration
after all levels of inheritance have been resolved.

    bin/devops-automation cluster config for [clusterId]
    
### cluster versions for

This outputs a JSON "version graph" for the cluster. *NOTE* This can be a large amount
of data so it is suggested that it be piped or written to file.

    bin/devops-automation cluster versions for [clusterId]
    
### cluster power

Manage the power for each node in the cluster.

    bin/devops-automation cluster power [on|off|reset] [clusterId]
    
### cluster snapshot

This allows the user to manage the state of the clusters under test.

    bin/devops-automation cluster snapshot [action]
    
Where the following actions are supported:

#### cluster snapshot states for

Get the configured states for a cluster. (Note: There may be additional
states that are not configured. To check this, run "cluster snapshot info for ..."

    bin/devops-automation cluster snapshot states for [clusterId]
    
### featureSets

List the feature set ids which can be used with the bin/devops-automation run command. Add optional
text "in detail" to view not only the ids but the details of each feature set.

    bin/devops-automation featureSet [in detail]

### run

#### run cucumber

    bin/devops-automation run cucumber [additional pass thru args for cucumber]

#### run featureSet

    bin/devops-automation run featureSet [featureSetName]          run a suite of ordered cucumber features

# Environment Variables

    configPath=[path]        - defaults to ./configuration/config.json
    debug=[true|false]       - defaults to false - outputs full stack traces when set to true
    preventSave=[true|false] - defaults to false - will prevent automatic saving to the configured "testPortalHostAndPort"
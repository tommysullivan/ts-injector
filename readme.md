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
Project Sponsor    | Suresh Ollala
Product Manager    | Prashant Rathi
Project Manager    | Leslie Lin
Solution Architect | Todd Richmond
Developers         | Naveen Tirupattur, ???
QA                 | Tommy Sullivan, Vivian Summers, Terry He

## Spyglass Component Dependencies

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

### Run Tests

After cloning this repository, and ensuring you have installed 'npm' on your system:

    npm install
    npm test

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

#### Implementation Testing Framework / Language:

Tag Name           | Meaning
-------------------|---------------------------------------------------------------------
@testNG            | [Test NG](http://testng.org/doc/index.html)
@cucumber.js       | [Cucumber.js](https://cucumber.io/docs/reference/javascript)
@ats               | [MapR's QA ATS framework](https://docs.google.com/document/d/12VBKeMgXKhWm0qIcRlrxpSJ-1GPUq463KlaWKrDB3qU/edit?ts=56685b1a#heading=h.vgktbnvy3cxo)

#### Release / Priority Information:

Tag Name           | Meaning
-------------------|---------------------------------------------------------------------
@deferred          | the feature is deferred and may not be released in the future
@release-M.m.p     | the test must pass for release M.m.p
@p1 @p1.5 @p2 @p3  | Priorities 1, 1.5 (1 unless technically challenging), 2 and 3

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

We have chosen the plain English Gherkin language to express BDD-style requirements that double as executable
tests in a popular, test-implementation-language agnostic way that is often used for higher level
(non unit level) tests, such as user acceptance tests. The gherkin for Spyglass is located in the
[features](features) folder of this repository.

Since Gherkin can be written in a way that is agnostic of (doesn't care about) the framework or language
used to implement the underlying automated verification tests, we are free to choose any Gherkin-compatible 
implementation framework and language, or combination thereof, to implement verification tests. We can
reuse existing testing, mocking, or assertions frameworks, or even initiate distributed tests in the cloud.
We need only run Cucumber for the language of choice and feed it the gherkin, and it ties the two worlds
- the English product requirements and the automated verification test code - together automagically.

This paradigm enables a completely non-technical person to understand and agree with Engineering and QA, in
no uncertain terms, what the requirements are, in plain English, check that in to version control,
allow a review process and public comment just like any other code, and then if desired, that person can
also run a quick command or use a web-based tool to, at any given time:

* See exactly which requirements have automated tests behind them and which ones are still manual
* Of those that have automated tests, run all or a subset thereof and view results of specifically which
  English sentences were verified, problematic, or skipped due to some other problem, via
  intuitive green, red and yellow color coded text.
* These same results can be exported to numerous known interoperable test result formats for aggregation, 
  trending and viewing in other tools or in automated gating workflows.
* UUIDs for requests / invocations made by the test framework can be persisted across call stacks and
  even service calls, so that logs and metrics that are produced by the SUT can be later associated with
  the tests that caused them to be produced, which enables debugging, analysis and other capabilities
  that in turn lead to engineering and QA efficiency.

### Why Version Control the Product Requirements?

By all means product should feel free to do what they need to succeed, because version controlled gherkin will not
always be the most conducive to collaboration, quick brainstorming, and that type of thing.

That said, by version controlling the English business requirements, tests that implement them, and any code necessary
for instantiating / provisioning and preparing a system under test, however composed, given a test-run-time
configuration of such system, in a single
repository (this one), we can ensure that product, engineering and QA teams are all evolving
their understanding and expectations, code and automated tests, in a harmonious, incremental, and self-consistent
fashion with minimal date / deliverable surprises or out of sync documents floating around causing confusion.

So in other words, Product teams *should* use whatever tools they like for collaboration, brainstorming, and high
level planning and work tracking; and then when it comes down to the commit level of work tracking and
requirements explication, Product teams *should* embrace the idea of version controlling Gherkin requirements in order
to gain the benefits mentioned above, and just consider it a cost of doing business that pays off for them
in the long run (and even the short run).
    
### Terry's Team Testing Links

* [QA Testing Effort Timeline](https://docs.google.com/spreadsheets/d/1Bn3a8WpNcYoflH9H59vvYthAzQuReYenkv07PQaso6o/edit?ts=565e1cb5#gid=0&vpid=A1)
* [QA Test Plan](https://docs.google.com/spreadsheets/d/1ymN1LxxvuPyUgf8dC6SFgu_pjDYneKodsVY6KTQol0E/edit?ts=565e1cbf#gid=0&vpid=A1)
* [Terry’s Smoke Test Setup Guide](https://docs.google.com/document/d/12VBKeMgXKhWm0qIcRlrxpSJ-1GPUq463KlaWKrDB3qU/edit?ts=56685b1a#heading=h.vgktbnvy3cxo)

## Proposed Work Item Lifecycle

In order to deliver the Spyglass capability as a beta to our customers, there is much
work to be done. At a high level, this is the approach Tommy Sullivan recommends:

1. Derive github issues (use cases) from PRD & other sources
2. Categorize & Organize issues using labels and milestones
3. Drive development via Automated Testing. For each issue: 
    1. Author and agree on Definition of Done (DoD)
        * Use gherkin if possible
        * Focus on DoD accuracy and completeness
        * Use pull request conversations to review and get approval from QA, Product, Engineering
    2. Propose Solution Design(s) & Choose One
        1. If necessary, perform research and prototyping within prototype subbranches of the feature
        2. Use github's social features to get feedback on different options
        3. For simpler issues, this step may be very informal or completely skipped
    3. Implement Solution
        1. Make changes across the required repositories using reasonable branch and package version IDs
        2. Implement step definitions for Gherkin in the DoD
        3. Once all Gherkin tests pass, commit, pull request and share with reviewers like before
        4. Perform a Pull Request from branch to origin/master and let repository owners pull in changes
4. Roll up project status information into existing Project Plan tools / spreadsheets weekly, in non-disruptive manner
5. Perform Integration / Stress / Longevity / Release Testing after release 1's "code complete" date.


## Releases

Release Questions:

* Q: What are the release names / dates and scope for each?
* A: Tommy to meet with Product and QAA to try and clarify, as well as use @release-M.m.p tags to associate
     the features / scenarios with the releases that require them.   
* Q: We need updated/confirmed code complete, test dates and timelines in addition to just the final 
     release date. 
* A: See [Leslie’s Smartsheet for Spyglass Project](https://app.smartsheet.com/b/home) for that.
     Can we confirm that here?

#### Initial Release Summary as understood by Tommy after conversation with Todd:

While we will link to grafana and kibana from MCS, we will not have links to specific time periods, metrics, logs.
We will replace the UI with the new MCS (Monet). Prashant would like to have the metrics available on the dashboard 
of Monet. There are two things Prashant wants to achieve with phase one: packaging everything except for the UI to get
a robust data layer with documentation and all that. The UI is just like a "community release" to demonstrate the
power of the underlying data system.

The following systems will be out of scope for Spyglass:

* MapReduce v1
* Spark Standalone

#### Other Release Hearsay:

May timeframe and fall timeframe. Probably Spyglass would be released in May; but it depends on if Monet is there. If
we were to release Spyglass prior to Monet, we would link to it in a not-so-visible manner (such as where MCS
links to Resource Manager). Prashant believes that mid-January we should finalize the Spyglass plan. There is 
some installer decisions being made tomorrow. 

Dave Tucker has a python library that can call the UI installer in order to set up environments. There is a question of
whether or not the "quick installer" CLI should be deprecated with the 5.1 release. But then again there are not any
changes to quick installer for 5.1 release so it may be ok to leave it in the next release.

#### Releases 1 Milestones according to PRD (as of 12/11):

* 8/30 - M1(Demo, no installation packaging, alpha/rough Kibana/Grafana dashboards)
* 9/30 - M2(QA start, includes packaging for most services, draft Kibana/Grafana dashboards)
* 10/30 - M3(Beta, complete packaging, early preview of Spyglass chart on Monet framework)
* 12/15 - M4 Final

## DevOps Pipeline

Over time, DevOps will introduce & enhance a "Software Development Pipeline", enabling higher levels of efficiency,
predictability, traceability and other desired properties to our software development practice in a cross-team, 
cross-project manner. 

While those improvements are still being planned, there are some fundamental basic things we can do which will benefit
the whole team and make it easy for Spyglass to work well with said future pipeline, regardless of its eventual
implementation details. Those have been captured as non-functional requirements in the
[devops-integration.feature](blob/5-cucumber-setup/features/non-functional/longevity.feature) file.

## Risks

* Significant amount of log traffic might congest the network. perhaps we should isolate log / metrics reporting nodes 
  from the rest or ensure there are reasonable throttle limits on those computing tasks
* collectd / fluentd collect metrics from filesystem, maprdb, elastic but then send records to those systems, 
  potentially causing a loop if not careful
* querying across log and metric data and joining will not be possible under current architecture - it will be browser
  clicking back and forth and no unified view / reports / alerts. perhaps with drill in future we can offer a more 
  robust query / ui / alert engine while still allowing kibana / grafana ui and other pluggable consumers
  see [architectural implications for drill enablement whiteboard](https://drive.google.com/drive/folders/0B7EWOFmgXzOZY2NFNUNfY3V3MFE)
* What are the security implications for a tool like this that shows log and metrics data that could include personal
  or sensitive data?
* What kind of scale can we expect Spyglass to support?

## Questions

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
* Q: What precisely can we capture / not capture and how do we do that?
* A: Probably the answers are in [Technical Specification and Details](https://docs.google.com/document/d/1ZyrtCg9SexR-k_VGIo6dEU5e9wd1BrlNzFJep7k87rs/edit#heading=h.c6l8pz106k6r)
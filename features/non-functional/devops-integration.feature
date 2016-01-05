@draft @questions
Feature: Devops Integration
  As a developer
  In order to integrate the development process with MapR's DevOps Pipeline
  I comply with the several constraints

    Scenario: Write a clear "Definition of Done" for each "tracked work item"
    Scenario: Write a clear DoD, including the "Test Specification" (preferably in Gherkin), for each "tracked" work item
    Scenario: Associate each commit with the work tracking item that necessitated the commit (github issue, google sheet row, etc)
    Scenario: Obtain peer review on each commit before merging it to origin/master
    Scenario: Run a build/verification process prior to merging to origin/master that ensures the DoD has been satisfied
    Scenario: Keep a "build record", including the associated commits, output log, verification details / results, and env config
    Scenario: Publish build outputs as versioned artifacts, bidirectionally linking them to the build record which produced them
    Scenario: Consider which upstream artifacts / tests / jobs might be implicated by the publishing of said artifacts & react
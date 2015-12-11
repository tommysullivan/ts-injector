@cisco
Feature: Jobs Health

  Scenario: How can I quickly look at job logs for errors?
  Scenario: Why did a job fail? Was it an error in the code or an issue in the cluster?
  Scenario: Why was a job slow? Was the cluster fully utilized? Did the user submitting the job hit a quota? Was the queue full of another user's jobs?
  Scenario: Job specific logs and metrics for troubleshotting. User / admin puts job id into fields and charts appear for job metrics (containers used over time, transfer rates, other) as well as stdout/stderr for the job with ability to filter errors, warnings, or arbitrary strings.

  @cisco
  Scenario: Tenant-oriented job monitoring

  @cisco
  Scenario: How to tell if users jobs are slow because of
    * a bad job
    * busy cluster
    * reached quote of simultaneous mappers

  @cisco
  Scenario: Resources consumed by the same job over time

  @cisco
  Scenario: End user visibility into job logs outside of MCS

  @cisco
  Scenario: Validation
    * It is too easy to crash JobTracker, perhaps some kind of validation can mitigate this?

  @rubicon
  Scenario: Task monitoring and failure tracking / causal analysis

  @rubicon
  Scenario: What made cluster nodes run out of memory yesterday?

  @UHG
  Scenario: Show 3 biggest jobs
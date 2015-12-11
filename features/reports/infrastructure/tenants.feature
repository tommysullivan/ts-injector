@cisco
Feature: Tenants / User specific Dashboards
  Scenario: How many resources did a tenant consume on a given day, week, month (compute, mem, io or storage) - needed for billing
  Scenario: Evaluate fairness, is one tenant taking more than share?
  Scenario: Number of jobs / apps submitted and cluster resources consumed in combined view (YARN, MR, Spark, Impala, Drill, etc)
  Scenario: Historical storage consumption for tenant
  Scenario:
    Given that cluster is low on or ran out of resources
    When I check to see which tenant contributed most to this situation
    Then I get a reliable answer
  Scenario: User / tenant can log into Spyglass to see information that only pertains to them (storage, aggregate service, and app/job dashboards)

  @cisco @UHG
  Scenario: Admin can tell total cluster utilization by tenant
    * Internal billing / chargeback - make tenants pay for what they use
    * Trending - allow them to predict future utilization and plan cluster expansion
    * Troubleshooting - when tenants call with problems, they want tools to determin what contributed to the problem

  @UHG
  Scenario: Tenants should be able to self-service monitor - cpu, mem, disk metrics per user

  @UHG
  Scenario: Ability to track "GL code" which is billing code for a tenant
    * Volumes and YARN queues have GL codes
    * Track cpu, memory, io per GL code
    * Note - this would involve figuring out what jobs ran through which queues (to map them to GL code) then chart the cpu, mem, io consumed by those jobs
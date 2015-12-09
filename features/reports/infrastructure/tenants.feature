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

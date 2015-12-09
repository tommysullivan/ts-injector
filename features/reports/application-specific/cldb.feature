Feature: CLDB

  @p1 @logs
  Scenario: CLDB logs

# CLDB provides a lot of information about the nodes in hdfs and containers, such as location, health,
# and information about what is on them. So, I don't know if we are going to just query this information or
# if we actually want logs and metrics about the performance of CLDB itself, or both?
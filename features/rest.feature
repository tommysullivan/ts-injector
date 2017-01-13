Feature: REST

  @rest
  Scenario: Verify Server Side REST Refactor
    Given all health checkable services are healthy
#    Manual Steps:
#      elasticsearch rest client (not the lib but the one used in spyg tests)
#      grafana rest client
#      opentsdb query
#    Deferrable Manual Steps (do if these items become in use):
#      Installer REST Client
#      grafana dashboard import
#      installer REST client log retrieval (plain text get)
#      installer save configuration
#      installer state change

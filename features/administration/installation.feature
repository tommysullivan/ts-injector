@draft @p1
Feature: Installation

  # Product Questions:
  # Q: What are the details of how spyglass ui installer would work? (see below scenarios for details)
  # Q: What versions and OS's are supported in each beta
  # A: Prashant will ask this in the beta questionnaire and get back to us
  # Q: Will we support spyglass on "secure cluster"? (auth via mapr login / kerberos plus tickets)
  # A: Maybe? Very unclear and sounds like there are some open quesitons about it

  # Technical Questions:
  # Q: Can we get this sooner? The earlier we can get it, the easier it is to install and udpate the test
  #    environment as the software continues to be developed. We can parallelize work earlier. We also
  #    want a separate demo / acceptance environment so that both QA and dev are not interfered with and so
  #    that demos are not risked due to ongoing changes from testing and development processes.

  Scenario: Select / Deselect Spyglass as a Component within GUI Installer
    Given I am using "~> 5.1.0" of the GUI installer
    When I arrive at the component selection
    Then I can select "Spyglass" as a component

  Scenario: See / move location of "Spyglass Components"
    * These may be named generically ie "Spyglass Collector" and "Spyglass Data Store"
    * These may be named using implementation detail component names ie "collectd" and "ElasticSearch"
    * There may be constraints on where these live, which would need to be implemented server and/or client side
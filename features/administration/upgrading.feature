@draft
Feature: Upgrading

  # Product Questions
  # Q: What does the UI look like for this?
  # Q: How robust is the upgrade? Do we expect data / report definitions / configurations to persist?
  # Q: Can we overwrite a given installation as if it was fresh, during an upgrade?
  # Q: How will manual upgraders / installers know how to deal with Spyglass?

  # Technical Questions
  # Q: How does data persist between upgrades? (configuration, un-indexed logs / metrics, stored data, report configs)
  # Q: What about version changes of dependencies of Spyglass or components of Spyglass themselves? What if the
  #    schema they expect for configuration or data has changed since the version they are upgrading from?

  Scenario: Upgrade Easy Path
  Scenario: Advanced Upgrade Paths
Feature: Feature Sets
  As a framework user
  In order to specify an ordered list of feature files to run with minimal repetition
  I define a FeatureSet and its contents, which are either feature files or other feature sets

  @regression
  Scenario: 2-level recursive Feature Set
    Given I have defined feature sets configuration thusly:
    """
    [
      {
        "id": "root",
        "features": [
          { "file": "features/root.feature" },
          { "featureSetRef": "child" }
        ]
      },
      {
        "id": "child",
        "features": [
          { "file": "features/child.feature" },
          { "featureSetRef": "grandchild" }
        ]
      },
      {
        "id": "grandchild",
        "features": [
          { "file": "features/grandchild1.feature" },
          { "file": "features/grandchild2.feature" }
        ]
      }
    ]
    """
    When I query for a json array of feature files names for the "root" feature set
    Then I get a json array that looks like this:
    """
    [
      "features/root.feature",
      "features/child.feature",
      "features/grandchild1.feature",
      "features/grandchild2.feature"
    ]
    """
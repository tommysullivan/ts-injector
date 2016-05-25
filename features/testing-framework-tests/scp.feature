Feature: SCP

  #10.10.99.70 fails auth
  #10.10.30.147 works

  Scenario: Upload
    When I scp "/Users/tsullivan/projects/private-spyglass/data/fixtures/esxi-snapshot.txt" to "10.10.30.147" at path "/tommy"

  Scenario: Download
    When I download "/tommy/download-test.txt" from "10.10.30.147" to "/Users/tsullivan/projects/private-spyglass/data/tmp/wtf.txt"
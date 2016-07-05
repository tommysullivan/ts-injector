Feature: SCP

  #10.10.99.70 fails auth
  #10.10.30.147 works

  Scenario: Upload
    When I scp "./data/fixtures/esxi-snapshot.txt" to "10.10.30.147" at path "/tommy"

  Scenario: Download
    When I download "/root/.profile" from "10.10.30.147" to "./data/tmp/cldb.key"

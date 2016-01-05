@draft @questions
Feature: Audit Logs
# According to PRD - pending input from Mitesh

  @p1
  Scenario: Audit Log log data
    * File, Cluster, maprcli. All logs should be indexed only "post-converstion", when fids,
    * uids, and gids are converted to filenames, usernames, and groupnames.
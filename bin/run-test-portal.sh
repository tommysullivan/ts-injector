#!/bin/bash

#NOTE: Set jiraUsername / jiraPassword ENV variables if "with jira" is used in the commands below
#or, remove those words to run the server to disable JIRA integration

#Development
DEBUG=express:* nodemon --ignore 'data' bin/spyglass-tester server #with jira

#Production
#DEBUG=express:* forever start bin/spyglass-tester server with jira
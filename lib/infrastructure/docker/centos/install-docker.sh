#!/bin/bash
yum update -y
curl -fsSL https://get.docker.com/ | sh
service docker start
#!/bin/bash
yum install -y mapr-collectd mapr-elasticsearch mapr-fluentd mapr-opentsdb mapr-grafana mapr-kibana
/opt/mapr/server/configure.sh -Z 10.10.88.18 -C 10.10.88.18 -OT 10.10.88.18 -ES 10.10.88.18 -R
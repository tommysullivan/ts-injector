#!/bin/bash

# Run this on the Single Node Cluster as root

apt-get install -y mapr-collectd mapr-elasticsearch mapr-fluentd mapr-opentsdb mapr-grafana mapr-kibana
/opt/mapr/server/configure.sh -Z `hostname -I` -C `hostname -I` -OT `hostname -I`8 -ES `hostname -I` -R
/opt/mapr/elasticsearch/elasticsearch-2.1/bin/loadtemplate.sh `hostname -I`
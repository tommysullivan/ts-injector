#!/bin/bash

# Run this on the Single Node Cluster as root

yum install -y mapr-collectd mapr-elasticsearch mapr-fluentd mapr-opentsdb mapr-grafana mapr-kibana
/opt/mapr/server/configure.sh -Z `hostname -I` -C `hostname -I` -OT `hostname -I`8 -ES `hostname -I` -R
#/opt/mapr/elasticsearch/elasticsearch-2.2/bin/loadtemplate.sh `hostname -I`
/opt/mapr/elasticsearch/elasticsearch-2.2/bin/es_cluster_mgmt.sh -loadTemplate
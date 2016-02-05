#!/bin/bash

apt-get install -y curl
curl http://apt.qa.lab/installer-master-ui/mapr-setup.sh > /tmp/mapr-setup.sh
chmod 744 /tmp/mapr-setup.sh
echo `hostname -I`    `hostname` >> /etc/hosts

/tmp/mapr-setup.sh -u http://apt.qa.lab/installer-master-ui/ http://apt.qa.lab/mapr/ http://apt.qa.lab/opensource/

#Manual: install async hbase, hbase maprdb common and yarn
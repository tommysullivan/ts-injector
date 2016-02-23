#!/bin/bash
yum install -y curl
curl http://yum.qa.lab/installer-master-ui/mapr-setup.sh > /tmp/mapr-setup.sh
chmod 744 /tmp/mapr-setup.sh
echo `hostname -I`    `hostname` >> /etc/hosts
/tmp/mapr-setup.sh -u http://yum.qa.lab/installer-master-ui/ http://yum.qa.lab/mapr/ http://yum.qa.lab/opensource/

#Manual: install async hbase, hbase maprdb common and yarn
#!/bin/bash
echo "10.10.1.102 qa-cnode102.lab qa-cnode102" >> /etc/hosts
yum update
yum install -y curl
curl http://yum.qa.lab/installer-master-ui/mapr-setup.sh > /tmp/mapr-setup.sh
chmod 744 /tmp/mapr-setup.sh
/tmp/mapr-setup.sh -u http://yum.qa.lab/installer-master-ui/ http://yum.qa.lab/mapr/ http://yum.qa.lab/opensource/
#install async hbase, hbase maprdb common and yarn
FROM centos:7
MAINTAINER "Tommy Sullivan" <tsullivan@maprtech.com>
RUN curl http://yum.qa.lab/installer-master-ui/mapr-setup.sh > /tmp/mapr-setup.sh && \
    chmod 744 /tmp/mapr-setup.sh && \
    /tmp/mapr-setup.sh -u http://yum.qa.lab/installer-master-ui/ http://yum.qa.lab/mapr/ http://yum.qa.lab/opensource/
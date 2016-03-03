# Spyglass Testing Readme

## Team Members and Schedule

Vivian 11-7:30pm
Tommy 930-6pm
Anisha 10-630pm

## Operating Systems

CentOS 6.5, 7.1 (7.0 had security issues so people are advised to use 7.1)
Ubuntu 12 and 14
SuSE 12 (core requires compatibility library, may not be installed automatically by the UI installer, Kevin can find out)

## Team Dynamic

We will pair between 50% and 75% of the time we spend on Spyglass.

## Spyglass System Under Test "Stack":

Between 1 and 1000 nodes
Node Hardware (CPU, RAM, NICs, DISKS)
Network (Speed, Routers, Bridges, Switches, Gateways, Proxies, etc)
Operating Systems (CentOS 6.5?, 7.0, 7.1?; SuSE 12; Ubuntu 12.04, 14.04, 16?, Others?) (Heterogenous / Homogenous)
Prerequisites (Java, Compilers, Network Configuration, Users, Repository Configs, etc)
MapR Core (5.1, with and without minor versions or patches; default / future 5.2, which builds?)
ASync HBase (versions)
YARN (versions)
HBase maprdb common (versions)
Streams, DB, FS (configurations)
EcoSystem Components (versions)
Spyglass Components (versions)
 ---
Test Definition (automated and manual) (versions)
Requirements Definition

## Priorities

* Installation  
    * Centos
        * [SPYG-183](https://maprdrill.atlassian.net/browse/SPYG-183) Sprint 2 Story - Install and view simple logs and metrics on 3 node cluster
        * [SPYG-192](https://maprdrill.atlassian.net/browse/SPYG-192) Sprint 1 and 2 Story - MCS 3P UI Links - Ubuntu 12.04
        * [SPYG-207](https://maprdrill.atlassian.net/browse/SPYG-207) Sprint 1 and 2 Story - Kibana 1st Log - Ubuntu 12.04
        * [SPYG-210](https://maprdrill.atlassian.net/browse/SPYG-210) Sprint 1 and 2 Story - Grafana 1st Metric - Ubuntu 12.04
        * and related bugs
    * Ubuntu
        * [SPYG-278](https://maprdrill.atlassian.net/browse/SPYG-278) Defect - opentsdb uninstallable on ubuntu 14 running 5.2 - gnuplot
        * [SPYG-203](https://maprdrill.atlassian.net/browse/SPYG-203) Defect - ES is not running after installation 
        * and related bugs
    * Installer
        * [SPYG-282](https://maprdrill.atlassian.net/browse/SPYG-282) NEW FEATURE - Story - Basic UI Installer
        * (maybe after Metrics and Logs tickets are completed)
* Metrics 
    * Storage Utilization
        * [SPYG-152](https://maprdrill.atlassian.net/browse/SPYG-152) Sprint 2 Story - Storage Utilization vs Capacity
        * [SPYG-153](https://maprdrill.atlassian.net/browse/SPYG-153) Sprint 2 Story - Storage Utilization Trend
        * [SPYG-177](https://maprdrill.atlassian.net/browse/SPYG-177) Sprint 2 Story - Storage Utilization  - Tagged by Volume 
    * Node Utilization
        * [SPYG-166](https://maprdrill.atlassian.net/browse/SPYG-166) Sprint 2 Story - Node Utilization - CPU
        * [SPYG-167](https://maprdrill.atlassian.net/browse/SPYG-167) Sprint 2 Story - Node Utilization - Memory
        * [SPYG-168](https://maprdrill.atlassian.net/browse/SPYG-168) Sprint 2 Story - Node Utilization - network
        * [SPYG-170](https://maprdrill.atlassian.net/browse/SPYG-170) Sprint 2 Story - Node Utilization - Swap
        * [SPYG-172](https://maprdrill.atlassian.net/browse/SPYG-172) Sprint 2 Story - Node Utilization - YARN containers
* Logs
    * Core Logs from every node
        * [SPYG-176](https://maprdrill.atlassian.net/browse/SPYG-176) Sprint 2 Story - Node Utilization - Service Logs
    * Core logs across all services
        * [SPYG-175](https://maprdrill.atlassian.net/browse/SPYG-175) Sprint 2 Story - Service Failure - Logs Dashboard
@p2 @m4 @browser
Feature: Native Global (Metrics) Dashboard

  * Line w/view finder chart. Cluster average + up to 4 outliers. Click an outlier series to be taken to the page for that node:
  ** CPU Utilization Percentage
  ** Memory Utilization Percentage
  ** I/O Throughput (Read+Write)
  ** I/O Ops (Read+Write)
  ** DB Ops (R+W Get, Put, Scan)
  ** Network Throughput (Send+Recv)
  * Line w/view finder chart -
  ** YARN Containers (allocated, pending)
  * Stacked Area Chart:
  ** Storage Utilization Trend - largest 5 volumes plus ‘other volumes’.
  * Donut Chart:
  ** Storage Utilization By Volume - largest 9 volumes plus ‘other’.
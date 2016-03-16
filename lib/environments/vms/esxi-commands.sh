#!/bin/bash

#ssh to hypervisor
#hypervisor passwords tend to be maprwins or maprmapr

#list all vm
vim-cmd vmsvc/getallvms

#remove a snapshot
vim-cmd vmsvc/snapshot.remove [vmId] [snapshotId]

#create a snapshot
vim-cmd vmsvc/snapshot.create [vmId] [snapshotName]

#list the snapshot for vm id vmId
vim-cmd vmsvc/get.snapshotinfo [vmId]

#command to revert
vim-cmd vmsvc/snapshot.revert [vmId] [snapshotId] 0

#to power on VM
vim-cmd vmsvc/power.on [vmId]
#!/bin/bash

#ssh to hypervisor
ssh root@10.10.1.100
#password is maprwins

#list all vm
vim-cmd vmsvc/getallvms

#list the snapshot for vm id 1187
vim-cmd vmsvc/get.snapshotinfo 1187

#command to revert
vim-cmd vmsvc/snapshot.revert 1187 3 0

#to power on VM
vim-cmd vmsvc/power.on 1187
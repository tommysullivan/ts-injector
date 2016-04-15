#!/bin/bash

#
# Requires words package to be installed
#
WORK_DIR="$HOME/maprdb_work/"
LCK_FILE="$WORK_DIR/run_load_test.lck"
NOW=$(date "+%H:%M:%S %d/%m/%Y")


nRows=10000
sleepTime=100
batchSize=1000
seedSize=100

if [ ! -e /usr/share/dict/words ]; then
    echo "words not installed!!"
    exit 1
fi
mkdir -p $WORK_DIR > /dev/null 2>&1
if [ ! -e "$LCK_FILE" ]; then
    touch "$LCK_FILE"
    echo "$NOW: RUNNING LOADTEST" >> $WORK_DIR/load_test_results.txt
    #skipping delete for now
    #for mode in put scan get delete append incr rowcount cmpswap ; do
    for mode in put scan get append incr rowcount cmpswap ; do
        /opt/mapr/server/tools/loadtest -mode $mode -table /t1 -numrows $nRows -batchsize $batchSize -seed $seedSize > $WORK_DIR/load_$mode.out 2>&1
        sleep $sleepTime
    done
    
    END=$(date "+%H:%M:%S %d/%m/%Y")
    
    echo "$END: FINISHED RUNNING LOADTEST" >> $WORK_DIR/load_test_results.txt
    rm -f "$LCK_FILE"

else 
    echo "$NOW: LOADTEST ALREADY RUNNING" >> $WORK_DIR/load_test_results.txt
fi

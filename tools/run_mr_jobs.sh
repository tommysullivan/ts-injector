#!/bin/bash
WORK_DIR="$HOME/hadoop_work/"
LCK_FILE="$WORK_DIR/run_jobs.lck"
HADOOPVER=$(cat /opt/mapr/hadoop/hadoopversion)
NOW=$(date "+%H:%M:%S %d/%m/%Y")
LOAD=3
QUEUE=""

case $1 in 
    -a)
        QUEUE="-D mapreduce.job.queuename=alpha"
        ;;
esac

mkdir -p $WORK_DIR > /dev/null 2>&1
if [ -n "$HADOOPVER" ]; then
    if [ ! -e "$LCK_FILE" ]; then
        touch "$LCK_FILE"
        echo "$NOW: RUNNING JOBS" >> $WORK_DIR/run_jobs_results.txt
        for i in $(seq 1 $LOAD); do
           hadoop jar /opt/mapr/hadoop/hadoop-${HADOOPVER}/share/hadoop/mapreduce/hadoop-mapreduce-examples-${HADOOPVER}-mapr-*.jar sleep $QUEUE -m 10 -mt 1000 -r 10 -rt 1000 > $WORK_DIR/job$i.out 2>&1 &
        done
        wait
        END=$(date "+%H:%M:%S %d/%m/%Y")
        
        echo "$END: FINISHED RUNNING JOBS" >> $WORK_DIR/run_jobs_results.txt
        rm -f "$LCK_FILE"
    
    else 
        echo "$NOW: RUN JOBS ALREADY RUNNING" >> $WORK_DIR/run_jobs_results.txt
    fi
else
    echo "$NOW: Hadoop not installed??" >> $WORK_DIR/run_jobs_results.txt
fi

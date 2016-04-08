#!/bin/bash
if [ -z "$HOST" ] || ! ping -c 1 -q "$HOST" > /dev/null 2>&1 ; then
        messenger $ERROR "Hostname ($HOST) cannot be resolved. Correct the problem and re-run $CMD"
fi

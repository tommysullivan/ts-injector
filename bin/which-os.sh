#!/bin/bash

if [ -f /etc/redhat-release ]; then
    echo "Red Hat"
elif [ -f /etc/SuSE-release ]; then
    echo "SuSE"
elif uname -a | grep -q -i "ubuntu"; then
    echo "Ubuntu"
elif [ $(uname -s) = "Darwin" ]; then
    echo "Mac OSX"
else
    echo "Unknown OS"
fi
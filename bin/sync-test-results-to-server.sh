#!/usr/bin/env bash
rsync --ignore-existing -a ./test-results/ root@10.10.1.101:/root/private-spyglass/test-results
rsync --ignore-existing -a ./test-configs/ root@10.10.1.101:/root/private-spyglass/test-configs
rsync --ignore-existing -a ./test-cli-invocations/ root@10.10.1.101:/root/private-spyglass/test-cli-invocations
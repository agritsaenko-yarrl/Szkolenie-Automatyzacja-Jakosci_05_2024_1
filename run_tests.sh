#!/bin/bash

### Script to balance docker containers during cypress tests execution ###

# Function that will run a cypress test in a docker container
run_cypress_test() {
    local test_file=$1
    local container_id

    container_id=$(docker run -d cypress-image cypress run --spec "$test_file")
    if ! docker wait "$container_id"; then
        echo "Failed to wait for container $container_id"
        docker rm -f "$container_id"
    fi

    docker cp "$container_id:/app/cypress/reports/mocha/." "cypress/reports/mocha"
    docker rm -f "$container_id"
}

# Clean up existing reports directory
rm -rf cypress/reports
mkdir cypress/reports

# Vars section for all tests and max containers
ALL_TESTS=$(find . -name '*.cy.js')
MAX_CONTAINERS=3

# Array to store PIDs
declare -a PIDS=()

# Loop though all tests and run 'em
for test in $ALL_TESTS; do
    run_cypress_test "$test" &
        PIDS+=("$!")

    if [ "${#PIDS[@]}" -ge "${MAX_CONTAINERS}" ]; then
        wait -n
        for i in "${!PIDS[@]}"; do
            if ! kill -0 "${PIDS[i]}"; then
                unset "PIDS[i]"
            fi
        done
        PIDS=("${PIDS[@]}")
    fi
done

# Wait for all containers
wait "${PIDS[@]}"

# Report generation
npm run combine-reports && npm run generate-report
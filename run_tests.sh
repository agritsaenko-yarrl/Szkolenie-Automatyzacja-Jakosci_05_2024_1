#!/bin/bash

### Script to balance docker containers during cypress tests execution ###

# Function that will run a cypress test in a docker container
run_cypress_test() {
    local test_file=$1
    local container_id

    # Run the container and get its ID
    if ! container_id=$(docker run -d cypress-image cypress run --spec "$test_file"); then
        echo "Failed to start container for $test_file"
        return 1
    fi

    # Wait for the container to finish
    if ! docker wait "$container_id"; then
        echo "Failed to wait for container $container_id"
        docker rm -f "$container_id"
        return 1
    fi

    # Copy the JSON report file from the Docker container to the local machine
    if ! docker cp "$container_id:/app/cypress/reports/mocha/." "./cypress/reports/mocha"; then
        echo "Failed to copy report from container $container_id"
        docker rm -f "$container_id"
        return 1
    fi

    # Remove the container
    if ! docker rm "$container_id"; then
        echo "Failed to remove container $container_id"
        return 1
    fi
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
            if ! kill -0 "${PIDS[i]}" 2>/dev/null; then
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
#!/bin/bash

# Bitcoin Zombies - Arch Program Test Runner
# This script runs tests for all Arch program lessons

set -e

echo "🧟‍♂️ Bitcoin Zombies - Running Arch Program Tests"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests for a specific lesson
run_lesson_tests() {
    local lesson_dir=$1
    local lesson_name=$(basename "$lesson_dir")
    
    echo -e "\n${YELLOW}Testing lesson: $lesson_name${NC}"
    echo "--------------------------------"
    
    if [ -d "$lesson_dir" ]; then
        cd "$lesson_dir"
        
        # Check if Cargo.toml exists
        if [ -f "Cargo.toml" ]; then
            echo "Running cargo check..."
            if cargo check; then
                echo -e "${GREEN}✓ Compilation check passed${NC}"
            else
                echo -e "${RED}✗ Compilation check failed${NC}"
                return 1
            fi
            
            echo "Running tests..."
            if cargo test; then
                echo -e "${GREEN}✓ All tests passed${NC}"
            else
                echo -e "${RED}✗ Some tests failed${NC}"
                return 1
            fi
        else
            echo -e "${RED}✗ No Cargo.toml found in $lesson_dir${NC}"
            return 1
        fi
        
        cd - > /dev/null
    else
        echo -e "${RED}✗ Lesson directory $lesson_dir does not exist${NC}"
        return 1
    fi
}

# Main execution
main() {
    local script_dir=$(dirname "$0")
    local project_root=$(cd "$script_dir/.." && pwd)
    
    echo "Project root: $project_root"
    
    # Find all lesson directories
    local lessons_dir="$project_root/arch-lessons"
    local failed_lessons=()
    local passed_lessons=()
    
    if [ -d "$lessons_dir" ]; then
        for lesson_dir in "$lessons_dir"/*; do
            if [ -d "$lesson_dir" ]; then
                if run_lesson_tests "$lesson_dir"; then
                    passed_lessons+=($(basename "$lesson_dir"))
                else
                    failed_lessons+=($(basename "$lesson_dir"))
                fi
            fi
        done
    else
        echo -e "${RED}✗ Lessons directory not found: $lessons_dir${NC}"
        exit 1
    fi
    
    # Summary
    echo -e "\n${YELLOW}Test Summary${NC}"
    echo "============="
    
    if [ ${#passed_lessons[@]} -gt 0 ]; then
        echo -e "${GREEN}Passed lessons (${#passed_lessons[@]}):${NC}"
        for lesson in "${passed_lessons[@]}"; do
            echo -e "  ${GREEN}✓ $lesson${NC}"
        done
    fi
    
    if [ ${#failed_lessons[@]} -gt 0 ]; then
        echo -e "${RED}Failed lessons (${#failed_lessons[@]}):${NC}"
        for lesson in "${failed_lessons[@]}"; do
            echo -e "  ${RED}✗ $lesson${NC}"
        done
        exit 1
    fi
    
    echo -e "\n${GREEN}🎉 All tests passed! Ready to learn Arch programming!${NC}"
}

# Run main function
main "$@" 
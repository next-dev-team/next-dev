#!/bin/bash

# Configuration
SUBMODULE_URL="https://github.com/next-dev-team/next-gen"
SUBMODULE_PATH="turbo"  # Where to place the submodule
BRANCH="turbo"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Add submodule with sparse checkout
add_submodule() {
    log_info "Adding submodule: $SUBMODULE_URL (sparse: $SPARSE_PATH)"
    
    if [ -d "$SUBMODULE_PATH" ]; then
        log_warn "Path $SUBMODULE_PATH already exists"
        return 1
    fi
    
    # Add submodule
    git submodule add -b "$BRANCH" "$SUBMODULE_URL" "$SUBMODULE_PATH"
    
    # Configure sparse checkout
    cd "$SUBMODULE_PATH" || exit 1
    git config core.sparseCheckout true
    echo "$SPARSE_PATH/*" > .git/info/sparse-checkout
    git read-tree -mu HEAD
    cd - > /dev/null || exit 1
    
    git add .gitmodules "$SUBMODULE_PATH"
    git commit -m "Add $SUBMODULE_PATH submodule (sparse: $SPARSE_PATH)"
    
    log_info "Submodule added successfully with sparse checkout!"
}

# Initialize and update submodule
init_submodule() {
    log_info "Initializing and updating submodule..."
    git submodule init
    git submodule update
    log_info "Submodule initialized!"
}

# Update submodule to latest
update_submodule() {
    log_info "Updating submodule to latest commit..."
    cd "$SUBMODULE_PATH" || exit 1
    git pull origin "$BRANCH"
    cd - > /dev/null || exit 1
    git add "$SUBMODULE_PATH"
    git commit -m "Update $SUBMODULE_PATH submodule"
    log_info "Submodule updated!"
}

# Show submodule status
status_submodule() {
    log_info "Submodule status:"
    git submodule status
}

# Remove submodule
remove_submodule() {
    log_info "Removing submodule: $SUBMODULE_PATH"
    git submodule deinit -f "$SUBMODULE_PATH"
    rm -rf ".git/modules/$SUBMODULE_PATH"
    git rm -f "$SUBMODULE_PATH"
    git commit -m "Remove $SUBMODULE_PATH submodule"
    log_info "Submodule removed!"
}

# Show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  add     - Add the submodule"
    echo "  init    - Initialize existing submodule"
    echo "  update  - Update submodule to latest"
    echo "  status  - Show submodule status"
    echo "  remove  - Remove the submodule"
    echo ""
}

# Main script
COMMAND=${1:-add}

case "$COMMAND" in
    add)
        add_submodule
        ;;
    init)
        init_submodule
        ;;
    update)
        update_submodule
        ;;
    status)
        status_submodule
        ;;
    remove)
        remove_submodule
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        show_usage
        exit 1
        ;;
esac
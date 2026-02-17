#!/bin/bash
# Build script for Acronym Tooltip Chrome Extension
# Copies source files into dist/ directory for Chrome to load

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"

echo "Building Acronym Tooltip extension..."

# Clean previous build
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy manifest
cp "$SCRIPT_DIR/manifest.json" "$DIST_DIR/"

# Copy source files preserving directory structure
cp -r "$SCRIPT_DIR/src/background" "$DIST_DIR/background"
cp -r "$SCRIPT_DIR/src/content" "$DIST_DIR/content"
cp -r "$SCRIPT_DIR/src/popup" "$DIST_DIR/popup"
cp -r "$SCRIPT_DIR/src/options" "$DIST_DIR/options"
cp -r "$SCRIPT_DIR/src/shared" "$DIST_DIR/shared"

# Copy icons
cp -r "$SCRIPT_DIR/icons" "$DIST_DIR/icons"

# Package for Chrome Web Store
ZIP_FILE="$SCRIPT_DIR/acronym-tooltip.zip"
rm -f "$ZIP_FILE"
(cd "$DIST_DIR" && zip -r "$ZIP_FILE" .)

echo "Build complete."
echo "  Unpacked: $DIST_DIR"
echo "  Packaged: $ZIP_FILE"

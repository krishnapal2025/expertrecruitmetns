#!/bin/bash
# Remove all existing remotes
git remote | while read remote; do
  git remote remove "$remote"
done

# Add the correct remote URL
git remote add origin https://github.com/AnilkumarGvm/erproject.git

# Verify
git remote -v

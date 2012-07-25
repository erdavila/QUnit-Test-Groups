#!/bin/bash

CONTENT="example src resources"

git rm -r $CONTENT
git checkout master -- $CONTENT
git status

echo
echo "Review the content and then commit it."


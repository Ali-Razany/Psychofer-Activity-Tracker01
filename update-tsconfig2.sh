#!/bin/bash
cat tsconfig.json | sed 's/"exclude"/"include": ["src"],\n  "exclude"/g' > tsconfig.new.json
mv tsconfig.new.json tsconfig.json

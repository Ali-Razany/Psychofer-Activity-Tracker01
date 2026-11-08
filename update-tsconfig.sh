#!/bin/bash
cat tsconfig.json | sed 's/}$/,\n  "exclude": ["Ú•ÙˆÙˆÚ©Ø§Ø±", "node_modules"]\n}/' > tsconfig.new.json
mv tsconfig.new.json tsconfig.json

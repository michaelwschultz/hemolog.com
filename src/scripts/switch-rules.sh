#!/bin/bash

# Firestore rules are no longer swapped into one file.
# firebase deploy reads firebase/firestore.prod.rules.
# pnpm firebase starts the emulators with firebase/firestore.dev.rules.

echo "Rules are selected by the command, not by copying a file."
echo "  firebase deploy          uses firebase/firestore.prod.rules"
echo "  pnpm firebase            uses firebase/firestore.dev.rules for the emulators"
exit 1

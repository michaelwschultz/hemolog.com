#!/bin/bash

# Script to switch between development and production Firestore rules

if [ "$1" = "dev" ]; then
  echo "Switching to development rules..."
  cp firestore.dev.rules firestore.rules
  echo "✅ Using development rules (allows all operations)"
elif [ "$1" = "prod" ]; then
  echo "Switching to production rules..."
  cp firestore.prod.rules firestore.rules
  echo "✅ Using production rules (requires authentication)"
else
  echo "Usage: $0 [dev|prod]"
  echo "  dev  - Use development rules (allows all operations)"
  echo "  prod - Use production rules (requires authentication)"
  exit 1
fi

echo "Restart your Firebase emulators for changes to take effect:"
echo "  pnpm run firebase"

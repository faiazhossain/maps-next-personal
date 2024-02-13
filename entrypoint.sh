#!/bin/sh

echo "Check that we have NEXT_PUBLIC_API_URL vars"

test -n "$NEXT_PUBLIC_MAP_API_ACCESS_TOKEN"

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_MAP_API_ACCESS_TOKEN#$NEXT_PUBLIC_MAP_API_ACCESS_TOKEN#g"

echo "Starting Nextjs"
exec "$@"
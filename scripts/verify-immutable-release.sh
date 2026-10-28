#!/usr/bin/env bash
# Exit 0: exact existing bytes. Exit 10: confirmed public 404 (new object).
# Any other exit: fail closed; never upload after an uncertain transfer.
set -euo pipefail
file=$1
bucket=$2
base=$3
name=$(basename "$file")
if [[ ! "$name" =~ ^[A-Za-z0-9_.-]+\.json$ ]] || [[ ! "$bucket" =~ ^[a-z0-9][a-z0-9-]+[a-z0-9]$ ]] || [[ "$base" != https://* ]]; then
  echo "Invalid immutable artifact verification input" >&2; exit 2
fi
candidate=$(mktemp)
trap 'rm -f "$candidate"' EXIT
if status=$(curl --silent --show-error --location --output "$candidate" --write-out '%{http_code}' --connect-timeout 10 --max-time 30 --retry 2 --retry-delay 2 --retry-all-errors "${base%/}/$name"); then
  if [ "$status" = 404 ]; then exit 10; fi
  if [ "$status" != 200 ]; then echo "Cannot verify $name: HTTP $status" >&2; exit 2; fi
else
  transfer=$?
  case "$transfer" in
    5|6|7|18|28|52|55|56|92) ;; # DNS/connect/partial/timeout/socket failures only
    *) echo "Non-transport public failure for $name (curl $transfer); refusing fallback." >&2; exit 2 ;;
  esac
  echo "Public transfer failed for $name; checking authoritative origin without weakening byte comparison." >&2
  # A failed origin lookup is NOT treated as absence. No write is allowed then.
  if ! timeout 90s npx --yes wrangler@3.114.0 r2 object get "$bucket/v1/$name" --file "$candidate" >&2; then
    echo "Authoritative lookup failed for $name; absence is not established." >&2; exit 2
  fi
fi
if ! cmp -s "$file" "$candidate"; then
  echo "Immutable published file differs: $name" >&2; exit 2
fi
echo "verified existing $name"

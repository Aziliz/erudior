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
if status=$(curl --silent --show-error --location --output "$candidate" --write-out '%{http_code} %{time_namelookup} %{time_connect} %{time_starttransfer} %{time_total} %{size_download}' --connect-timeout 10 --max-time 30 --retry 2 --retry-delay 2 --retry-all-errors "${base%/}/$name"); then
  read -r status dns_time connect_time first_byte total_time downloaded_bytes <<< "$status"
  echo "public_check artifact=$name http=$status dns_s=$dns_time connect_s=$connect_time first_byte_s=$first_byte total_s=$total_time bytes=$downloaded_bytes" >&2
  if [ "$status" = 404 ]; then exit 10; fi
  if [ "$status" != 200 ]; then echo "Cannot verify $name: HTTP $status" >&2; exit 2; fi
else
  transfer=$?
  case "$transfer" in
    5|6|7|18|28|52|55|56|92) ;; # DNS/connect/partial/timeout/socket failures only
    *) echo "Non-transport public failure for $name (curl $transfer); refusing fallback." >&2; exit 2 ;;
  esac
  echo "public_transfer_error artifact=$name curl_exit=$transfer; querying authoritative R2 without weakening byte comparison." >&2
  # A failed origin lookup is NOT treated as absence. No write is allowed then.
  if ! timeout 90s npx --yes wrangler@3.114.0 r2 object get "$bucket/v1/$name" --file "$candidate" >&2; then
    echo "Authoritative lookup failed for $name; absence is not established." >&2; exit 2
  fi
fi
if ! cmp -s "$file" "$candidate"; then
  echo "immutable_mismatch artifact=$name local_sha256=$(sha256sum "$file" | cut -d" " -f1) remote_sha256=$(sha256sum "$candidate" | cut -d" " -f1) local_bytes=$(wc -c < "$file") remote_bytes=$(wc -c < "$candidate")" >&2; exit 2
fi
echo "verified existing $name"

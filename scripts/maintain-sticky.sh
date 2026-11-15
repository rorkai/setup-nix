#!/usr/bin/env bash
set -euo pipefail

cache_dir=/nix/var/cache/nix
if [[ "$CACHE_WRITABLE" == true && "$GC_THRESHOLD" != 0 ]]; then
  read -r size used < <(df -B1 --output=size,used /nix | tail -n 1)
  if (( used * 100 > size * GC_THRESHOLD )); then
    nix_gc=$(command -v nix-collect-garbage)
    sudo "$nix_gc" --delete-old
    sudo rm -rf "$cache_dir"
  fi
fi
sudo install -d -m 0755 -o "$(id -un)" -g "$(id -gn)" "$cache_dir"
printf 'NIX_CACHE_HOME=%s\n' "$cache_dir" >> "$GITHUB_ENV"

#!/usr/bin/env bash
set -euo pipefail

if [[ -z "$GH_TOKEN" ]]; then exit 0; fi
if [[ "$GH_TOKEN" == *$'\n'* || "$GH_TOKEN" == *$'\r'* ]]; then
  echo '::error::github-token must be a single-line value'
  exit 1
fi
config_dir="${XDG_CONFIG_HOME:-$HOME/.config}/nix"
mkdir -p "$config_dir"
umask 077
touch "$config_dir/nix.conf"
chmod 600 "$config_dir/nix.conf"
printf '\naccess-tokens = github.com=%s\n' "$GH_TOKEN" >> "$config_dir/nix.conf"

#!/usr/bin/env bash
# Checks that every externally published URL still answers as expected.
# Usage: scripts/check-urls.sh [base_url]   (default: https://samuele.bistoletti.me)
set -u
BASE="${1:-https://samuele.bistoletti.me}"
fail=0

check() { # path expected_status [expected_location]
  local path="$1" want="$2" loc="${3:-}"
  local out code got
  out=$(curl -s -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' "$BASE$path") || out="000 "
  code="${out%% *}"; got="${out#* }"
  if [[ "$code" != "$want" ]] || { [[ -n "$loc" ]] && [[ "$got" != "$BASE$loc" ]]; }; then
    printf 'FAIL %-45s got %s %s (want %s %s)\n' "$path" "$code" "$got" "$want" "${loc:+$BASE$loc}"; fail=1
  else
    printf 'ok   %-45s %s %s\n' "$path" "$code" "$got"
  fi
}

# Canonical pages (linked from Facebook, READMEs, forks and docs sites)
check / 200
check /it/ 200
check /v2c-discount-code/ 200
check /octopus-energy-referral/ 200
check /privacy/ 200
check /it/privacy/ 200
check /v2c-discount-code 301 /v2c-discount-code/
check /octopus-energy-referral 301 /octopus-energy-referral/

# Italian aliases published externally: 301 via Cloudflare Single Redirects
for p in /it/codice-sconto-v2c /it/codice-sconto-v2c/ /it/codice-sconto-v2c/index.html; do check "$p" 301 /v2c-discount-code/; done
for p in /it/referral-octopus-energy /it/referral-octopus-energy/ /it/referral-octopus-energy/index.html; do check "$p" 301 /octopus-energy-referral/; done

check /sitemap.xml 200
check /robots.txt 200
check /this-page-does-not-exist/ 404

exit $fail

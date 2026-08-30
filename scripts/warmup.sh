#!/bin/sh
BASE="http://localhost:${PORT:-3000}"

tries=0
until curl -sf --max-time 5 -o /dev/null "$BASE/"; do
	tries=$((tries + 1))
	if [ "$tries" -ge 30 ]; then
		echo "warmup: server did not respond within 60s, exiting"
		exit 0
	fi
	sleep 2
done

urls=$(curl -s --max-time 10 "$BASE/sitemap.xml" \
	| grep -o "<loc>[^<]*</loc>" \
	| sed -e "s|</\?loc>||g" -e "s|https\?://[^/]*|$BASE|")

printf '%s\n' "$urls" | xargs -r -n 1 -P 4 curl -s --max-time 30 -o /dev/null

echo "warmup: warmed $(printf '%s\n' "$urls" | grep -c .) URLs"
exit 0

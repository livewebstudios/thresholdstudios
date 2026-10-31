#!/usr/bin/env bash
# Hero loop (handoff 7.2). The Higgsfield clip is one continuous push-in, so a straight loop jumps.
# This trims the soft edges and plays it forward then reversed (push in, pull out) for a seamless loop.
# Run from build/: npm run video
set -euo pipefail
IN="../images/raw/hero-console.mp4"
OUT="public/media"
mkdir -p "$OUT"
F="[0:v]trim=0.2:7.8,setpts=PTS-STARTPTS,scale=1280:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]"
ffmpeg -v error -y -i "$IN" -filter_complex "$F" -map "[v]" -an -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/hero-console.mp4"
ffmpeg -v error -y -i "$IN" -filter_complex "$F" -map "[v]" -an -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 "$OUT/hero-console.webm"
ls -la "$OUT"

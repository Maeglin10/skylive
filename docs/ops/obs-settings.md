# OBS Ingest Settings (Skylive)

**Target:** RTMP ingest → HLS playback (stable, low jitter)

## Recommended Baseline (1080p)
- **Video bitrate:** 4500–6000 Kbps
- **Audio bitrate:** 160–192 Kbps
- **Keyframe interval:** 2 seconds
- **Encoder:** x264 (veryfast) or NVENC (quality)
- **FPS:** 30 (or 60 if stable CPU/GPU)
- **Profile:** High

## RTMP Settings
- **Server:** `rtmp://localhost:1935/live`
- **Stream key:** from `POST /api/live/sessions`

## Common Issues
- **Stutters / buffering:** reduce bitrate or FPS; check keyframe interval.
- **HLS not loading:** confirm HLS URL and CORS headers.

## Notes
- For ultra low latency, LL‑HLS or WebRTC can be added later.

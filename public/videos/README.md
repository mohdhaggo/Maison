# Hero video drop-in

Put your rendered hero clip here as:

    public/videos/hero.mp4

The homepage hero (`components/HeroBottle.jsx`) probes for this file on load.
If it exists, it plays full-screen (muted, looping) in place of the live 3D
flacon. If it's missing, the live photorealistic 3D bottle is shown instead —
so the site always looks finished.

Recommended: 1920×1080 (16:9), H.264 MP4, 10–15s, seamless loop, < 8 MB if
possible (compress at handbrake.fr or with `ffmpeg -crf 26`).

See `/HERO_ASSET_PROMPTS.md` in the repo root for the generation prompts.

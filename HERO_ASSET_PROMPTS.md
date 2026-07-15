# Maison Lumière — Hero Asset Prompts & Drop-In Guide

The site works out of the box with a live, photorealistic 3D flacon. When you
want a rendered video hero, generate it externally and drop it in — no code
changes needed.

- Video  → `public/videos/hero.mp4`  (auto-plays over the 3D bottle)
- Audio  → `public/audio/ambience.mp3` (ElevenLabs; shows a sound toggle)

---

## Why not stitched image frames?

The 12–15-frame image approach flickers: image models redraw the bottle slightly
differently every frame, so it "boils". Two better ways to get real motion:

1. **Image → video** (recommended): generate ONE perfect still (prompts below),
   then animate it with **Runway Gen-3, Kling, Luma Dream Machine, or Sora**
   using an "image-to-video" prompt. One consistent bottle, real motion.
2. **Text → video** directly in the same tools with the scene prompts below.

Then compress to MP4 (16:9, ~10–15s, seamless loop) and save as
`public/videos/hero.mp4`.

---

## ASSET A — Hero still (generate first, in Midjourney / Ideogram / Flux)

> Photorealistic cinematic product shot of a luxury geometric glass perfume
> bottle filled with golden amber liquid, floating against a pure black
> background. Thick faceted glass with beautiful light refraction, warm gold rim
> lighting on the edges, delicate golden smoke drifting around it, a soft
> reflection on a dark glossy surface below. Ultra-premium high-fashion
> perfume commercial aesthetic, 8K, no text, no labels. 16:9.

## ASSET B — Animate the still (image-to-video: Runway / Kling / Luma / Sora)

> Slow cinematic 15-second shot: the perfume bottle rotates very slowly on a
> vertical axis, golden smoke drifting around it, faint gold particles floating
> upward, subtle light caustics moving across the glass. Camera locked. Pure
> black background. Seamless loop. No text.

## ASSET C — "The Alchemy" transformation (text-to-video)

> Cinematic 15s: golden amber drops fall in slow motion; rose petals, citrus
> slices and oud wood chips spiral into a vortex and compress into a glowing
> golden orb; the orb morphs into a luxury glass perfume bottle of amber liquid;
> soft golden smoke wraps around the finished bottle. Pure black background,
> warm gold rim lighting, high-fashion commercial quality. No text. 16:9.

## ASSET D — "Liquid Gold Formation" (text-to-video)

> Cinematic 15s: a drop of liquid gold hits a dark mirror surface, ripples
> spread, then the gold rises upward defying gravity and sculpts a luxury
> perfume bottle; transparent glass materialises around golden amber liquid; the
> bottle hovers with gold caustics reflecting below. Pure black background,
> jewelry-commercial quality. No text. 16:9.

---

## ASSET E — Ambient audio (ElevenLabs → public/audio/ambience.mp3)

- Sound Effects / Music: "soft airy ambient pad, warm and luxurious, a single
  distant crystalline chime, calm and mysterious, loopable, 45 seconds."
- Or a whispered voiceover line: "Maison Lumière — the invisible art of presence."

Export MP3, keep it quiet (the toggle plays at 50% volume).

---

## Compress before committing

    ffmpeg -i input.mov -vf scale=1920:-2 -c:v libx264 -crf 26 -pix_fmt yuv420p -an public/videos/hero.mp4

Aim for < 8 MB so the page stays fast.

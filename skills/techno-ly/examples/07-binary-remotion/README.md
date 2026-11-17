# تقني — الباينري بالشخصيات (Remotion)
Source-based rebuild after reviewing **Tuhfa**, **Techno-Ly**, **Mascot Explainer** and the approved Supabase Edge Functions film.

## Render
\`\`\`bash
npm install
python3 prepare_audio.py
npx remotion render src/index.tsx Binary exports/taqni-binary-voice.mp4 --codec h264 --crf 19
\`\`\`
- Original Taqni **ت** logo copied from \`skills/techno-ly/brand/taqni-mark-white.svg\`
- Original TikTok brand SVG from \`Hadani0mar/m0usasvg\` \`public/icons/tiktok/default.svg\`
- Visual identity: plain white, #22c55e, Kufam Arabic, 60 fps / 1080×1920
- Characters are new SVG puppet rigs with speech-envelope-driven mouth movement
- Two separate Gemini Voice WAV recordings (Puck / Aoede), natural Libyan dialect. No voice cloning
- Important: speech RMS moves the mouth, it is **not** phoneme-perfect lip sync
- Voice cues measured from WAV, foley original synthesized only on visible clicks, no background music
- Binary demo: 8,4,2,1 weights; 0101 = 4+1 = 5
- Outro: real channel logo + TikTok + @teqani.ly + follow animation
- Script uses simplified binary concepts, for general educational audience.
- No automatic publication or uploads to TikTok.

## QA
Use Remotion to render and inspect the actual MP4 at 360px mobile scale. Run ffprobe to verify video, audio, FPS, resolution, duration and peak. A GitHub Actions artifact is not equivalent to publication.

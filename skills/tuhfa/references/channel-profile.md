# تقني — approved production profile

Use the current request first. This profile follows the approved 13 Nov 2026 Edge Functions film;
older films and upstream defaults cannot override it.

- Canvas: pure white, 1080×1920 at 60 fps. A 540×960 design at 2× is valid. 4K only when requested.
- Type: Kufam Arabic, Inter UI/Latin, JetBrains Mono code. Use licensed real font files and await loading.
  Animate whole Arabic words in RTL; no letter-spacing or per-character split that breaks joining.
- Palette: #141816 ink, #22c55e shapes, #168752 green text on white. Avoid unnecessary glows/grids/textures.
- Brand: small ت and @teqani.ly throughout. Fetch actual brand logos and UI icons from Hadani0mar/m0usasvg.
  Use the current real source; do not draw replacement logos or vendor the entire asset repository.
- Voice: keep accepted audio for visual edits. For a new generated voice, use the available Gemini Voice
  API / Google AI Studio voice workflow; last approved voice Orus, clear energetic MSA. A current dialect
  request overrides this. Check API capability and returned audio format before building timing.
- Hook: show a tangible result in the first 2–3 seconds. Pay it off in the example. Research claims.
- Phone: use real Stageshow Phone/Window geometry, roughly 380 native px, then scale the whole object.
  Put titles in a separate space outside the phone. Never hide an important label with a caption.
  Explain the tool before introducing the phone when following the approved explainer structure.
- Motion: causal typing/click/request/result; clear entrances, readable holds, faster exits. Remove old
  text before replacements. Select 2–3 meaningful transition families. Do not fill time with idle wobble.
- Sound: narration plus restrained click/key/slide/impact foley; no music unless asked. Avoid cartoon
  ding, bubble and riser cues. A library containing these sounds is not a reason to use them.
  Keep effects about 8–10 dB under voice; target about −14 LUFS and ≤−1.5 dBTP, inspect the measured mix.
- Ending: ت + TikTok logo + @teqani.ly and a simple follow button: rise → one click → تمت المتابعة/check.
  The latest requested CTA (e.g. comment “skill”) belongs in the script when asked. Do not add repeated
  spoken follow pleas. No “فيديو غير رسمي”, simulation labels, production notes or source footers in the
  picture by default. Document sample data, source links and execution truthfully in project README.
- Safe zones: verify against the current posting UI and actual phone preview; reserve right-side TikTok
  controls and bottom caption area. Do not assume an old safe-zone template is permanently accurate.
- Delivery: direct MP4 download when requested. Posting requires a posting request. A phone can control
  a cloud/remote worker; do not imply heavy npm/video rendering runs natively in ChatGPT's phone app.

Reference in the full repository: `skills/techno-ly/references/approved-edge-functions-style.md` and
`skills/techno-ly/examples/06-supabase-edge-functions/`.

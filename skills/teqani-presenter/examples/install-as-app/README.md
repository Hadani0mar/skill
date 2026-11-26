# Install as app — مثال الشخصية (26 نوفمبر 2026)

`teqani_install_as_app_v4.mp4`: 44.7 s, 1080×1920, 30 fps, voice + SFX at about −16 LUFS.

- **Topic:** Claude's «Install as app» beta (announced 24 Nov 2026; Mac and Windows; all plans including Free;
  Share menu → Install as app; menu-bar item and notifications with permission). The sources were checked on
  26 Nov 2026 (MacRumors, The Decoder, TestingCatalog, FoneArena); Anthropic's own examples include «Vitals»,
  a menu-bar performance monitor, which inspired the demo.
- **Demo app on screen:** «حالة جهازي», a system monitor. Its RAM/storage/CPU numbers are illustrative UI values,
  not a measurement.
- **Voice:** Gemini 3.8 Flash TTS, designed voice «Teqani Libyan» (`voice_1nn9zk6feyri`, ar-LY), three parts
  joined (`voice.mp3`). The script is in `script.txt`.
- **Timing:** `words.json` comes from the pauses in the voice with phrase boundaries pinned by hand. `events.json`
  is the `EV` from `scripts/timeline_install_as_app.py`.
- **Owner feedback on this run:** asked for LivePortrait-level animation (he looks at the viewer and at the
  computer); rejected screen-at-start, the noisy pixel transition, the Tunisian ElevenLabs voice, weak hooks,
  and promoting the demo app instead of the feature. He accepted the designed Libyan voice («تمام استخدم هذا
  الصوت») and asked to adopt the character and its animation as the channel's main presenter. He has not given
  a verdict on v4 itself.

Rebuild:
```
cd skills/teqani-presenter
EVJSON=examples/install-as-app/events.json node scripts/screen/cap.mjs /tmp/sf 44.7 30
SCREEN_FRAMES=/tmp/sf python3 scripts/render.py /tmp/frames
PRESENTER_WORK=/tmp/pw python3 scripts/mix.py
ffmpeg -i /tmp/pw/mix_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 /tmp/pw/mix.wav
ffmpeg -framerate 30 -i /tmp/frames/%04d.jpg -i /tmp/pw/mix.wav -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest out.mp4
```

**First stats (26 Nov 07:17, ~6 h, posted 01:33):** 173 views, 10.4 s avg watch, 6.6 % full watch, 9.2 % likes,
0 comments, 1 follower; retention 41 % @3 s, 20 % @10 s, flat to 13 % @35 s. Lessons in SKILL.md §8.

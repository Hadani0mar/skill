# 06 — Jev (TypeSafe AI) explainer, silent (4 Nov 2026)
118.5 s, 1080×1920, 30 fps, **no voice-over yet** (the user records it from `script.md`), SFX only in the final cut.
Sources: Wikipedia «Jev (AI model)», typesafe.ai (+ /team), FourWeekMBA (Series A), eesel (pricing), aiwiki (versions).

## What is here
- `script.md` — the Libyan-Arabic TTS script as delivered (Scene + Text, angle-bracket tags, ~360 words).
- `src/App.tsx`, `src/style.css` — the 10 scenes (hook → name → company → people → funding → 1.14 → price → difference →
  complaints app → end), frame-pure, cuts on the 120 BPM grid of brag track vol-1 (0.5 s per beat).
- `mix.py` — silent-version mix: SFX (switches, clicks, drops, keyboard presses for typed text), music optional
  (`mu *= (0.0…` = off; the user asked for SFX only). `loudnorm` to −14 LUFS.
- `scripts/fetch-assets.sh` — re-downloads the logos/headshots (not committed: third-party images).
- `shots.png` — contact sheet from the final file.

## Facts used (and how they were hedged on screen)
Founded 2024, SF; launch 15 Sep 2026; seed $40M (DCVC) 15 Sep; Series A $870M (a16z, with Sequoia/DCVC) 9 Oct at $7.5B;
CEO Diogo Almeida (≈4 yrs OpenAI: RLHF, InstructGPT, GPT-4; the company page says «co-invented» — shown as «الشركة تقول»);
Erik Gafni, Sasha Sheng = «مؤسس/ة مشارك/ة» only (CTO/COO came from a weak source — not shown); jev-1.14 on 14 Oct (image input,
262K context, bounding box — all behind opt-in headers); $0.042 / M input tokens, output free; «200× faster / 400× cheaper» is the
company's own benchmark → tagged «حسب الشركة». The complaints example, department list and every % / ms in it is **ours** → tagged «بيانات تجريبية».
No official building address exists (site says «Made in SF»), so a city card replaced a building photo.

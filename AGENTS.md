# AGENTS.md — skills index

This repository holds Agent Skills. Each skill is a folder under `skills/` with a `SKILL.md`
(YAML front matter `name` + `description`, then instructions) and supporting files.

How to use them (any agent):
1. When a request matches a skill's description below, read that skill's `SKILL.md` **in full, to its last line,
   before** asking questions or writing code. Skills are long: if your reader truncates, page with offset/limit until
   the end. motion-storytelling ends with `END OF SKILL — motion-storytelling` and a check word you must quote in
   a short "reading receipt" (its Step 0) — no receipt, no code.
   Then open the sources the skill names (product code, `examples/`, `template/`, libraries) before designing.
2. Follow it step by step with the tools you have. Paths inside a skill are relative to its folder
   (e.g. `template/` in motion-storytelling).
3. If a step needs a tool you do not have, say what is missing instead of skipping silently.

| Skill | Use when |
|---|---|
| `skills/motion-storytelling/SKILL.md` | Arabic vertical motion videos in Remotion: app explainers, brand reels, logo stings, typographic reels, researched story/news reels, modern launch films, illustrated stories, 3D product worlds, phone feature demos. Real logos and all UI icons from m0usasvg (Hadani0mar/m0usasvg); every visual component ported from React Bits first; when describing verified ordered system flow, read upstream praveenvijayan/animdiagram on demand (do not vendor), and translate SVG timing into frame-driven Remotion. Always ask which of the nine styles first; white ground unless the style or user sets a colour. |
| `skills/techno-ly/SKILL.md` | Videos for the TikTok channel «تقني» @techno_ly: AI-tool explainers, tool lists and service promos in Libyan Arabic, with the channel's fixed intro/outro and ت logo, white/green house style, Stageshow UI walkthroughs with visual scan, React Bits motion/sounds, brag rules; AI-Studio TTS scripts; TikTok growth playbook with day-one stats; problem→solution structure, silent-first delivery, example 06 (Jev). Read SKILL.md + references/ in full (check word at the END line). |
| `skills/mascot-explainer-video/SKILL.md` | A character/mascot presents a product, cutting away to animated app UI, with kinetic captions synced to a voice-over. |
| `skills/motion-reel/SKILL.md` | App ad / reel made inside the real product: typed searches, items lifting into the brand container, lift onto the final screen, blade cut, closing line, handle mark, real foley, no music; brand-film variant in `template-brand/`. |
| `skills/stageshow/SKILL.md` | Faux product UI that reads as real (benjitaylor/skills, MIT): windows, phones, cursor walkthroughs; restraint and anti-AI-look rules in `references/craft.md`, motion rules in `references/motion.md`, kit in `kit/`. |

# Integrating Studio Script into «تقني» / Tuhfa

Source: [Melvynx/video-agent-skills](https://github.com/Melvynx/video-agent-skills/tree/f4542923f7f796a1fa0e544cbfc1109d5eec87d8/skills/studio-script).
Copyright (c) 2026 Melvyn Malherbe; MIT. All original upstream files are
unmodified and pinned in root `toolkit-lock.json`. This file defines *local*
routing and overrides for the channel.

## When to use

For every new TikTok/Reels/Shorts explainer, use the source skill to develop
three DIFFERENT hooks and a credible script before building scenes. Useful
commands: `/studio-script hook <topic>`, `/studio-script <topic>`,
`/studio-script rewrite <draft>`. Tuhfa may internally use these procedures.

Read these local rules **before the upstream content**:
- `../tuhfa/SKILL.md` and `../tuhfa/references/channel-profile.md`;
- `../techno-ly/SKILL.md`, especially `references/hooks-and-retention.md`;
- the feedback ledger `../../docs/channel/feedback-ledger.md` for current films.

Current user instructions > channel profile > Tuhfa > this integration >
upstream writing formulas. Do not replace the visual and audio house style.

## Mandatory production contract

1. Verify the actual technology, UI, numbers, costs, availability and claimed
   outcome before writing. No fabricated view counts, success rates or demos.
2. Write 3 distinct opening candidates, e.g. tangible benefit, real viewer
   problem and specific curiosity gap, each labeled by formula with an
   editorial **0–10 writing score**. Scores are not predicted TikTok metrics.
   Choose the strongest defensible candidate, not the most sensational.
3. Display result or relevant action from **frame zero**. Put the viewer's real
   benefit in the first spoken sentence (roughly the first 2–3 seconds), with
   early visual evidence (roughly 3–5 seconds). These are editable heuristics,
   not algorithm facts. Keep on-screen hook short and complementary to audio.
4. Write the narrative in the requested Arabic (current default is natural
   MSA); use the channel's accepted Gemini/Orus TTS settings unless overridden.
   Maintain right-to-left whole-word typography. Avoid empty pauses.
5. Include a useful re-hook midway: an authentic new detail, question, visible
   result, or obstacle/resolution, not engagement bait. Use meaningful changes
   to visual composition approximately every 2–3 seconds as needed, while
   prioritizing legibility and narration timing.
6. Pay off every curiosity promise during the film. Do not withhold the core
   benefit or available code until the end. User-requested CTA and outro
   take precedence over imported script templates.
7. Deliver a writing-to-render handoff: the 3 hooks and chosen rationale,
   complete narration, scene beats and approximate timings, visual proof,
   highlighted caption words, one mid-film re-hook, sound/action notes and
   an explicit fact-check list. Let Tuhfa/Remotion/HyperFrames handle
   rendering, source visuals, quality review, export and requested delivery.
8. If actual comparable retention statistics exist, use them carefully to
   test improvements. Without them, do not claim that a hook is proven to
   increase retention or guarantee reach.

## Do not inherit upstream production assumptions

- `video-agent/voice.md`, `swipe.md`, `audit.md`, `log.md`,
  `/studio-setup` and Treg are **optional** here, not setup prerequisites.
  Use the approved channel profile, current brief, source-backed research
  and existing feedback rather than forcing new questions or a second identity.
- No forced paper/split-screen aesthetic, imported music beds, editing engine,
  third-party subscriptions, language change or extra approval steps.
- No automatic social publishing, broad dependency installation, credentials
  requests or Treg calls. Importing the Skill does NOT install external tools.
  Publishing only follows explicit authorization.

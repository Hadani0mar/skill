# Script writing for «تقني» (Google AI Studio TTS)

## Format
- The user generates the voice in **Google AI Studio** (speech playground). Give two blocks:
  1. **Scene** (English): who speaks, where, dialect, pacing. Always include
     `Libyan Arabic dialect (Tripoli accent), never Modern Standard Arabic`.
  2. **Text**: the script with **angle-bracket** tags — `<curious> <warm> <excited> <calm> <amazed> <breath>
     <short pause> <smile>`. Never square brackets. "..." gives a pause.
- Write English product names in Arabic letters so they are pronounced right (نوت بوك إل إم، جيميناي نوت بوك،
  بربلكسيتي، أيديوقرام، بي دي إف، سوبابيز، ريل تايم). On screen they stay in Latin.
- Length: tool list 40–50 s; full explainer 80–95 s; promo ~60 s. One idea per sentence, short sentences.

## Structure that worked
- **Tool list («3 أدوات…»)**: hook with the promise (saves hours) → each tool: name + one concrete feature the
  viewer can try → "each one has a full explainer coming on تقني" → follow so it reaches you.
- **Full explainer** (series): recap of the previous video + the promise → kinetic hook → what the tool is (name,
  maker, price) → step-by-step on the real site (open → add sources → upload → summary → ask → answer with sources
  → extra features) → next episode + "comment the tool you want, we'll make a full video" → follow.
- **Service promo**: why it matters (benefits, no service talk yet) → why a promo video matters → "we build both"
  → live example → "the video you're watching is our work" → comment / DM + follow.

## Rules from the user's feedback
- Start with a hook, not with «هذي سوبابيز» bluntly.
- Never begging ("our account has zero followers") — give value; follow is a consequence.
- Don't invent who the viewer is (no personal names like «أنا موسى» unless asked).
- Mention services/code **indirectly** (e.g. «وساعات نعطوك الكود كامل»، «الفيديو اللي تتفرج فيه توّا تقدر يكون
  عندك واحد زيه»).
- Explainers must be detailed, not summaries, and tie to the previous video's promise.
- Research facts before writing; every claim must be supportable (e.g. NotebookLM: answers only from your
  sources with numbered citations, Audio Overview two AI hosts, up to 50 sources per notebook on the free plan,
  Studio: mind map, flashcards, quiz).

## Example (approved, Gemini Notebook explainer)
See `examples/README.md` — every video's script is listed there.

## Problem → solution structure (user's preference, 4 Nov 2026) — binding for new videos
Open on the PROBLEM as the hook (millions of tickets, one department can't absorb them), then «كيف تخليه يعرف بروحه؟»
(the solution: a decision model routes each ticket to the right team), then the second step (a bigger model writes the
acknowledgement reply), and only THEN introduce the tool/company (maker, founder, price, what's new, difference).
The voice is recorded to the script, so fix the script order BEFORE the user records; never reorder scenes after the voice exists.
If the user records first, build the video in the order of their audio.

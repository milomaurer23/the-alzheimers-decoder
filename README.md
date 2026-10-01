# The Alzheimer's Decoder

A prototype for families caring for a parent with Alzheimer's. You log what happened in plain language, and the app turns those notes into a timeline you can actually read: what kind of behavior it was, how urgent it felt, and how both are changing over weeks and months.

**Live demo:** https://milomaurer23.github.io/the-alzheimers-decoder/

The idea is simple. When you're the one getting the 3 a.m. phone calls, it's hard to tell whether things are getting worse or you're just tired. A doctor's appointment gives you fifteen minutes to explain three months. This puts the pattern on one screen.

## What it does

**Longitudinal Ledger**
- A chronological timeline of every logged event, color-coded by urgency (low / moderate / critical)
- Click any event to see the full description, your own notes, the behavior category, and the urgency rating

**Logging an event**
- Describe what happened in your own words: when, what you saw, how long it lasted, what resolved it
- The app suggests a behavior category (Memory Lapse, Confusion, Agitation, Wandering, Sleep Disruption, Personal Care Decline) and a 1–10 urgency score
- Add your own notes, such as context to remember or changes you plan to make

**Data Analysis**
- **Behavior Frequency:** a monthly bar chart of how often each kind of behavior shows up
- **Urgency Trajectory:** urgency per event over time, so escalation is visible
- **Urgency Heat Map:** urgency at the day level across roughly three months

## Status

This is an early prototype, not a medical tool.

- **Category and urgency are keyword rules, not AI.** `classifyBehavior` and `simulateUrgencyScore` in `src/utils.js` scan the text for words like "wander" or "police". They're placeholders for a real model.
- **Nothing is saved.** Entries live in memory and reset on reload.
- **It ships with sample entries** in `src/data/mockData.js` so the charts have something to show.
- There's no voice input yet, even though the field is labeled "Voice Transcript". You type into it.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints, usually http://localhost:5173.

## Built with

React 18, Vite, Tailwind CSS, Recharts.

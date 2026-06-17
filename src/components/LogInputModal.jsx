import { useState } from 'react'
import { generateId, simulateUrgencyScore, classifyBehavior, urgencyDotColor, urgencyLabel } from '../utils.js'

export default function LogInputModal({ onSubmit, onClose, parentId }) {
  const [transcript, setTranscript] = useState('')
  const [notes, setNotes] = useState('')
  const [urgency, setUrgency] = useState(null)
  const [behavior, setBehavior] = useState(null)
  const [analyzed, setAnalyzed] = useState(false)

  function handleAnalyze() {
    if (!transcript.trim()) return
    const score = simulateUrgencyScore(transcript)
    const category = classifyBehavior(transcript)
    setUrgency(score)
    setBehavior(category)
    setAnalyzed(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!transcript.trim() || !analyzed) return

    onSubmit({
      id: generateId(),
      timestamp: new Date().toISOString(),
      raw_voice_transcript: transcript,
      ai_interpreted_behavior: behavior,
      adult_child_notes: notes,
      urgency_rating: urgency,
      parent_id: parentId,
    })
  }

  const dotColor = urgency ? urgencyDotColor(urgency) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian bg-opacity-60"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-2xl bg-ash-50 border border-obsidian max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="border-b border-ash-200 px-8 py-6 flex items-start justify-between">
          <div>
            <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-1">Input Portal</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-obsidian">
              LOG A NEW BEHAVIOR.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-sans text-xs text-ash-400 hover:text-obsidian transition-colors mt-1"
          >
            ✕ Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Voice transcript field */}
          <div>
            <label className="block font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-3">
              Voice Transcript
              <span className="ml-2 text-ash-300 normal-case tracking-normal">
                (describe the observed behavior in plain language)
              </span>
            </label>
            <div className="relative">
              <textarea
                value={transcript}
                onChange={(e) => { setTranscript(e.target.value); setAnalyzed(false) }}
                rows={5}
                placeholder="Describe what happened — when, what you observed, how long it lasted, what resolved it…"
                className="w-full bg-white border border-ash-200 focus:border-obsidian focus:outline-none px-4 py-3 font-sans text-sm text-obsidian placeholder-ash-300 resize-none transition-colors"
              />
            </div>
          </div>

          {/* Caregiver notes */}
          <div>
            <label className="block font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-3">
              Your Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What context do you want to remember? Any changes you plan to make?"
              className="w-full bg-white border border-ash-200 focus:border-obsidian focus:outline-none px-4 py-3 font-sans text-sm text-obsidian placeholder-ash-300 resize-none transition-colors"
            />
          </div>

          {/* AI analysis button */}
          {!analyzed && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!transcript.trim()}
              className="w-full border border-obsidian px-6 py-3 font-sans text-xs tracking-ultrawide uppercase text-obsidian hover:bg-obsidian hover:text-ash-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↯ Analyze with AI — Generate Urgency Score
            </button>
          )}

          {/* AI analysis result */}
          {analyzed && urgency !== null && (
            <div className="border border-ash-200 bg-white p-5">
              <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-4">
                AI Analysis Result
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-sans text-xs text-ash-400 mb-1">Interpreted Behavior</p>
                  <p className="font-sans text-sm font-medium text-obsidian">{behavior}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-xs text-ash-400 mb-1">Urgency Score</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dotColor }} />
                    <span className="font-serif text-3xl font-light" style={{ color: dotColor }}>
                      {urgency}
                    </span>
                    <span className="font-sans text-xs text-ash-400">/10 — {urgencyLabel(urgency)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full h-px bg-ash-200">
                <div
                  className="h-px transition-all duration-500"
                  style={{ width: `${urgency * 10}%`, backgroundColor: dotColor }}
                />
              </div>
              <button
                type="button"
                onClick={() => setAnalyzed(false)}
                className="mt-3 font-sans text-xs text-ash-400 hover:text-obsidian transition-colors"
              >
                ↺ Re-analyze
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!analyzed || !transcript.trim()}
              className="flex-1 bg-obsidian text-ash-50 px-6 py-3 font-sans text-xs tracking-ultrawide uppercase hover:bg-ash-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Commit Entry to Ledger
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-sans text-xs tracking-ultrawide uppercase border border-ash-200 text-ash-400 hover:text-obsidian hover:border-obsidian transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

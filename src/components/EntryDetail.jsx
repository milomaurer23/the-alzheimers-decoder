import { urgencyDotColor, urgencyLabel, formatDate, formatTime } from '../utils.js'

const CATEGORY_TAGS = {
  'Memory Lapse': 'bg-ash-100 text-ash-500',
  'Agitation': 'bg-crimson-pale text-crimson',
  'Wandering': 'bg-ash-100 text-ash-500',
  'Confusion': 'bg-ash-100 text-ash-500',
  'Sleep Disruption': 'bg-ash-100 text-ash-500',
  'Personal Care Decline': 'bg-ash-100 text-ash-500',
}

export default function EntryDetail({ entry, onClose }) {
  if (!entry) return null

  const dotColor = urgencyDotColor(entry.urgency_rating)
  const label = urgencyLabel(entry.urgency_rating)

  return (
    <div className="bg-white border border-ash-200 h-full flex flex-col">
      {/* Detail header */}
      <div className="border-b border-ash-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-1">
              {formatDate(entry.timestamp)}
            </p>
            <p className="font-sans text-xs text-ash-400">{formatTime(entry.timestamp)}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="font-sans text-xs text-ash-400 hover:text-obsidian transition-colors lg:hidden"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`font-sans text-xs tracking-wider uppercase px-2.5 py-1 ${CATEGORY_TAGS[entry.ai_interpreted_behavior] || 'bg-ash-100 text-ash-500'}`}
          >
            {entry.ai_interpreted_behavior}
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: dotColor }}
            />
            <span
              className="font-sans text-xs tracking-wider uppercase"
              style={{ color: dotColor }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Urgency meter */}
      <div className="border-b border-ash-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase">Urgency Rating</p>
          <p className="font-serif text-2xl font-light" style={{ color: dotColor }}>
            {entry.urgency_rating}<span className="text-ash-300 text-base">/10</span>
          </p>
        </div>
        <div className="w-full h-px bg-ash-200">
          <div
            className="h-px transition-all duration-300"
            style={{
              width: `${entry.urgency_rating * 10}%`,
              backgroundColor: dotColor,
            }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Voice transcript */}
        <div className="border-b border-ash-200 p-6">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-3">
            Raw Voice Transcript
          </p>
          <p className="font-sans text-sm leading-relaxed text-obsidian">
            {entry.raw_voice_transcript}
          </p>
        </div>

        {/* AI interpretation note */}
        <div className="border-b border-ash-200 p-6">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-2">
            AI Interpreted Behavior
          </p>
          <p className="font-sans text-sm font-medium text-obsidian">{entry.ai_interpreted_behavior}</p>
        </div>

        {/* Adult child notes */}
        <div className="p-6">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-3">
            Caregiver Notes
          </p>
          <p className="font-sans text-sm leading-relaxed text-ash-500 italic">
            "{entry.adult_child_notes}"
          </p>
        </div>
      </div>
    </div>
  )
}

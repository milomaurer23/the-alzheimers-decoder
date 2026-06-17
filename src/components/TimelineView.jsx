import { useState } from 'react'
import { urgencyDotColor, formatShortDate, formatTime } from '../utils.js'
import EntryDetail from './EntryDetail.jsx'

function groupByMonth(entries) {
  const groups = {}
  ;[...entries].reverse().forEach((entry) => {
    const key = new Date(entry.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  })
  return groups
}

function TimelineEntry({ entry, isSelected, onSelect }) {
  const dotColor = urgencyDotColor(entry.urgency_rating)
  const excerpt = entry.raw_voice_transcript.slice(0, 90) + '…'

  return (
    <button
      onClick={() => onSelect(entry)}
      className={`w-full text-left group pl-10 pr-4 py-5 relative transition-colors duration-100 border-b border-ash-200 ${
        isSelected ? 'bg-obsidian' : 'bg-white hover:bg-ash-50'
      }`}
    >
      {/* Timeline dot */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-ash-50 z-10 shrink-0"
        style={{ backgroundColor: dotColor }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`font-sans text-xs tracking-wider uppercase ${
                isSelected ? 'text-ash-300' : 'text-ash-400'
              }`}
            >
              {formatShortDate(entry.timestamp)}
            </span>
            <span
              className={`font-sans text-xs tracking-wider uppercase font-medium ${
                isSelected ? 'text-ash-200' : 'text-obsidian'
              }`}
            >
              {entry.ai_interpreted_behavior}
            </span>
          </div>
          <p
            className={`font-sans text-xs leading-relaxed line-clamp-2 ${
              isSelected ? 'text-ash-400' : 'text-ash-400'
            }`}
          >
            {excerpt}
          </p>
        </div>

        {/* Urgency badge */}
        <div
          className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-sans font-medium border"
          style={{
            borderColor: dotColor,
            color: isSelected ? '#FAFAFA' : dotColor,
            backgroundColor: isSelected ? 'transparent' : 'transparent',
          }}
        >
          {entry.urgency_rating}
        </div>
      </div>
    </button>
  )
}

export default function TimelineView({ entries, selectedEntry, onSelectEntry }) {
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const grouped = groupByMonth(entries)

  function handleSelect(entry) {
    onSelectEntry(entry)
    setMobileDetailOpen(true)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-280px)]">
      {/* Timeline column */}
      <div
        className={`flex-1 overflow-y-auto border border-ash-200 ${
          mobileDetailOpen ? 'hidden lg:block' : 'block'
        }`}
      >
        {/* Column header */}
        <div className="px-6 py-4 bg-ash-100 border-b border-ash-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs tracking-ultrawide text-ash-500 uppercase">
              {entries.length} Logged Events
            </p>
            <div className="flex items-center gap-4 text-xs font-sans text-ash-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-crimson inline-block" /> Critical (7–10)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-600 inline-block" /> Moderate (4–6)
              </span>
            </div>
          </div>
        </div>

        {/* Vertical line behind entries */}
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-ash-200 z-0" />

          {Object.entries(grouped).map(([month, monthEntries]) => (
            <div key={month}>
              <div className="sticky top-[41px] z-[5] bg-ash-100 border-b border-ash-200 pl-10 pr-4 py-2">
                <p className="font-sans text-xs tracking-ultrawide text-ash-500 uppercase">{month}</p>
              </div>
              {monthEntries.map((entry) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  isSelected={selectedEntry?.id === entry.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div
        className={`lg:w-[420px] lg:border-l-0 border border-ash-200 ${
          mobileDetailOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        {selectedEntry ? (
          <EntryDetail
            entry={selectedEntry}
            onClose={() => setMobileDetailOpen(false)}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-center">
              <p className="font-serif text-2xl font-light text-ash-300 mb-2">—</p>
              <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase">
                Select an entry to view detail
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

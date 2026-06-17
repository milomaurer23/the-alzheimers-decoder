export function urgencyDotColor(rating) {
  if (rating >= 7) return '#9B1B1B'
  if (rating >= 4) return '#B5860D'
  return '#A3A39C'
}

export function urgencyLabel(rating) {
  if (rating >= 7) return 'CRITICAL'
  if (rating >= 4) return 'MODERATE'
  return 'LOW'
}

export function urgencyHeatColor(rating) {
  if (!rating) return '#E8E8E5'
  if (rating >= 8) return '#9B1B1B'
  if (rating >= 6) return '#C84040'
  if (rating >= 4) return '#D4896A'
  return '#E8C4B8'
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function generateId() {
  return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const HIGH_KEYWORDS = [
  'wandering', 'left home', 'unsafe', 'emergency', 'fell', 'police',
  'found outside', 'missing', "didn't recognize", 'screamed', 'poisoned',
]

const MID_KEYWORDS = [
  'confused', 'agitated', 'angry', 'upset', 'forgot', 'lost', 'scared',
  'crying', 'refused', 'repeated', 'disoriented', 'awake at night',
]

export function simulateUrgencyScore(transcript) {
  const lower = transcript.toLowerCase()
  let score = 2
  HIGH_KEYWORDS.forEach((kw) => { if (lower.includes(kw)) score = Math.max(score, 7) })
  MID_KEYWORDS.forEach((kw) => { if (lower.includes(kw)) score = Math.max(score, 4) })
  return Math.min(10, score + 1)
}

export function classifyBehavior(transcript) {
  const lower = transcript.toLowerCase()
  if (lower.includes('wander') || lower.includes('left home') || lower.includes('outside') || lower.includes('found her') || lower.includes('found him')) return 'Wandering'
  if (lower.includes('agitat') || lower.includes('angry') || lower.includes('scream') || lower.includes('accusat') || lower.includes('poisoned')) return 'Agitation'
  if (lower.includes('sleep') || lower.includes('awake') || lower.includes('3am') || lower.includes('4am') || lower.includes('night') || lower.includes('bus to catch')) return 'Sleep Disruption'
  if (lower.includes('shower') || lower.includes('hygiene') || lower.includes('refused to eat') || lower.includes('bath') || lower.includes('food')) return 'Personal Care Decline'
  if (lower.includes('confus') || lower.includes('disori') || lower.includes("didn't know")) return 'Confusion'
  return 'Memory Lapse'
}

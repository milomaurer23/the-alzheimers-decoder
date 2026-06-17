import { useState } from 'react'
import { logEntries as initialEntries, parentProfile } from './data/mockData.js'
import Header from './components/Header.jsx'
import TimelineView from './components/TimelineView.jsx'
import LogInputModal from './components/LogInputModal.jsx'
import DataVizPanel from './components/DataVizPanel.jsx'

export default function App() {
  const [entries, setEntries] = useState(
    [...initialEntries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  )
  const [selectedEntry, setSelectedEntry] = useState(initialEntries[initialEntries.length - 1])
  const [showLogModal, setShowLogModal] = useState(false)
  const [activeTab, setActiveTab] = useState('ledger')

  function addEntry(newEntry) {
    setEntries((prev) =>
      [...prev, newEntry].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    )
    setSelectedEntry(newEntry)
    setActiveTab('ledger')
    setShowLogModal(false)
  }

  return (
    <div className="min-h-screen bg-ash-50 font-sans">
      <Header
        profile={parentProfile}
        onLogClick={() => setShowLogModal(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {activeTab === 'ledger' ? (
          <TimelineView
            entries={entries}
            selectedEntry={selectedEntry}
            onSelectEntry={setSelectedEntry}
          />
        ) : (
          <DataVizPanel entries={entries} />
        )}
      </main>

      {showLogModal && (
        <LogInputModal
          onSubmit={addEntry}
          onClose={() => setShowLogModal(false)}
          parentId={parentProfile.id}
        />
      )}
    </div>
  )
}

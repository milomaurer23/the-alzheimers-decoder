export default function Header({ profile, onLogClick, activeTab, onTabChange }) {
  return (
    <header className="bg-ash-50 border-b border-obsidian">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title block */}
        <div className="pt-10 pb-6 border-b border-ash-200">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-ultrawide text-ash-500 uppercase mb-2">
                Behavioral Timeline — Memory Care Log
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-obsidian leading-none tracking-tight">
                DECLINE TIMELINE:
              </h1>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-obsidian leading-none tracking-tight">
                {profile.name.toUpperCase()}.
              </h1>
              <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mt-4">
                A structured ledger of memory loss.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-right">
                <p className="font-sans text-xs text-ash-400 uppercase tracking-wider">Subject</p>
                <p className="font-sans text-sm font-medium text-obsidian">{profile.name}, age {profile.age}</p>
                <p className="font-sans text-xs text-ash-400">{profile.diagnosis}</p>
                <p className="font-sans text-xs text-ash-400">
                  Dx {new Date(profile.diagnosis_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
              <button
                onClick={onLogClick}
                className="font-sans text-xs tracking-ultrawide uppercase border border-obsidian px-5 py-2.5 text-obsidian hover:bg-obsidian hover:text-ash-50 transition-colors duration-150"
              >
                Log New Behavior →
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-0">
          {['ledger', 'analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`font-sans text-xs tracking-ultrawide uppercase px-6 py-4 border-b-2 transition-colors duration-150 ${
                activeTab === tab
                  ? 'border-obsidian text-obsidian'
                  : 'border-transparent text-ash-400 hover:text-obsidian'
              }`}
            >
              {tab === 'ledger' ? 'Longitudinal Ledger' : 'Data Analysis'}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

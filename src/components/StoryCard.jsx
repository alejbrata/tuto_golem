import { useState } from 'react';

function StoryCard({ title, lore, lesson, hints = [], onSolve, accentColor = 'cyan', text }) {
    const [activeTab, setActiveTab] = useState('lore');
    const [hintsRevealed, setHintsRevealed] = useState(0);

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/5`}>
                <h2 className={`text-2xl font-bold bg-gradient-to-r from-${accentColor}-200 to-${accentColor}-500 bg-clip-text text-transparent`}>
                    {title}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('lore')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 
            ${activeTab === 'lore'
                            ? `border-${accentColor}-500 text-${accentColor}-400 bg-slate-800`
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    📜 LORE
                </button>
                <button
                    onClick={() => setActiveTab('lesson')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 
            ${activeTab === 'lesson'
                            ? `border-${accentColor}-500 text-${accentColor}-400 bg-slate-800`
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    📘 LESSON
                </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto leading-relaxed text-slate-300 space-y-4 custom-scrollbar">
                {activeTab === 'lore' && (
                    <div className="animate-in fade-in duration-300">
                        <p className={`italic text-lg text-${accentColor}-100/80 border-l-4 border-${accentColor}-500/30 pl-4 py-2 bg-${accentColor}-900/10 rounded-r`}>
                            "{lore}"
                        </p>
                    </div>
                )}

                {activeTab === 'lesson' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="whitespace-pre-wrap">{lesson}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Hints */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
                {/* Revealed Hints */}
                {hintsRevealed > 0 && (
                    <div className="space-y-2 mb-2 animate-in slide-in-from-bottom-2">
                        {hints.slice(0, hintsRevealed).map((hint, i) => (
                            <div key={i} className={`text-sm text-${accentColor}-300 bg-${accentColor}-900/20 p-2 rounded border border-${accentColor}-500/20 flex gap-2 items-start`}>
                                <span className="text-xs mt-1">💡</span>
                                <span>{hint}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    {hintsRevealed < hints.length ? (
                        <button
                            onClick={() => setHintsRevealed(prev => prev + 1)}
                            className={`text-xs font-bold text-slate-400 hover:text-${accentColor}-400 transition-colors flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 uppercase tracking-wider`}
                        >
                            <span>🔮</span>
                            {text?.ask_oracle || "ASK THE ORACLE"} ({hints.length - hintsRevealed} {text?.remaining || "REMAINING"})
                        </button>
                    ) : (
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 py-2 cursor-default">
                            {text?.no_visions || "NO MORE VISIONS"}
                        </div>
                    )}

                    {/* Solution Button */}
                    {onSolve && (
                        <button
                            onClick={() => {
                                if (window.confirm(text?.reveal_confirm || "Are you sure?")) {
                                    onSolve();
                                }
                            }}
                            className="text-[10px] text-rose-900 hover:text-rose-500 transition-colors flex items-center gap-1 uppercase tracking-widest"
                        >
                            <span>🔓</span> {text?.reveal_solution || "REVEAL SOLUTION"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StoryCard;

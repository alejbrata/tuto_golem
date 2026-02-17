import { useState } from 'react';

function StoryCard({ title, lore, lesson, hints = [], onSolve }) {
    const [activeTab, setActiveTab] = useState('lore');

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                    {title}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('lore')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 
            ${activeTab === 'lore'
                            ? 'border-yellow-500 text-yellow-500 bg-slate-800'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    📜 LORE
                </button>
                <button
                    onClick={() => setActiveTab('lesson')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 
            ${activeTab === 'lesson'
                            ? 'border-cyan-500 text-cyan-400 bg-slate-800'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    📘 LESSON
                </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto leading-relaxed text-slate-300 space-y-4">
                {activeTab === 'lore' && (
                    <div className="animate-in fade-in duration-300">
                        <p className="italic text-lg text-amber-100/80 border-l-4 border-amber-500/30 pl-4 py-2 bg-amber-900/10 rounded-r">
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
            <div className="p-4 bg-slate-900 border-t border-slate-700">
                <details className="group">
                    <summary className="cursor-pointer text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors list-none flex items-center gap-2">
                        <span className="bg-slate-800 p-1 rounded group-open:rotate-90 transition-transform">▶</span>
                        ORACLE HINTS
                    </summary>
                    <ul className="mt-3 space-y-2 text-sm text-cyan-300/80 pl-4 mb-4">
                        {hints.map((hint, i) => (
                            <li key={i} className="list-disc">{hint}</li>
                        ))}
                    </ul>

                    {/* Solution Button */}
                    {onSolve && (
                        <div className="pt-2 border-t border-slate-800">
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure? This will replace your current spell with the ancient solution.")) {
                                        onSolve();
                                    }
                                }}
                                className="text-xs text-rose-400/60 hover:text-rose-400 hover:underline transition-colors flex items-center gap-1"
                            >
                                <span>🔓</span> Reveal Arcane Solution
                            </button>
                        </div>
                    )}
                </details>
            </div>
        </div>
    );
}

export default StoryCard;

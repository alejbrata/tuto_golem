import React from 'react';

const CampaignMap = ({ chapters, currentChapterIndex, completedChapters, onSelectChapter }) => {
    return (
        <div className="flex flex-col items-center py-10 relative">
            {/* S-Line connector (Simple vertical line for now for robustness, curved SVG is harder to position dynamically) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-slate-800 -translate-x-1/2 z-0"></div>

            {chapters.map((chapter, index) => {
                const isCompleted = completedChapters.includes(chapter.id);
                const isCurrent = index === currentChapterIndex;

                // Unlock if it's the first chapter, OR if it's completed, OR if the previous chapter is completed
                const previousChapterCompleted = index > 0 && completedChapters.includes(chapters[index - 1].id);
                const isUnlocked = index === 0 || isCompleted || previousChapterCompleted;
                const isLocked = !isUnlocked;

                // Alternating sides for 'S' feel
                const isLeft = index % 2 === 0;

                return (
                    <div key={chapter.id} className={`relative z-10 w-full flex ${isLeft ? 'justify-end pr-[50%] pl-4' : 'justify-start pl-[50%] pr-4'} mb-12`}>

                        {/* Node Connector */}
                        <div className={`absolute left-1/2 -translate-x-1/2 top-4 w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-emerald-500 border-emerald-400' : isCurrent ? 'bg-indigo-600 border-indigo-400 animate-pulse' : 'bg-slate-900 border-slate-700'}`}></div>

                        {/* Card */}
                        <button
                            onClick={() => !isLocked && onSelectChapter(index)}
                            disabled={isLocked}
                            className={`
                w-full max-w-xs p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left
                ${isLeft ? 'mr-8' : 'ml-8'}
                ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/40' : ''}
                ${isCurrent ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : ''}
                ${isLocked ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' : ''}
              `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-mono tracking-wider ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-indigo-400' : 'text-slate-600'}`}>
                                    {chapter.id.replace('-', '.')}
                                </span>
                                {isCompleted && <span className="text-emerald-500">✓</span>}
                                {isLocked && <span className="text-slate-600">🔒</span>}
                            </div>
                            <h3 className={`font-bold text-sm leading-tight ${isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                                {chapter.title}
                            </h3>
                        </button>
                    </div >
                );
            })}
        </div >
    );
};

export default CampaignMap;

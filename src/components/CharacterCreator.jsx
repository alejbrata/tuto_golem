import { useState } from 'react';
import Golem from './Golem';
import { generateGolemDNA, decodeDNA } from '../engine/golemGen';

function CharacterCreator({ onComplete, language = "es", setLanguage, TEXT }) {
    const [dna, setDna] = useState(generateGolemDNA());
    const decoded = decodeDNA(dna);

    const handleReroll = () => {
        setDna(generateGolemDNA());
    };

    const CORES_TR = {
        'AMBER': { en: 'AMBER', es: 'ÁMBAR' },
        'COBALT': { en: 'COBALT', es: 'COBALTO' },
        'VERIDIAN': { en: 'VERIDIAN', es: 'VIRIDIAN' }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-900/40 rounded-full animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-800/30 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">

                {/* Language Switcher - Centered Top */}
                <div className="flex bg-slate-950/50 p-1 rounded-full border border-slate-700 mb-6">
                    <button
                        onClick={() => setLanguage('es')}
                        className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${language === 'es' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        ESPAÑOL
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        ENGLISH
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-2">
                    {TEXT?.forge_title || "FORGE YOUR GOLEM"}
                </h1>
                <p className="text-center text-slate-400 text-sm mb-8">
                    {TEXT?.forge_desc || "The DNA of your Construct determines its affinity."}
                </p>

                {/* Golem Preview */}
                <div className="h-64 mb-8 flex items-center justify-center bg-slate-950/50 rounded-lg border border-slate-800 relative">
                    <Golem dna={dna} stage={2} className="h-full w-auto" />

                    {/* DNA Display */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.2em] text-cyan-500/50">
                        {dna}
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500 mb-4">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            {TEXT?.type_label || "TYPE"}: <span className="text-slate-300">{TEXT?.construct || "CONSTRUCT"} {decoded.bodyType + 1}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            {TEXT?.core_label || "CORE"}: <span className={`text-${decoded.color.tw}-400`}>
                                {(CORES_TR[decoded.color.name.toUpperCase()]?.[language]) || decoded.color.name.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleReroll}
                        className="w-full py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white rounded-lg transition-colors font-mono tracking-wider"
                    >
                        🎲 {TEXT?.reroll || "RE-ROLL DNA"}
                    </button>

                    <button
                        onClick={() => onComplete(dna)}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02]"
                    >
                        {TEXT?.awaken || "AWAKEN GOLEM"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CharacterCreator;

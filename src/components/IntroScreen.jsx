import { useState, useEffect } from 'react';

function IntroScreen({ onComplete, language = 'es', setLanguage }) {
    const [step, setStep] = useState(0);

    const CONTENT = {
        es: [
            {
                title: "La Senda del Alquimista",
                subtitle: "De la Palabra a la Consciencia",
                icon: "📜",
                desc: "Bienvenido, aprendiz. Estás a punto de iniciar un viaje para insuflar vida a la materia muerta.",
                tech: "Conceptos: NLP, Tokenización, Modelos de Lenguaje",
                color: "text-slate-200"
            },
            {
                title: "Fase 1: El Hechizo",
                subtitle: "Ingeniería de Prompts",
                icon: "✨",
                desc: "Todo comienza con un susurro. Aprenderás a comandar al Golem con el poder del lenguaje.",
                tech: "Aprenderás: Zero-shot, Few-shot, Chain-of-Thought",
                color: "text-cyan-400"
            },
            {
                title: "Fase 2: El Alma",
                subtitle: "Embeddings y Vectores",
                icon: "💎",
                desc: "Las palabras son efímeras. Forjarás una memoria cristalina, enseñando al Golem a entender el significado tras los símbolos.",
                tech: "Aprenderás: Espacios Vectoriales, RAG, Búsqueda Semántica",
                color: "text-emerald-400"
            },
            {
                title: "Fase 3: Los Sentidos",
                subtitle: "Modelos de Visión y Audio",
                icon: "👁️",
                desc: "Una mente necesita percibir. Otorgarás al Golem ojos para ver y oídos para escuchar el mundo.",
                tech: "Aprenderás: Multimodalidad, CNNs, Whisper, Vision Transformers",
                color: "text-amber-400"
            },
            {
                title: "Fase 4: La Mente",
                subtitle: "Razonamiento y Agentes",
                icon: "🧠",
                desc: "Finalmente, prenderás la llama de la autonomía. El Golem pensará, planificará y actuará por sí mismo.",
                tech: "Aprenderás: Bucles de Agentes, ReAct, Uso de Herramientas",
                color: "text-violet-400"
            }
        ],
        en: [
            {
                title: "The Alchemist's Path",
                subtitle: "From Words to Consciousness",
                icon: "📜",
                desc: "Welcome, apprentice. You are about to embark on a journey to breathe life into dead matter.",
                tech: "Concepts: NLP, Tokenization, Large Language Models",
                color: "text-slate-200"
            },
            {
                title: "Phase 1: The Spell",
                subtitle: "Prompt Engineering",
                icon: "✨",
                desc: "It starts with a whisper. You will learn to command the Golem with the power of language.",
                tech: "Learn: Zero-shot, Few-shot, Chain-of-Thought",
                color: "text-cyan-400"
            },
            {
                title: "Phase 2: The Soul",
                subtitle: "Embeddings & Vector Databases",
                icon: "💎",
                desc: "Words are fleeting. You will forge a crystalline memory, teaching the Golem to understand meaning beyond symbols.",
                tech: "Learn: Vector Spaces, RAG, Semantic Search",
                color: "text-emerald-400"
            },
            {
                title: "Phase 3: The Senses",
                subtitle: "Vision & Audio Models",
                icon: "👁️",
                desc: "A mind needs to perceive. You will grant the Golem eyes to see and ears to hear the world.",
                tech: "Learn: Multimodality, CNNs, Whisper, Vision Transformers",
                color: "text-amber-400"
            },
            {
                title: "Phase 4: The Mind",
                subtitle: "Reasoning & Agents",
                icon: "🧠",
                desc: "Finally, you will spark the flame of autonomy. The Golem will think, plan, and act on its own.",
                tech: "Learn: Agent Loops, ReAct, Tool Use",
                color: "text-violet-400"
            }
        ]
    };

    const STEPS = CONTENT[language] || CONTENT['en'];

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 transition-opacity duration-1000">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 pointer-events-none" />

            {/* Language Toggle */}
            <div className="absolute top-8 right-8 z-50 flex gap-2">
                <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${language === 'es' ? 'bg-cyan-900 text-cyan-200 border border-cyan-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    ES
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${language === 'en' ? 'bg-cyan-900 text-cyan-200 border border-cyan-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    EN
                </button>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-fade-in">

                {/* Progress Bar */}
                <div className="flex justify-center gap-2 mb-8">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`}
                        />
                    ))}
                </div>

                {/* Content Card */}
                <div key={step} className="animate-slide-up bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-12 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                    <div className="text-6xl mb-6 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                        {STEPS[step].icon}
                    </div>

                    <h1 className={`text-4xl font-bold mb-2 font-display tracking-tight ${STEPS[step].color}`}>
                        {STEPS[step].title}
                    </h1>

                    <h2 className="text-xl text-slate-500 uppercase tracking-widest font-mono mb-4">
                        {STEPS[step].subtitle}
                    </h2>

                    {/* Tech Details Badge */}
                    <div className="inline-block px-4 py-1 mb-8 rounded-full bg-slate-950/50 border border-slate-800 text-xs font-mono text-slate-400 tracking-tight">
                        {STEPS[step].tech}
                    </div>

                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        {STEPS[step].desc}
                    </p>
                </div>

                {/* Button */}
                <button
                    onClick={handleNext}
                    className="group relative px-8 py-3 bg-cyan-900/30 hover:bg-cyan-800/50 text-cyan-200 border border-cyan-800/50 rounded-lg transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 font-mono tracking-wider flex items-center gap-2">
                        {step === STEPS.length - 1 ? (language === 'es' ? "DESPERTAR AL GOLEM" : "AWAKEN THE GOLEM") : (language === 'es' ? "CONTINUAR" : "PROCEED")}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-cyan-600/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default IntroScreen;

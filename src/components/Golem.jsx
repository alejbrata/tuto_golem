import { decodeDNA } from '../engine/golemGen';

function Golem({ dna, stage = 0, className = "" }) {
    const { bodyType, color } = decodeDNA(dna);

    // -- VISUAL LOGIC --
    // Stage 0: Dormant (Gray, Static)
    // Stage 1: Awakened (Color, Pulse) -> "Gained Soul Spark"
    // Stage 2: Empowered (Float, Glow) -> "Gained Levitation"
    // Stage 3: Enlightened (Third Eye) -> "Gained Third Eye"

    const isAwakened = stage >= 1;
    const isEmpowered = stage >= 2;

    // Colors
    const primaryColor = isAwakened ? color.hex : '#475569'; // Slate-600 dormant
    const coreFill = isAwakened ? primaryColor : '#334155';
    const bodyFill = '#1e293b'; // Slate-800
    const strokeColor = isAwakened ? '#94a3b8' : '#334155'; // Slate-400 vs Slate-700

    // Animations
    const floatClass = isEmpowered ? "animate-[bounce_3s_infinite]" : "";
    const pulseClass = isAwakened ? "animate-pulse" : "";

    // -- SVG PATHS --
    const BODIES = [
        <path d="M60 60 L140 60 L160 100 L150 220 L120 260 L80 260 L50 220 L40 100 Z" />, // Angular
        <path d="M100 50 L140 80 L160 150 L140 220 L100 250 L60 220 L40 150 L60 80 Z" />, // Hexagonal
        <path d="M50 50 L150 50 L130 150 L150 250 L50 250 L70 150 Z" /> // Trapezoid
    ];

    return (
        <div className={`relative ${className} ${floatClass}`}>

            {/* 0. AURA (Stage 2+) */}
            {stage >= 2 && (
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
                    style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
                ></div>
            )}

            <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl relative z-10 transition-all duration-1000">
                {/* 13. ASCENSION HALO (Back) */}
                {stage >= 13 && (
                    <circle cx="100" cy="150" r="130" stroke="url(#ascendedGradient)" strokeWidth="2" className="animate-[spin_20s_linear_infinite]" opacity="0.5" />
                )}

                {/* 7. ENERGY CAPE (Stage 7+) */}
                {stage >= 7 && (
                    <path d="M40 100 Q100 280 160 100 L140 280 Q100 320 60 280 Z" fill={primaryColor} opacity="0.3" className="animate-pulse" />
                )}

                {/* BASE BODY */}
                <g fill={bodyFill} stroke={strokeColor} strokeWidth="4" className="transition-colors duration-1000">
                    {BODIES[bodyType]}
                </g>

                {/* 1. SOUL SPARK (Internal Glow) */}
                {isAwakened && (
                    <path d="M70 100 L130 100 L120 200 L80 200 Z" fill={primaryColor} opacity="0.1" className="animate-pulse" />
                )}

                {/* 4. CRYSTAL BELT (Vector DB) */}
                {stage >= 4 && (
                    <g transform="translate(0, 20)">
                        <rect x="70" y="140" width="60" height="10" rx="2" fill="#0f172a" />
                        <circle cx="80" cy="145" r="3" fill={primaryColor} className="animate-ping" />
                        <circle cx="100" cy="145" r="3" fill={primaryColor} className="animate-ping" style={{ animationDelay: '0.3s' }} />
                        <circle cx="120" cy="145" r="3" fill={primaryColor} className="animate-ping" style={{ animationDelay: '0.6s' }} />
                    </g>
                )}

                {/* LIMBS (Always present but animate at Stage 2) */}
                <g stroke={strokeColor} strokeWidth="6" strokeLinecap="round">
                    {/* Left Arm */}
                    <path d="M40 100 Q20 150 30 200" fill="none" />
                    {/* Right Arm */}
                    <path d="M160 100 Q180 150 170 200" fill="none" />

                    {/* Hands */}
                    <circle cx="30" cy="200" r="8" fill={bodyFill} />
                    <circle cx="170" cy="200" r="8" fill={bodyFill} />
                </g>

                {/* 10. HALO OF CRITERION (RAG Eval) */}
                {stage >= 10 && (
                    <ellipse cx="100" cy="40" rx="50" ry="10" stroke={primaryColor} strokeWidth="2" fill="none" className="animate-[spin_5s_linear_infinite]" />
                )}

                {/* HEAD AREA */}

                {/* 6. RUNIC EARS (Audio) */}
                {stage >= 6 && (
                    <g>
                        <path d="M40 80 L30 60 L50 70" stroke={primaryColor} strokeWidth="2" fill="none" />
                        <path d="M160 80 L170 60 L150 70" stroke={primaryColor} strokeWidth="2" fill="none" />
                    </g>
                )}

                {/* CORE (Always present, lights up Stage 1) */}
                <g transform="translate(100, 150)">
                    {/* 9. LIGHT GEARS (Chains) */}
                    {stage >= 9 && (
                        <circle r="28" stroke={primaryColor} strokeWidth="1" strokeDasharray="4 4" fill="none" className="animate-[spin_10s_linear_infinite]" />
                    )}

                    <circle r="15" fill={bodyFill} stroke={coreFill} strokeWidth="3" />
                    {isAwakened && <circle r="8" fill={coreFill} className={pulseClass} />}
                </g>

                {/* EYES */}
                <g transform="translate(0, 0)">
                    {/* 5. MONOCLE (Vision) */}
                    {stage >= 5 && (
                        <circle cx="115" cy="85" r="10" stroke={primaryColor} strokeWidth="2" fill="none" opacity="0.8" />
                    )}

                    <circle cx="85" cy="85" r="6" fill={isAwakened ? primaryColor : '#000'} />
                    <circle cx="115" cy="85" r="6" fill={isAwakened ? primaryColor : '#000'} />
                </g>

                {/* 3. THIRD EYE (Semantic Search) */}
                {stage >= 3 && (
                    <path d="M100 65 L95 75 L100 85 L105 75 Z" fill={primaryColor} className="animate-pulse" />
                )}

                {/* 8. FLOATING GRIMOIRE (RAG) */}
                {stage >= 8 && (
                    <rect x="150" y="120" width="25" height="35" fill={primaryColor} stroke="#000" strokeWidth="2" className="animate-[bounce_4s_infinite]" rx="2" opacity="0.8" />
                )}

                {/* 11. ORBS OF AGENTS (Tools) */}
                {stage >= 11 && (
                    <g className="animate-[spin_6s_linear_infinite]" style={{ transformOrigin: '100px 150px' }}>
                        <circle cx="100" cy="90" r="5" fill="#fbbf24" />
                    </g>
                )}

                {/* 12. HIVE MIND (Multi Agent) */}
                {stage >= 12 && (
                    <g className="animate-[spin_6s_linear_infinite_reverse]" style={{ transformOrigin: '100px 150px' }}>
                        <circle cx="100" cy="210" r="5" fill="#a78bfa" />
                        <circle cx="40" cy="150" r="5" fill="#a78bfa" />
                        <circle cx="160" cy="150" r="5" fill="#a78bfa" />
                    </g>
                )}

                <defs>
                    <linearGradient id="ascendedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                        <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export default Golem;

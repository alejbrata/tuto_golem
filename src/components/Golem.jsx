import { decodeDNA } from '../engine/golemGen';

function Golem({ dna, stage = 0, className = "" }) {
    const { bodyType, coreType, eyeType, limbType, color } = decodeDNA(dna);

    // -- STAGE LOGIC --
    const isAwakened = stage >= 1;
    const isEmpowered = stage >= 2;

    // Colors based on stage
    const coreFill = isAwakened ? color.hex : '#475569';
    const eyeFill = isAwakened ? color.hex : '#000000';
    const strokeColor = '#1e293b';
    const bodyFill = '#334155';

    // Styles
    const glowStyle = isEmpowered ? { filter: `drop-shadow(0 0 8px ${color.hex})` } : {};
    const floatClass = isEmpowered ? "animate-[bounce_3s_infinite]" : "";
    const pulseClass = isAwakened ? "animate-pulse" : "";

    // -- SVG PATHS --
    const BODIES = [
        <path d="M60 60 L140 60 L160 100 L150 220 L120 260 L80 260 L50 220 L40 100 Z" />,
        <path d="M100 50 L140 80 L160 150 L140 220 L100 250 L60 220 L40 150 L60 80 Z" />,
        <path d="M50 50 L150 50 L130 150 L150 250 L50 250 L70 150 Z" />
    ];

    const LIMBS = [
        <g stroke={strokeColor} strokeWidth="6">
            <line x1="40" y1="100" x2="20" y2="180" />
            <line x1="160" y1="100" x2="180" y2="180" />
            <circle cx="20" cy="180" r="8" fill={bodyFill} />
            <circle cx="180" cy="180" r="8" fill={bodyFill} />
        </g>,
        <g fill={bodyFill} stroke={strokeColor}>
            <path d="M20 140 L30 160 L20 180 L10 160 Z" className={isEmpowered ? "animate-[spin_4s_linear_infinite]" : ""} />
            <path d="M180 140 L190 160 L180 180 L170 160 Z" className={isEmpowered ? "animate-[spin_4s_linear_infinite_reverse]" : ""} />
        </g>
    ];

    const EYES = [
        <rect x="80" y="80" width="40" height="10" fill={isAwakened ? color.hex : '#1e1e1e'} />,
        <g fill={isAwakened ? color.hex : '#1e1e1e'}>
            <circle cx="85" cy="85" r="6" />
            <circle cx="115" cy="85" r="6" />
        </g>,
        <path d="M70 80 L100 90 L130 80 L100 75 Z" fill={isAwakened ? color.hex : '#1e1e1e'} />
    ];

    const CORES = [
        <circle cx="100" cy="150" r="20" stroke={coreFill} strokeWidth="4" fill="none" className={isAwakened ? "animate-[spin_10s_linear_infinite]" : ""} />,
        <rect x="85" y="135" width="30" height="30" transform="rotate(45 100 150)" stroke={coreFill} strokeWidth="4" fill="none" />,
        <g stroke={coreFill} strokeWidth="3">
            <line x1="80" y1="140" x2="120" y2="140" />
            <line x1="80" y1="150" x2="120" y2="150" />
            <line x1="80" y1="160" x2="120" y2="160" />
        </g>
    ];

    return (
        <div className={`relative ${className} ${floatClass}`}>
            {isEmpowered && (
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
                    style={{ background: `radial-gradient(circle, ${color.hex} 0%, transparent 70%)` }}
                ></div>
            )}

            <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl relative z-10">
                {/* BACK LAYER */}
                {/* 7. ENERGY CAPE (Stage 7+) */}
                {stage >= 7 && (
                    <path d="M40 100 Q100 280 160 100 L140 280 Q100 320 60 280 Z" fill={color.hex} opacity="0.3" className="animate-pulse" />
                )}

                {/* BODY & LIMBS */}
                {LIMBS[limbType]}
                <g fill={bodyFill} stroke={strokeColor} strokeWidth="4">
                    {BODIES[bodyType]}
                </g>

                {/* CORE */}
                <g style={glowStyle}>
                    {CORES[coreType]}
                    {isAwakened && <circle cx="100" cy="150" r="8" fill={coreFill} className={pulseClass} />}
                </g>

                {/* EYES */}
                <g style={glowStyle}>{EYES[eyeType]}</g>

                {/* EVOLUTIONS */}
                {/* Stage 3: Third Eye */}
                {stage >= 3 && (
                    <path d="M95 65 L100 55 L105 65 L100 75 Z" fill={color.hex} className="animate-ping origin-center" style={{ transformBox: 'fill-box' }} />
                )}

                {/* Stage 4: Crystal Belt */}
                {stage >= 4 && (
                    <g>
                        <path d="M80 160 L120 160" stroke="#475569" strokeWidth="4" />
                        <rect x="95" y="155" width="10" height="10" fill="#334155" />
                        <circle cx="75" cy="160" r="4" fill={color.hex} className="animate-pulse" />
                        <circle cx="125" cy="160" r="4" fill={color.hex} className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </g>
                )}

                {/* Stage 5: Monocle */}
                {stage >= 5 && (
                    <g>
                        <circle cx="115" cy="85" r="10" stroke={color.hex} strokeWidth="2" fill="none" />
                        <line x1="115" y1="85" x2="135" y2="65" stroke={color.hex} strokeWidth="1" opacity="0.6" />
                    </g>
                )}

                {/* Stage 6: Runic Ears */}
                {stage >= 6 && (
                    <g>
                        <path d="M50 80 Q40 90 50 100" stroke={color.hex} strokeWidth="2" fill="none" />
                        <path d="M150 80 Q160 90 150 100" stroke={color.hex} strokeWidth="2" fill="none" />
                    </g>
                )}

                {/* Stage 8: Floating Grimoire */}
                {stage >= 8 && (
                    <g className="animate-[bounce_3s_infinite]" style={{ animationDelay: '1s' }}>
                        <rect x="160" y="140" width="30" height="40" fill="#fde047" stroke="#854d0e" strokeWidth="2" transform="rotate(10 175 160)" />
                    </g>
                )}

                {/* Stage 9: Light Gears */}
                {stage >= 9 && (
                    <g>
                        <circle cx="40" cy="100" r="12" stroke={color.hex} strokeWidth="2" fill="none" strokeDasharray="4 2" className="animate-[spin_4s_linear_infinite]" />
                        <circle cx="160" cy="100" r="12" stroke={color.hex} strokeWidth="2" fill="none" strokeDasharray="4 2" className="animate-[spin_4s_linear_infinite_reverse]" />
                    </g>
                )}

                {/* Stage 10: Halo of Criterion */}
                {stage >= 10 && (
                    <g>
                        <ellipse cx="100" cy="30" rx="40" ry="10" stroke={color.hex} strokeWidth="2" fill="none" className="animate-pulse" />
                    </g>
                )}

                {/* Stage 11: Orbs of Power */}
                {stage >= 11 && (
                    <g>
                        <circle r="6" fill="#fbbf24" className="animate-[spin_3s_linear_infinite]" style={{ offsetPath: 'path("M100 150 m-60 0 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0")', offsetDistance: '0%' }}>
                            <animateMotion dur="3s" repeatCount="indefinite" path="M100 150 m-60 0 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0" />
                        </circle>
                    </g>
                )}

                {/* Stage 12: Hive Mind (Mini-Golems) */}
                {stage >= 12 && (
                    <g opacity="0.5">
                        <path d="M30 220 L50 220 L40 250 Z" fill={bodyFill} />
                        <path d="M150 220 L170 220 L160 250 Z" fill={bodyFill} />
                    </g>
                )}

                {/* Stage 13: Ascended Form */}
                {stage >= 13 && (
                    <circle cx="100" cy="150" r="120" stroke="url(#ascendedGradient)" strokeWidth="1" className="animate-[spin_10s_linear_infinite]" />
                )}

                <defs>
                    <linearGradient id="ascendedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color.hex} stopOpacity="0" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor={color.hex} stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export default Golem;

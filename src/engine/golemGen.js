export const generateGolemDNA = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
};

export const decodeDNA = (dna = "0000000000000000") => {
    if (!dna || dna.length !== 16) dna = "0000000000000000";

    // Mapping 16 digits to traits
    // 0-1: Body Shape (3 types)
    // 2-3: Core Symbol (5 types)
    // 4-5: Primary Color (Hue)
    // 6-7: Eye Shape
    // 8-9: Limb Style
    // 10-15: Variance/Accessories

    const bodyType = parseInt(dna.substring(0, 2)) % 3;
    const coreType = parseInt(dna.substring(2, 4)) % 3;
    const colorHue = parseInt(dna.substring(4, 6)) % 5;
    const eyeType = parseInt(dna.substring(6, 8)) % 3;
    const limbType = parseInt(dna.substring(8, 10)) % 2;

    const COLORS = [
        { name: 'Amber', tw: 'amber', hex: '#fbbf24' },
        { name: 'Cyan', tw: 'cyan', hex: '#22d3ee' },
        { name: 'Violet', tw: 'violet', hex: '#a78bfa' },
        { name: 'Emerald', tw: 'emerald', hex: '#34d399' },
        { name: 'Rose', tw: 'rose', hex: '#fb7185' },
    ];

    const traitColor = COLORS[colorHue];

    return {
        bodyType,
        coreType,
        eyeType,
        limbType,
        color: traitColor,
    };
};

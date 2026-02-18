import { describe, it, expect } from 'vitest';
import { generateGolemDNA, decodeDNA } from './golemGen';

describe('Golem DNA Engine', () => {
    it('should generate a 16-digit DNA string', () => {
        const dna = generateGolemDNA();
        expect(dna).toHaveLength(16);
        expect(dna).toMatch(/^\d{16}$/);
    });

    it('should decode DNA correctly', () => {
        // Test a known DNA string
        // 00 -> Body 0
        // 00 -> Core 0
        // 00 -> Color 0 (Amber)
        // 00 -> Eye 0
        // 00 -> Limb 0
        const dna = "0000000000000000";
        const traits = decodeDNA(dna);

        expect(traits.bodyType).toBe(0);
        expect(traits.coreType).toBe(0);
        expect(traits.eyeType).toBe(0);
        expect(traits.limbType).toBe(0);
        expect(traits.color.name).toBe('Amber');
    });

    it('should handle invalid DNA gracefully', () => {
        const traits = decodeDNA("invalid");
        expect(traits).toBeDefined();
        // Should default to 0000...
        expect(traits.color.name).toBe('Amber');
    });
});

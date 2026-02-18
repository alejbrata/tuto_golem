import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../src/content');

console.log(`🔍 Scanning chapters in: ${contentDir}`);

let hasError = false;

try {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        console.error("❌ No chapter files found!");
        process.exit(1);
    }

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);

            // Validation Schema
            const requiredFields = ['id', 'title', 'lore', 'lesson', 'initialCode', 'validationCode', 'hints', 'solutionCode'];
            const missing = requiredFields.filter(field => !data[field]);

            if (missing.length > 0) {
                console.error(`❌ [${file}] Missing fields: ${missing.join(', ')}`);
                hasError = true;
            } else {
                console.log(`✅ [${file}] Validated successfully.`);
            }

        } catch (err) {
            console.error(`❌ [${file}] JSON Parse Error: ${err.message}`);
            hasError = true;
        }
    });

} catch (err) {
    console.error(`❌ Critical Error: ${err.message}`);
    process.exit(1);
}

if (hasError) {
    console.error("\n💥 Validation Failed.");
    process.exit(1);
} else {
    console.log("\n✨ All chapters are valid!");
    process.exit(0);
}

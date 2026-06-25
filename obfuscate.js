const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs-extra'); // Falls nicht vorhanden: npm install fs-extra
const path = require('path');

async function obfuscateProject() {
    const srcDir = path.join(__dirname, 'src');
    const outDir = path.join(__dirname, 'dist-obfuscated');

    // 1. Alten Output löschen und neu erstellen
    if (fs.existsSync(outDir)) {
        fs.removeSync(outDir);
    }
    fs.ensureDirSync(outDir);

    console.log('Starte Obfuscation...');

    // 2. Dateien kopieren und JS-Dateien verschlüsseln
    const files = await fs.readdir(srcDir, { recursive: true });

    for (const file of files) {
        const fullPath = path.join(srcDir, file);
        const targetPath = path.join(outDir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            fs.ensureDirSync(targetPath);
            continue;
        }

        if (file.endsWith('.js')) {
            const code = fs.readFileSync(fullPath, 'utf8');
            const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                numbersToExpressions: true,
                simplify: true,
                stringArrayThreshold: 0.75,
                unicodeEscapeSequence: false // spart Platz
            });
            fs.writeFileSync(targetPath, obfuscationResult.getObfuscatedCode());
            console.log(`Verschlüsselt: ${file}`);
        } else {
            // HTML, CSS, Bilder einfach nur kopieren
            fs.copySync(fullPath, targetPath);
        }
    }
    console.log('Obfuscation abgeschlossen! Dateien liegen in /dist-obfuscated');
}

obfuscateProject().catch(err => {
    console.error('Fehler beim Obfuscaten:', err);
    process.exit(1);
});